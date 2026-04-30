// Pay-an-invoice flow. Existing clients land on /pay, type the amount from
// their invoice, and we hand them off to Stripe Checkout. We persist nothing
// — the source of truth is Stripe (dashboard + the receipt email Stripe sends
// the client + the notification email the webhook sends the firm).
//
// Metadata `kind: "invoice"` lets the webhook tell invoice payments apart
// from the older booking-flow Stripe path.

import { NextResponse } from "next/server";
import { z } from "zod";
import { stripe, isStripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

// No firm-imposed minimum — Stripe enforces its own CAD floor (~$0.50)
// and will reject anything lower with a real error. Max $50,000 catches
// finger-trips on the keyboard — a real five-figure invoice is unusual
// but not impossible, so we allow it. Above that, we'd rather the client
// call the office anyway.
const PaySchema = z.object({
  clientName: z.string().min(2).max(120),
  clientEmail: z.string().email().max(200),
  invoiceNumber: z.string().max(80).optional().or(z.literal("")),
  amountCad: z.number().positive().max(50000),
  note: z.string().max(500).optional().or(z.literal("")),
  website: z.string().optional(), // honeypot
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = PaySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please double-check the fields and try again." },
      { status: 400 }
    );
  }
  const input = parsed.data;

  // Honeypot — silently 200 so bots can't tell they were caught.
  if (input.website && input.website.trim() !== "") {
    return NextResponse.json({ checkoutUrl: null });
  }

  if (!isStripeConfigured) {
    return NextResponse.json(
      {
        error:
          "Online payments are temporarily unavailable. Please call the office to pay your invoice.",
      },
      { status: 503 }
    );
  }

  const priceCents = Math.round(input.amountCad * 100);
  const invoiceNumber = (input.invoiceNumber ?? "").trim();
  const note = (input.note ?? "").trim();

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    req.headers.get("origin") ??
    "http://localhost:3000";

  const productName = invoiceNumber
    ? `Invoice payment — ${invoiceNumber}`
    : "Invoice payment";

  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: input.clientEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "cad",
            unit_amount: priceCents,
            product_data: {
              name: productName,
              description: `Payment from ${input.clientName}`,
            },
          },
        },
      ],
      // Everything we need for the firm-side alert lives in metadata.
      // Webhook reads this and emails info@rwelaw.ca on completion.
      metadata: {
        kind: "invoice",
        clientName: input.clientName,
        clientEmail: input.clientEmail,
        invoiceNumber,
        note,
      },
      success_url: `${origin}/pay/success`,
      cancel_url: `${origin}/pay/cancel`,
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (e) {
    console.error("[pay] Stripe checkout session creation failed", e);
    return NextResponse.json(
      {
        error:
          "We couldn't reach our payment processor. Please try again in a moment, or call the office.",
      },
      { status: 502 }
    );
  }
}
