// Webhook endpoint for the TRUST Stripe account (retainer deposits).
//
// This is a SEPARATE endpoint from /api/stripe/webhook because:
//   1. Each Stripe account has its own webhook signing secret. We need a
//      distinct STRIPE_TRUST_WEBHOOK_SECRET to verify events from the
//      trust account, alongside the operating account's signing secret.
//   2. Law Society of BC trust accounting rules require trust funds and
//      operating funds to be kept absolutely separate. Mirroring that
//      separation in code (separate keys, separate endpoint, separate
//      Stripe client) makes the boundary auditable.
//
// Like the operating webhook, this path must be excluded from the
// preview-mode Basic Auth middleware — Stripe's servers can't send
// HTTP Basic credentials. See src/middleware.ts.

import { NextResponse } from "next/server";
import { stripeTrust } from "@/lib/stripe";
import { notifyRetainerPayment } from "@/lib/notifications";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const trustWebhookSecret = process.env.STRIPE_TRUST_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!trustWebhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_TRUST_WEBHOOK_SECRET not configured" },
      { status: 503 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripeTrust().webhooks.constructEvent(
      rawBody,
      signature,
      trustWebhookSecret
    );
  } catch (e) {
    console.error("[stripe webhook-trust] signature verification failed", e);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Defensive: this endpoint should only ever receive retainer events
    // because it's wired to the trust account, but check anyway in case
    // someone misconfigures the dashboard.
    if (session.metadata?.kind !== "retainer") {
      console.warn(
        "[stripe webhook-trust] received non-retainer event on trust endpoint",
        { kind: session.metadata?.kind, sessionId: session.id }
      );
      return NextResponse.json({ received: true });
    }

    try {
      await notifyRetainerPayment(session);
    } catch (err) {
      console.error("[stripe webhook-trust] notifyRetainerPayment failed", err);
    }
  }

  return NextResponse.json({ received: true });
}
