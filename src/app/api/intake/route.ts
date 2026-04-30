// New-client intake form. Substantially more detailed than /api/contact —
// collects relationship dates, financial info, kids' birthdates, etc. — so
// the firm can prepare for the consult instead of starting from scratch.
//
// Privacy/compliance notes:
//   - We persist nothing. The email IS the record. Same model as /pay.
//   - The conflict screen still runs server-side on (client, opposing) so
//     a possible-conflict file can't slip through to the firm inbox
//     unflagged.
//   - Per Robert: every field is optional. We require only that the client
//     give us SOME way to reach back (name + at least email or phone) —
//     otherwise the firm receives an unactionable email.

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { firm } from "@/data/firm";
import { checkConflict, formatConflictAlert } from "@/lib/conflict-check";

const resendKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM_EMAIL ?? "bookings@rwelaw.ca";
const resend = resendKey ? new Resend(resendKey) : null;

type Payload = Record<string, unknown>;

function str(v: unknown, max = 5000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function field(label: string, value: string): string {
  // Pad labels to a fixed width so the email reads as a clean two-column
  // form. Multi-line values (textareas) get put on their own line below
  // the label so they don't break alignment.
  const padded = label.padEnd(28);
  if (!value) return `${padded}(not provided)`;
  if (value.includes("\n")) {
    return `${label}:\n${value
      .split("\n")
      .map((l) => `  ${l}`)
      .join("\n")}`;
  }
  return `${padded}${value}`;
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // Honeypot — silently 200 so bots can't tell they were caught.
  if (str(body.website)) {
    return NextResponse.json({ ok: true });
  }

  // Pull every field. All are optional from the client's perspective.
  const f = {
    clientName: str(body.clientName, 160),
    phone: str(body.phone, 40),
    email: str(body.email, 200),
    opposingName: str(body.opposingName, 160),
    nextCourtDate: str(body.nextCourtDate, 80),
    courtLocation: str(body.courtLocation, 160),
    opposingLawyer: str(body.opposingLawyer, 160),
    marriageDate: str(body.marriageDate, 80),
    separationDate: str(body.separationDate, 80),
    children: str(body.children, 2000),
    assets: str(body.assets, 5000),
    debts: str(body.debts, 5000),
    clientIncome: str(body.clientIncome, 200),
    opposingIncome: str(body.opposingIncome, 200),
    retainerSource: str(body.retainerSource, 500),
    occupation: str(body.occupation, 200),
    occupationAddress: str(body.occupationAddress, 300),
    occupationPhone: str(body.occupationPhone, 40),
    objective: str(body.objective, 2000),
    questions: str(body.questions, 5000),
  };

  // Soft floor: we need to be able to reply. Without name + (email | phone),
  // the email would be unactionable, so reject with a clear message.
  if (!f.clientName || (!f.email && !f.phone)) {
    return NextResponse.json(
      {
        error:
          "Please give us at least your name and either an email or phone number so we can respond.",
      },
      { status: 400 }
    );
  }
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 400 }
    );
  }

  // Conflict screen — same call signature as the contact form. Only the
  // opposing party is checked; the opposing lawyer's name is reproduced
  // in the alert body for human review.
  const conflict = await checkConflict({
    clientName: f.clientName,
    opposingName: f.opposingName,
  });
  const conflictBlock = formatConflictAlert(
    { clientName: f.clientName, opposingName: f.opposingName },
    conflict
  );

  if (!resend) {
    console.log("[intake] Resend not configured — logging payload only", {
      clientName: f.clientName,
      email: f.email,
      phone: f.phone,
      conflictHits: conflict.hits.length,
    });
    return NextResponse.json({ ok: true });
  }

  const subjectPrefix = conflictBlock
    ? "[Intake] ⚠️ POSSIBLE CONFLICT"
    : "[Intake]";
  const emailSubject = `${subjectPrefix} ${f.clientName}`;

  const sectionDivider = "\n" + "-".repeat(48) + "\n\n";

  const emailBody =
    (conflictBlock ? `${conflictBlock}${sectionDivider}` : "") +
    `New client intake from ${firm.domain}\n\n` +
    `CONTACT\n` +
    `${field("Name", f.clientName)}\n` +
    `${field("Phone", f.phone)}\n` +
    `${field("Email", f.email)}\n` +
    sectionDivider +
    `OTHER SIDE\n` +
    `${field("Other side's name", f.opposingName)}\n` +
    `${field("Other side's lawyer", f.opposingLawyer)}\n` +
    `${field("Other side's income", f.opposingIncome)}\n` +
    sectionDivider +
    `RELATIONSHIP\n` +
    `${field("Marriage / cohabitation", f.marriageDate)}\n` +
    `${field("Separation", f.separationDate)}\n` +
    sectionDivider +
    `CHILDREN\n` +
    `${field("Names and birthdates", f.children)}\n` +
    sectionDivider +
    `COURT\n` +
    `${field("Next court date", f.nextCourtDate)}\n` +
    `${field("Court location", f.courtLocation)}\n` +
    sectionDivider +
    `FINANCES\n` +
    `${field("Client income", f.clientIncome)}\n` +
    `${field("Source of retainer funds", f.retainerSource)}\n` +
    `${field("Assets", f.assets)}\n` +
    `${field("Debts", f.debts)}\n` +
    sectionDivider +
    `WORK\n` +
    `${field("Occupation", f.occupation)}\n` +
    `${field("Business address", f.occupationAddress)}\n` +
    `${field("Business phone", f.occupationPhone)}\n` +
    sectionDivider +
    `GOALS\n` +
    `${field("Objective / goal", f.objective)}\n` +
    `${field("Questions or concerns", f.questions)}\n`;

  try {
    const result = await resend.emails.send({
      from: resendFrom,
      to: firm.email,
      replyTo: f.email || undefined,
      subject: emailSubject,
      text: emailBody,
    });
    if (result.error) {
      console.error("[intake] Resend returned error", result.error);
      return NextResponse.json(
        {
          error:
            "Something went wrong sending your form. Please try again or call us.",
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[intake] Resend send threw", e);
    return NextResponse.json(
      {
        error:
          "Something went wrong sending your form. Please try again or call us.",
      },
      { status: 500 }
    );
  }
}
