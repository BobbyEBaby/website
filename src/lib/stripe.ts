import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

/**
 * Lazily-initialized Stripe client. Missing keys throw at first use rather
 * than at import — so marketing pages render even before Stripe is wired.
 */
let _stripe: Stripe | null = null;
export function stripe(): Stripe {
  if (_stripe) return _stripe;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local before using booking."
    );
  }
  _stripe = new Stripe(key, { apiVersion: "2025-02-24.acacia" });
  return _stripe;
}

export const isStripeConfigured = Boolean(key);
