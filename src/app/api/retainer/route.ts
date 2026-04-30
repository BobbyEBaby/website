// Retainer-deposit flow. Funds go to the firm's TRUST bank account via a
// dedicated Stripe account (separate from the operating /pay flow). Same
// metadata convention as /pay (kind: "retainer") so the trust webhook
// knows what it's looking at.
//
// IMPORTANT — fee disclosure:
//   Stripe deducts ~2.9% + $0.30 from each transaction before it lands in
//   the trust bank account. The /retainer page surfaces this to the client
//   so they understand their trust balance reflects the net amount, not
//   the full charged amount.

import { NextResponse } from "next/server";
import { z } from "zod";
import { stripeTrust, isStripeTrustConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

const RetainerSchema = z.object({
  clientName: z.string().min(2).max(120),
  clientEmail: z.string().email().max(200),
  matterReference: z.string().max(120).optional().or(z.literal("")),
  amountCad: z.number().min(50).max(100000),
  note: z.string().max(500).optional().or(z.literal("")),
  website: z.string().optional(), // honeypot
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = RetainerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please double-check the fields and try again." },
      { status: 400 }
    );
  }
  const input = parsed.data;

  if (input.website && input.website.trim() !== "") {
    return NextResponse.json({ checkoutUrl: null });
  }

  if (!isStripeTrustConfigured) {
    return NextResponse.json(
      {
        error:
          "Online retainer deposits are temporarily unavailable. Please call the office to arrange another method.",
      },
      { status: 503 }
    );
  }

  const priceCents = Math.round(input.amountCad * 100);
  const matterReference = (input.matterReference ?? "").trim();
  const note = (input.note ?? "").trim();

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    req.headers.get("origin") ??
    "http://localhost:3000";

  const productName = matterReference
    ? `Retainer deposit — ${matterReference}`
    : "Retainer deposit";

  try {
    const session = await stripeTrust().checkout.sessions.create({
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
              description: `Trust deposit from ${input.clientName}`,
            },
          },
        },
      ],
      metadata: {
        kind: "retainer",
        clientName: input.clientName,
        clientEmail: input.clientEmail,
        matterReference,
        note,
      },
      success_url: `${origin}/retainer/success`,
      cancel_url: `${origin}/retainer/cancel`,
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (e) {
    console.error("[retainer] Stripe checkout session creation failed", e);
    return NextResponse.json(
      {
        error:
          "We couldn't reach our payment processor. Please try again in a moment, or call the office.",
      },
      { status: 502 }
    );
  }
}
