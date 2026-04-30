import { NextResponse } from "next/server";
import { Resend } from "resend";
import { firm } from "@/data/firm";
import { checkConflict, formatConflictAlert } from "@/lib/conflict-check";

const resendKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM_EMAIL ?? "bookings@rwelaw.ca";
const resend = resendKey ? new Resend(resendKey) : null;

type Payload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
};

function str(v: unknown, max = 2000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (str(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const name = str(body.name, 120);
  const email = str(body.email, 200);
  const phone = str(body.phone, 40);
  const opposingName = str(body.subject, 160); // "subject" field label = "Other side's name"
  const message = str(body.message, 5000);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please provide your name, email, and a message." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 400 }
    );
  }

  // Run the conflict screen server-side. The "subject" field is labelled
  // "Other side's name" on the contact form. Result never reaches the browser.
  const conflict = await checkConflict({ clientName: name, opposingName: opposingName });
  const conflictBlock = formatConflictAlert(
    { clientName: name, opposingName: opposingName },
    conflict
  );

  if (!resend) {
    console.log("[contact] Resend not configured — logging payload only", {
      name,
      email,
      phone,
      opposingName,
      message,
      conflictHits: conflict.hits.length,
    });
    return NextResponse.json({ ok: true });
  }

  const subjectPrefix = conflictBlock ? "[Website] ⚠️ POSSIBLE CONFLICT" : "[Website]";
  const emailSubject = `${subjectPrefix} ${name}`;
  const emailBody =
    (conflictBlock ? `${conflictBlock}\n\n----------------------------------------\n\n` : "") +
    `New contact-form message from ${firm.domain}\n\n` +
    `Name:    ${name}\n` +
    `Email:   ${email}\n` +
    `Phone:   ${phone || "(not provided)"}\n` +
    `Other side's name: ${opposingName || "(not provided)"}\n\n` +
    `Message:\n${message}\n`;

  try {
    // The Resend SDK returns { data, error } and does NOT throw on API
    // validation failures (e.g. unverified-domain restrictions, malformed
    // sender, rate limit). Always check result.error explicitly — silently
    // returning ok on a rejected send is what burned us during the initial
    // production wiring.
    const result = await resend.emails.send({
      from: resendFrom,
      to: firm.email,
      replyTo: email,
      subject: emailSubject,
      text: emailBody,
    });
    if (result.error) {
      console.error("[contact] Resend returned error", result.error);
      return NextResponse.json(
        { error: "Something went wrong sending your message. Please try again or call us." },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact] Resend send threw", e);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please try again or call us." },
      { status: 500 }
    );
  }
}
