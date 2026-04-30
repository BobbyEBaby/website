import { Resend } from "resend";
import twilio from "twilio";
import { createEvent } from "ics";
import type { Booking, Lawyer } from "@prisma/client";
import type Stripe from "stripe";
import { firm } from "@/data/firm";

const resendKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM_EMAIL ?? "bookings@rwelaw.ca";
const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;
const twilioFrom = process.env.TWILIO_FROM_NUMBER;

const resend = resendKey ? new Resend(resendKey) : null;
const twilioClient =
  twilioSid && twilioToken ? twilio(twilioSid, twilioToken) : null;

/** Build an ICS calendar invite string. */
function buildIcs(booking: Booking, lawyer: Lawyer) {
  return new Promise<string>((resolve, reject) => {
    const start = booking.start;
    createEvent(
      {
        start: [
          start.getUTCFullYear(),
          start.getUTCMonth() + 1,
          start.getUTCDate(),
          start.getUTCHours(),
          start.getUTCMinutes(),
        ],
        startInputType: "utc",
        duration: {
          minutes:
            Math.round(
              (booking.end.getTime() - booking.start.getTime()) / 60000
            ),
        },
        title: `${
          booking.service === "MEDIATION" ? "Mediation" : "Consultation"
        } with ${lawyer.name} — RWE Family Law`,
        description: `Service: ${booking.service}\nLawyer: ${lawyer.name}\nClient: ${booking.clientName}\n\nSummary: ${booking.clientSummary ?? "—"}\n\nReference: ${booking.id}`,
        location: "RWE Family Law, Vancouver, BC",
        organizer: { name: "RWE Family Law", email: resendFrom.replace(/.*<(.+)>/, "$1") },
        attendees: [
          {
            name: booking.clientName,
            email: booking.clientEmail,
            rsvp: false,
            partstat: "ACCEPTED",
            role: "REQ-PARTICIPANT",
          },
          {
            name: lawyer.name,
            email: lawyer.email,
            rsvp: false,
            partstat: "ACCEPTED",
            role: "REQ-PARTICIPANT",
          },
        ],
        status: "CONFIRMED",
        busyStatus: "BUSY",
      },
      (err, value) => {
        if (err) reject(err);
        else resolve(value);
      }
    );
  });
}

function formatInZone(d: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}

export async function notifyBookingConfirmed(
  booking: Booking,
  lawyer: Lawyer
) {
  const when = formatInZone(booking.start, lawyer.timezone);
  const service =
    booking.service === "MEDIATION" ? "mediation" : "consultation";
  const amount = `$${(booking.priceCents / 100).toFixed(2)} ${booking.currency}`;

  let ics = "";
  try {
    ics = await buildIcs(booking, lawyer);
  } catch (e) {
    console.error("ICS generation failed", e);
  }

  const attachments = ics
    ? [
        {
          filename: "consultation.ics",
          content: Buffer.from(ics).toString("base64"),
        },
      ]
    : undefined;

  const publicUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://rwelaw.ca";

  // --- Client email ---
  if (resend) {
    await resend.emails.send({
      from: resendFrom,
      to: booking.clientEmail,
      subject: `Your ${service} with ${lawyer.name} is confirmed`,
      text:
        `Hello ${booking.clientName},\n\n` +
        `Your ${service} with ${lawyer.name} at RWE Family Law is confirmed for:\n\n` +
        `  ${when}\n\n` +
        `Amount paid: ${amount}\n` +
        `Booking reference: ${booking.id}\n\n` +
        `If you need to reschedule or cancel, reply to this email at least 24 hours in advance.\n\n` +
        `We look forward to meeting you.\n\n` +
        `— RWE Family Law\n${publicUrl}`,
      attachments,
    });

    // --- Lawyer email ---
    await resend.emails.send({
      from: resendFrom,
      to: lawyer.email,
      subject: `New ${service}: ${booking.clientName} — ${when}`,
      text:
        `New ${service} booked.\n\n` +
        `Client: ${booking.clientName}\n` +
        `Email: ${booking.clientEmail}\n` +
        `Phone: ${booking.clientPhoneE164}\n` +
        `When:  ${when}\n` +
        `Urgency: ${booking.urgency}\n` +
        `Paid: ${amount}\n\n` +
        `Client's summary:\n${booking.clientSummary ?? "(not provided)"}\n\n` +
        `Reference: ${booking.id}`,
      attachments,
    });
  } else {
    console.log(
      "[notifications] Resend not configured — skipping emails for booking",
      booking.id
    );
  }

  // --- Lawyer SMS ---
  if (twilioClient && twilioFrom && lawyer.phoneE164) {
    try {
      await twilioClient.messages.create({
        from: twilioFrom,
        to: lawyer.phoneE164,
        body: `RWE: new ${service} — ${booking.clientName}, ${when}${
          booking.urgency === "URGENT" ? " [URGENT]" : ""
        }`,
      });
    } catch (e) {
      console.error("Twilio SMS failed", e);
    }
  } else {
    console.log(
      "[notifications] Twilio not configured or lawyer has no phone — skipping SMS"
    );
  }
}

