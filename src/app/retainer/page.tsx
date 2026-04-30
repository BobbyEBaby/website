import type { Metadata } from "next";
import { firm } from "@/data/firm";
import { Container, SectionHeading } from "@/components/ui";
import { RetainerForm } from "@/components/retainer-form";

export const metadata: Metadata = {
  title: "Deposit a retainer",
  description:
    "Deposit funds into RWE Family Law's pooled trust account. Secure card payment via Stripe.",
};

export default function RetainerPage() {
  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-3xl">
        <SectionHeading
          eyebrow="For clients"
          title={<>Deposit a retainer.</>}
          lead="Pay your retainer online and we'll hold the funds in our pooled trust account until they're earned. You'll be handed off to Stripe to enter your card; an emailed receipt arrives the moment payment clears."
        />
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="order-2 md:order-1 space-y-8">
          <RetainerForm />

          {/* Fee disclosure — required so clients understand the trust
              balance reflects the net amount, not the full charged amount.
              Per Robert: show $5,000 worked example; advise alternatives
              (e-transfer, wire, cash) for clients who want to avoid fees. */}
          <div className="rounded-xl border border-[color:var(--color-gold-400)] bg-[color:var(--color-gold-300)]/20 p-6 md:p-7">
            <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-gold-600)] mb-2">
              Important — about card fees
            </div>
            <h3 className="font-display text-xl text-[color:var(--color-forest-900)] mb-3">
              Stripe deducts a processing fee before your retainer reaches
              trust.
            </h3>
            <div className="space-y-3 text-sm text-[color:var(--color-ink-700)] leading-relaxed">
              <p>
                When you pay by card, Stripe charges roughly{" "}
                <span className="font-medium text-[color:var(--color-forest-900)]">
                  2.9% + $0.30
                </span>{" "}
                per transaction. The firm receives only the amount that
                lands in trust after that fee — not the full amount charged
                to your card.
              </p>
              <div className="rounded-lg border border-[color:var(--color-forest-100)] bg-white px-4 py-3">
                <div className="text-xs uppercase tracking-[0.14em] text-[color:var(--color-gold-600)] mb-1.5">
                  Worked example — $5,000 retainer
                </div>
                <ul className="space-y-1 font-mono text-[13px] text-[color:var(--color-ink-900)]">
                  <li>
                    <span className="text-[color:var(--color-ink-500)]">
                      You pay
                    </span>
                    <span className="float-right">$5,000.00</span>
                  </li>
                  <li>
                    <span className="text-[color:var(--color-ink-500)]">
                      Stripe fee (2.9% + $0.30)
                    </span>
                    <span className="float-right">−$145.30</span>
                  </li>
                  <li className="pt-1.5 border-t border-[color:var(--color-forest-100)]">
                    <span className="font-semibold">Lands in trust</span>
                    <span className="float-right font-semibold">
                      $4,854.70
                    </span>
                  </li>
                </ul>
              </div>
              <p>
                <span className="font-medium text-[color:var(--color-forest-900)]">
                  Want to avoid the fee?
                </span>{" "}
                Retainers paid by{" "}
                <span className="font-medium">e-transfer</span>,{" "}
                <span className="font-medium">wire</span>, or{" "}
                <span className="font-medium">cash</span> reach the trust
                account in full. Call the office for instructions.
              </p>
            </div>
          </div>
        </div>

        <aside className="order-1 md:order-2 space-y-6">
          <div className="rounded-xl border border-[color:var(--color-forest-100)] bg-white/70 p-6">
            <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-gold-600)] mb-2">
              Before you deposit
            </div>
            <ul className="space-y-3 text-sm text-[color:var(--color-ink-700)] leading-relaxed">
              <li>
                <span className="font-medium text-[color:var(--color-forest-900)]">
                  Confirm the amount with your lawyer.
                </span>{" "}
                The figure here should match what you agreed in your
                retainer agreement.
              </li>
              <li>
                <span className="font-medium text-[color:var(--color-forest-900)]">
                  Held in trust, not in the firm.
                </span>{" "}
                Funds sit in our pooled trust account and are drawn down
                only as work is performed and billed.
              </li>
              <li>
                <span className="font-medium text-[color:var(--color-forest-900)]">
                  Card fees apply.
                </span>{" "}
                See the note below the form. To avoid fees, ask about
                e-transfer, wire, or cash.
              </li>
            </ul>
          </div>

          <div className="rounded-xl bg-[color:var(--color-forest-900)] text-[color:var(--color-cream-50)] p-6">
            <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-gold-400)] mb-2">
              Need to talk first?
            </div>
            <p className="text-sm text-[color:var(--color-cream-100)]/85 leading-relaxed">
              If you&rsquo;re not sure how much to deposit, or you&rsquo;d
              prefer another payment method, call the office and ask for
              accounts.
            </p>
            <div className="mt-4 text-sm">
              <a
                href={`tel:${firm.phone}`}
                className="text-[color:var(--color-gold-400)] hover:text-[color:var(--color-gold-300)]"
              >
                {firm.phoneDisplay}
              </a>
              <span className="text-[color:var(--color-cream-100)]/40 mx-2">·</span>
              <a
                href={`mailto:${firm.email}`}
                className="text-[color:var(--color-gold-400)] hover:text-[color:var(--color-gold-300)]"
              >
                {firm.email}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}
