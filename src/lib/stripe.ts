import Stripe from "stripe";

// Two distinct Stripe accounts:
//   - Operating: STRIPE_SECRET_KEY — invoice payments (/pay), funds go to
//     the firm's operating bank account.
//   - Trust:     STRIPE_TRUST_SECRET_KEY — retainer deposits (/retainer),
//     funds go to the firm's trust bank account. NEVER commingle these in
//     code; Law Society of BC trust accounting rules require an absolute
//     separation between client funds and firm funds.
const operatingKey = process.env.STRIPE_SECRET_KEY;
const trustKey = process.env.STRIPE_TRUST_SECRET_KEY;

const apiVersion = "2025-02-24.acacia" as const;

/**
 * Lazily-initialized Stripe client for the firm's OPERATING account.
 * Missing keys throw at first use rather than at import — so marketing
 * pages render even before Stripe is wired.
 */
let _stripe: Stripe | null = null;
export function stripe(): Stripe {
  if (_stripe) return _stripe;
  if (!operatingKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local before using the operating Stripe flow."
    );
  }
  _stripe = new Stripe(operatingKey, { apiVersion });
  return _stripe;
}

/**
 * Lazily-initialized Stripe client for the firm's TRUST account.
 * Used only by the /retainer flow. Independent of stripe() above by design
 * — separate keys, separate dashboard, separate bank account.
 */
let _stripeTrust: Stripe | null = null;
export function stripeTrust(): Stripe {
  if (_stripeTrust) return _stripeTrust;
  if (!trustKey) {
    throw new Error(
      "STRIPE_TRUST_SECRET_KEY is not set. Add it before using the retainer flow."
    );
  }
  _stripeTrust = new Stripe(trustKey, { apiVersion });
  return _stripeTrust;
}

export const isStripeConfigured = Boolean(operatingKey);
export const isStripeTrustConfigured = Boolean(trustKey);
