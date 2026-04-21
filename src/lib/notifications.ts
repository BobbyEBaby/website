import { Resend } from "resend";
import twilio from "twilio";
import { createEvent } from "ics";
import type { Booking, Lawyer } from "@prisma/client";

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
