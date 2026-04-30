import type { Metadata } from "next";
import { firm } from "@/data/firm";
import { ButtonLink, Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Payment received",
  robots: { index: false }, // not useful in search results
};

export default function PaySuccessPage() {
  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-xl mx-auto text-center">
        <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-gold-600)] mb-3">
          Payment received
        </div>
        <h1 className="font-display text-4xl text-[color:var(--color-forest-900)] leading-tight">
          Thank you.
        </h1>
        <p className="mt-5 text-lg text-[color:var(--color-ink-700)] leading-relaxed">
          Your payment cleared and a receipt has been emailed to you. The firm
          has been notified and will reconcile it against your file.
        </p>
        <p className="mt-3 text-sm text-[color:var(--color-ink-500)] leading-relaxed">
          If anything looks off on the receipt, call the office and ask for
          accounts.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/" variant="primary" size="md">
            Back to home
          </ButtonLink>
          <ButtonLink href={`tel:${firm.phone}`} variant="ghost" size="md">
            Call the office
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
