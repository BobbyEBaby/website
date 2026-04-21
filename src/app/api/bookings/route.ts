import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { getAvailableSlots } from "@/lib/availability";

export const dynamic = "force-dynamic";

const BookingSchema = z.object({
  lawyerSlug: z.string().min(1),
  service: z.enum(["CONSULTATION", "MEDIATION"]),
  startIso: z.string().datetime(),
  clientName: z.string().min(2).max(120),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(7).max(40),
  clientSummary: z.string().max(4000).optional().or(z.literal("")),
  urgency: z.enum(["NORMAL", "URGENT"]).default("NORMAL"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = BookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const input = parsed.data;

  const lawyer = await prisma.lawyer.findUnique({
    where: { slug: input.lawyerSlug },
  });
  if (!lawyer || !lawyer.active) {
    return NextResponse.json({ error: "Lawyer not found" }, { status: 404 });
  }
  if (input.service === "MEDIATION" && !lawyer.isMediator) {
    return NextResponse.json(
      { error: "This lawyer does not offer mediation." },
      { status: 400 }
    );
  }

  const slotMinutes =
    input.service === "MEDIATION"
      ? lawyer.mediationMinutes ?? 90
      : lawyer.consultationMinutes;
  const priceCents =
    input.service === "MEDIATION"
      ? lawyer.mediationRateCents ?? lawyer.consultationRateCents * 2
      : lawyer.consultationRateCents;

  const start = new Date(input.startIso);
  const end = new Date(start.getTime() + slotMinutes * 60 * 1000);

  // Re-verify slot is still available.
  const slots = await getAvailableSlots({
    lawyerId: lawyer.id,
    from: start,
    to: new Date(end.getTime() + 1),
    slotMinutes,
    bufferMinutes: lawyer.bufferMinutes,
    minNoticeHours: lawyer.minNoticeHours,
  });
  const stillAvailable = slots.some(
    (s) => s.start.getTime() === start.getTime()
  );
  if (!stillAvailable) {
    return NextResponse.json(
      { error: "That time is no longer available. Please pick another." },
      { status: 409 }
    );
  }

  if (!isStripeConfigured) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local.",
      },
      { status: 503 }
    );
  }

  // Create pending booking.
  const booking = await prisma.booking.create({
    data: {
      lawyerId: lawyer.id,
      service: input.service,
      start,
      end,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientPhoneE164: input.clientPhone,
      clientSummary: input.clientSummary || null,
      urgency: input.urgency,
      priceCents,
      currency: "CAD",
      status: "PENDING_PAYMENT",
    },
  });

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    req.headers.get("origin") ??
    "http://localhost:3000";

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: booking.clientEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "cad",
          unit_amount: priceCents,
          product_data: {
            name: `${
              input.service === "MEDIATION" ? "Mediation" : "Consultation"
            } with ${lawyer.name}`,
            description: `${slotMinutes} minutes · ${new Date(
              start
            ).toLocaleString("en-CA", {
              timeZone: lawyer.timezone,
              dateStyle: "full",
              timeStyle: "short",
            })}`,
          },
        },
      },
    ],
    metadata: {
      bookingId: booking.id,
    },
    success_url: `${origin}/book/success?token=${booking.confirmationToken}`,
    cancel_url: `${origin}/book/cancel?token=${booking.confirmationToken}`,
  });

  await prisma.booking.update({
    where: { id: booking.id },
    data: { stripeCheckoutSessionId: session.id },
  });

  return NextResponse.json({
    bookingId: booking.id,
    checkoutUrl: session.url,
  });
}
