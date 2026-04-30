import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import {
  notifyBookingConfirmed,
  notifyInvoicePayment,
} from "@/lib/notifications";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET not configured" },
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
    event = stripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (e) {
    console.error("Webhook signature verification failed", e);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Invoice-payment branch (from /pay flow). No DB record — Stripe is the
    // system of record; we only email the firm so they know to reconcile.
    if (session.metadata?.kind === "invoice") {
      try {
        await notifyInvoicePayment(session);
      } catch (err) {
        console.error("[stripe webhook] notifyInvoicePayment failed", err);
      }
      return NextResponse.json({ received: true });
    }

    // Booking-payment branch (legacy native booking flow — currently unused
    // because production hands off to Calendly, but kept wired in case we
    // bring it back).
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });
      if (booking && booking.status === "PENDING_PAYMENT") {
        const updated = await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: "CONFIRMED",
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
            lawyerNotifiedAt: new Date(),
          },
        });
        const lawyer = await prisma.lawyer.findUnique({
          where: { id: updated.lawyerId },
        });
        if (lawyer) {
          try {
            await notifyBookingConfirmed(updated, lawyer);
          } catch (err) {
            console.error("Notification failed for booking", bookingId, err);
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
