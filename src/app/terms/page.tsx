import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <Container className="py-16 md:py-24 max-w-3xl">
      <SectionHeading eyebrow="Terms" title={<>Website terms of use.</>} />
      <div className="mt-10 space-y-6 text-[color:var(--color-ink-700)] leading-relaxed">
        <p>
          Placeholder terms. Final version should make clear that using this
          website does not create a lawyer-client relationship, that
          information on the site is general and not legal advice, and that a
          retainer agreement is required to engage the firm.
        </p>
      </div>
    </Container>
  );
}
