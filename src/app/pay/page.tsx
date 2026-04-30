import type { Metadata } from "next";
import { firm } from "@/data/firm";
import { Container, SectionHeading } from "@/components/ui";
import { PayInvoiceForm } from "@/components/pay-invoice-form";

export const metadata: Metadata = {
  title: "Pay an invoice",
  description:
    "Existing clients of RWE Family Law can settle their account online. Secure card payment via Stripe.",
};

export default function PayPage() {
  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-3xl">
        <SectionHeading
          eyebrow="For existing clients"
          title={<>Pay an invoice.</>}
          lead="Use this page to settle an outstanding invoice from RWE Family Law. You'll be handed off to Stripe to enter your card; an emailed receipt arrives the moment payment clears."
        />
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="order-2 md:order-1">
          <PayInvoiceForm />
        </div>

        <aside className="order-1 md:order-2 space-y-6">
          <div className="rounded-xl border border-[color:var(--color-forest-100)] bg-white/70 p-6">
            <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-gold-600)] mb-2">
              Before you pay
            </div>
            <ul className="space-y-3 text-sm text-[color:var(--color-ink-700)] leading-relaxed">
              <li>
                <span className="font-medium text-[color:var(--color-forest-900)]">
                  Have your invoice in front of you.
                </span>{" "}
                You&rsquo;ll need the dollar amount; the invoice number is
                optional.
              </li>
              <li>
                <span className="font-medium text-[color:var(--color-forest-900)]">
                  Use the email on file
                </span>{" "}
                so we can match your payment to the correct file. The receipt
                from Stripe is sent to whatever you enter.
              </li>
              <li>
                <span className="font-medium text-[color:var(--color-forest-900)]">
                  Cards only.
                </span>{" "}
                For e-transfer, cheque, or trust deposits, please call the
                office.
              </li>
            </ul>
          </div>

          <div className="rounded-xl bg-[color:var(--color-forest-900)] text-[color:var(--color-cream-50)] p-6">
            <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-gold-400)] mb-2">
              Questions about your bill?
            </div>
            <p className="text-sm text-[color:var(--color-cream-100)]/85 leading-relaxed">
              Call the office and ask for accounts, or reply to the email your
              invoice was sent from.
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
