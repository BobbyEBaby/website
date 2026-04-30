import type { Metadata } from "next";
import { firm } from "@/data/firm";
import { ButtonLink, Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Retainer received",
  robots: { index: false }, // not useful in search results
};

export default function RetainerSuccessPage() {
  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-xl mx-auto text-center">
        <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-gold-600)] mb-3">
          Deposit received
        </div>
        <h1 className="font-display text-4xl text-[color:var(--color-forest-900)] leading-tight">
          Thank you.
        </h1>
        <p className="mt-5 text-lg text-[color:var(--color-ink-700)] leading-relaxed">
          Your retainer cleared and a receipt has been emailed to you. The
          funds are held in our pooled trust account and will be applied to
          your file as work is performed.
        </p>
        <p className="mt-3 text-sm text-[color:var(--color-ink-500)] leading-relaxed">
          Remember: the amount that landed in trust is the amount you paid
          minus Stripe&rsquo;s processing fee. Your statements will reflect
          the net figure.
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