/**
 * Notify the firm that an invoice payment cleared. Stripe sends the client
 * their own receipt automatically (because we set customer_email on the
 * Checkout Session) — this is purely the firm-side alert.
 */
export async function notifyInvoicePayment(
  session: Stripe.Checkout.Session
): Promise<void> {
  if (!resend) {
    console.log(
      "[notifications] Resend not configured — invoice payment notification skipped",
      session.id
    );
    return;
  }

  const clientName = session.metadata?.clientName ?? "(unknown)";
  const clientEmail =
    session.customer_email ?? session.metadata?.clientEmail ?? "(unknown)";
  const invoiceNumber = session.metadata?.invoiceNumber ?? "";
  const note = session.metadata?.note ?? "";
  const amountCents = session.amount_total ?? 0;
  const currency = (session.currency ?? "cad").toUpperCase();
  const amountStr = `$${(amountCents / 100).toFixed(2)} ${currency}`;
  const paymentIntent =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? "(none)";

  const subject = invoiceNumber
    ? `[Payment] $${(amountCents / 100).toFixed(2)} from ${clientName} — invoice ${invoiceNumber}`
    : `[Payment] $${(amountCents / 100).toFixed(2)} from ${clientName}`;

  const body =
    `Invoice payment received via the website.\n\n` +
    `Amount:          ${amountStr}\n` +
    `Client:          ${clientName}\n` +
    `Email:           ${clientEmail}\n` +
    `Invoice number:  ${invoiceNumber || "(not provided)"}\n` +
    `Note from payer: ${note || "(none)"}\n\n` +
    `Stripe references:\n` +
    `  Checkout session:  ${session.id}\n` +
    `  Payment intent:    ${paymentIntent}\n\n` +
    `The client has been emailed a Stripe receipt automatically.\n` +
    `Reconcile this against the matching file.\n`;

  await resend.emails.send({
    from: resendFrom,
    to: firm.email,
    subject,
    text: body,
  });
}

/**
 * Notify the firm that a retainer deposit cleared into the TRUST account.
 *
 * Distinct from notifyInvoicePayment because:
 *   - The funds are trust funds — bookkeeping, ledger, and reconciliation
 *     all happen in trust, not in operating.
 *   - Stripe deducts its fee before deposit, so the firm needs both the
 *     gross (charged) and the net (received) figures to record the
 *     correct amount in the trust ledger.
 */
export async function notifyRetainerPayment(
  session: Stripe.Checkout.Session
): Promise<void> {
  if (!resend) {
    console.log(
      "[notifications] Resend not configured — retainer payment notification skipped",
      session.id
    );
    return;
  }

  const clientName = session.metadata?.clientName ?? "(unknown)";
  const clientEmail =
    session.customer_email ?? session.metadata?.clientEmail ?? "(unknown)";
  const matterReference = session.metadata?.matterReference ?? "";
  const note = session.metadata?.note ?? "";
  const grossCents = session.amount_total ?? 0;
  const currency = (session.currency ?? "cad").toUpperCase();

  // Stripe Canada standard card pricing: 2.9% + $0.30. The actual fee is
  // available via Balance Transactions, but for the firm-side alert an
  // estimate is enough — the bookkeeper will reconcile against the real
  // figure in the Stripe dashboard / bank statement.
  const estFeeCents = Math.round(grossCents * 0.029) + 30;
  const estNetCents = grossCents - estFeeCents;

  const fmt = (c: number) => `$${(c / 100).toFixed(2)}`;
  const grossStr = `${fmt(grossCents)} ${currency}`;
  const feeStr = `${fmt(estFeeCents)} ${currency}`;
  const netStr = `${fmt(estNetCents)} ${currency}`;

  const paymentIntent =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? "(none)";

  const subject = matterReference
    ? `[Retainer] ${fmt(grossCents)} from ${clientName} — ${matterReference}`
    : `[Retainer] ${fmt(grossCents)} from ${clientName}`;

  const body =
    `Retainer deposit received via the website (TRUST account).\n\n` +
    `Charged to client:    ${grossStr}\n` +
    `Stripe fee (est.):    ${feeStr}\n` +
    `Net to trust (est.):  ${netStr}\n\n` +
    `Client:               ${clientName}\n` +
    `Email:                ${clientEmail}\n` +
    `Matter / reference:   ${matterReference || "(not provided)"}\n` +
    `Note from client:     ${note || "(none)"}\n\n` +
    `Stripe references (TRUST account):\n` +
    `  Checkout session:   ${session.id}\n` +
    `  Payment intent:     ${paymentIntent}\n\n` +
    `Reconcile the actual fee and net deposit against the trust account\n` +
    `bank statement / Stripe balance transactions before recording in the\n` +
    `trust ledger. The figures above are estimates based on standard\n` +
    `Stripe Canada pricing (2.9% + $0.30).\n`;

  await resend.emails.send({
    from: resendFrom,
    to: firm.email,
    subject,
    text: body,
  });
}
