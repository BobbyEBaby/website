// Pre-Calendly conflict screen for the booking flow. The user enters their
// name and the opposing party's name on a step that sits between "Choose
// lawyer" and the Calendly embed. We screen against the conflict database
// here and email the firm if there's a hit. The user always proceeds — per
// Robert's call, the firm cancels conflicted bookings manually.

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { firm } from "@/data/firm";
import { getLawyerBySlug } from "@/data/lawyers";
import { checkConflict, formatConflictAlert } from "@/lib/conflict-check";

const resendKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM_EMAIL ?? "website@rwelaw.ca";
const resend = resendKey ? new Resend(resendKey) : null;

type Payload = {
  clientName?: unknown;
  opposingName?: unknown;
  lawyerSlug?: unknown;
  service?: unknown; // "CONSULTATION" | "MEDIATION"
  website?: unknown; // honeypot
};

function str(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // Honeypot — silently 200 if filled
  if (str(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const clientName = str(body.clientName, 120);
  const opposingName = str(body.opposingName, 120);
  const lawyerSlug = str(body.lawyerSlug, 80);
  const service = str(body.service, 20).toUpperCase();

  if (!clientName || !opposingName) {
    return NextResponse.json(
      { error: "Please provide your name and the other side's name." },
      { status: 400 }
    );
  }
  if (service !== "CONSULTATION" && service !== "MEDIATION") {
    return NextResponse.json({ error: "Invalid service." }, { status: 400 });
  }

  const lawyer = lawyerSlug ? getLawyerBySlug(lawyerSlug) : null;
  if (!lawyer) {
    return NextResponse.json({ error: "Unknown lawyer." }, { status: 400 });
  }

  // Run the screen. Always returns 200 to the caller — the user must always
  // be allowed to continue to Calendly.
  const conflict = await checkConflict({ clientName, opposingName });

  if (conflict.hits.length === 0) {
    // No hit — nothing to do. Booking notification will arrive via Calendly.
    return NextResponse.json({ ok: true });
  }

  const alertBlock = formatConflictAlert({ clientName, opposingName }, conflict);

  if (!resend) {
    console.log("[booking-screen] Resend not configured — conflict logged only", {
      clientName,
      opposingName,
      lawyer: lawyer.name,
      service,
      hits: conflict.hits.length,
    });
    return NextResponse.json({ ok: true });
  }

  try {
    await resend.emails.send({
      from: resendFrom,
      to: firm.email,
      subject: `[Booking] ⚠️ POSSIBLE CONFLICT — ${clientName} vs. ${opposingName}`,
      text:
        `${alertBlock}\n\n` +
        `----------------------------------------\n\n` +
        `Booking-flow conflict alert from ${firm.domain}\n\n` +
        `Client name:        ${clientName}\n` +
        `Other side's name:  ${opposingName}\n` +
        `Lawyer chosen:      ${lawyer.name}\n` +
        `Service:            ${service === "MEDIATION" ? "Mediation" : "Consultation"}\n\n` +
        `The user will continue to the Calendly embed and may complete the booking.\n` +
        `Per firm policy, conflicted bookings are cancelled manually after they're made.\n` +
        `Watch for the matching Calendly notification email and cancel from there.\n`,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    // Don't block the booking just because the alert email failed — log and
    // continue. The booking will still go through Calendly; the firm will
    // see it via the normal Calendly notification.
    console.error("[booking-screen] conflict alert email failed", e);
    return NextResponse.json({ ok: true });
  }
}
