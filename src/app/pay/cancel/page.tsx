import type { Metadata } from "next";
import { firm } from "@/data/firm";
import { ButtonLink, Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Payment cancelled",
  robots: { index: false },
};

export default function PayCancelPage() {
  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-xl mx-auto text-center">
        <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-gold-600)] mb-3">
          Payment cancelled
        </div>
        <h1 className="font-display text-4xl text-[color:var(--color-forest-900)] leading-tight">
          No charge made.
        </h1>
        <p className="mt-5 text-lg text-[color:var(--color-ink-700)] leading-relaxed">
          You stopped before completing the transaction, so nothing was
          processed. You can try again, or call the office if you&rsquo;d
          rather pay another way.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/pay" variant="primary" size="md">
            Try again
          </ButtonLink>
          <ButtonLink href={`tel:${firm.phone}`} variant="ghost" size="md">
            Call the office
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
