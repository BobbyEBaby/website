import type { Metadata } from "next";
import { lawyers } from "@/data/lawyers";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Legal Fees",
  description:
    "How legal fees work at RWE Family Law — consultations, hourly rates, retainers, and the factors that drive cost.",
};

export default function FeesPage() {
  const min = Math.min(...lawyers.map((l) => l.consultationRateCad));
  const max = Math.max(...lawyers.map((l) => l.consultationRateCad));

  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-3xl">
        <SectionHeading
          eyebrow="Fees"
          title={<>Fair, clear, explained in advance.</>}
          lead="Family law fees are influenced by the complexity of the matter, the lawyer you work with, and how much of your case is resolved outside court. Here&rsquo;s how we approach it."
        />
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2 max-w-4xl">
        <FeeCard
          eyebrow="Consultation"
          title={`$${min} – $${max} CAD`}
          body="A private 30-minute consultation with the lawyer of your choice. You leave with a real answer and a plan, whether or not you retain us. Paid when you book."
        />
        <FeeCard
          eyebrow="Hourly retainer"
          title="Varies by lawyer"
          body="For ongoing matters, we bill hourly against a retainer. Rates depend on the lawyer&rsquo;s seniority. We quote you a specific figure before any retainer is signed."
        />
        <FeeCard
          eyebrow="Mediation & negotiation"
          title="Fixed scope, predictable cost"
          body="Where a matter is suited to mediation or structured negotiation, we&rsquo;ll agree a scope of work upfront so you know the range before we start."
        />
        <FeeCard
          eyebrow="Litigation"
          title="Estimated by stage"
          body="Contested matters are estimated by stage — pleadings, disclosure, interim applications, trial — so you can make informed decisions about each step."
        />
      </div>

      <section className="mt-20 max-w-3xl">
        <h2 className="font-display text-2xl text-[color:var(--color-forest-900)] mb-4">
          What drives the cost of a family law matter?
        </h2>
        <ul className="space-y-3 text-[color:var(--color-ink-700)]">
          <Bullet>The level of conflict between you and the other party.</Bullet>
          <Bullet>How complete each side&rsquo;s financial disclosure is at the start.</Bullet>
          <Bullet>Whether there are businesses, pensions, or excluded property.</Bullet>
          <Bullet>Whether urgent applications (protection, interim support, relocation) are needed.</Bullet>
          <Bullet>How many steps are required in court before resolution.</Bullet>
        </ul>
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="font-display text-2xl text-[color:var(--color-forest-900)] mb-4">
          How do retainers work in family law?
        </h2>
        <ul className="space-y-3 text-[color:var(--color-ink-700)]">
          <Bullet>A typical retainer is $10,000 to complete one step with money leftover.</Bullet>
          <Bullet>The balance of any retainer funds remaining are returned to you.</Bullet>
          <Bullet>You may cancel at any time and have your retainer refunded, minus what has been billed to date.</Bullet>
        </ul>
      </section>

      <div className="mt-16">
        <ButtonLink href="/book" size="lg">
          Book a consultation to get specific numbers
          <span aria-hidden="true" className="text-[color:var(--color-gold-400)]">→</span>
        </ButtonLink>
      </div>
    </Container>
  );
}

function FeeCard({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-[color:var(--color-forest-100)] bg-white/60 p-8">
      <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-gold-600)] mb-3">
        {eyebrow}
      </div>
      <div className="font-display text-2xl text-[color:var(--color-forest-900)] mb-3">
        {title}
      </div>
      <p className="text-sm text-[color:var(--color-ink-700)] leading-relaxed">
        {body}
      </p>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden="true"
        className="mt-2 block w-1.5 h-1.5 rounded-full bg-[color:var(--color-gold-500)] shrink-0"
      />
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}
