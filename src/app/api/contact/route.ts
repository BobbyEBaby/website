import { NextResponse } from "next/server";
import { Resend } from "resend";
import { firm } from "@/data/firm";

const resendKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM_EMAIL ?? "website@rwelaw.ca";
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
  const subject = str(body.subject, 160) || "Website enquiry";
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

  if (!resend) {
    console.log("[contact] Resend not configured — logging payload only", {
      name,
      email,
      phone,
      subject,
      message,
    });
    return NextResponse.json({ ok: true });
  }

  try {
    await resend.emails.send({
      from: resendFrom,
      to: firm.email,
      replyTo: email,
      subject: `[Website] ${subject}`,
      text:
        `New contact-form message from ${firm.domain}\n\n` +
        `Name:    ${name}\n` +
        `Email:   ${email}\n` +
        `Phone:   ${phone || "(not provided)"}\n` +
        `Subject: ${subject}\n\n` +
        `Message:\n${message}\n`,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact] Resend send failed", e);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please try again or call us." },
      { status: 500 }
    );
  }
}
