import Link from "next/link";
import type { Metadata } from "next";
import { practiceAreas } from "@/data/practice-areas";
import { Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Family Law Practice Areas",
  description:
    "Family law at RWE Family Law: divorce, property division, spousal and child support, parenting time, child protection (MCFD), appeals, and a dedicated practice for clients with corporate, trust, or complex tax exposure.",
};

export default function PracticeAreasIndexPage() {
  return (
    <Container className="py-16 md:py-24">
      <SectionHeading
        eyebrow="Practice"
        title={<>All our work is family law.</>}
        lead="Nine focused areas where our team spends every working day — plus a dedicated practice for clients with corporate, trust, or complex tax exposure. If you&rsquo;re not sure where your situation fits, start with a consultation and we&rsquo;ll figure it out together."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {practiceAreas.map((p) => (
          <Link
            key={p.slug}
            href={p.customHref ?? `/practice-areas/${p.slug}`}
            className="group relative flex flex-col rounded-xl border border-[color:var(--color-forest-100)] bg-white/60 p-8 transition-colors hover:bg-[color:var(--color-forest-50)] hover:border-[color:var(--color-forest-200)]"
          >
            <div className="font-display text-[1.6rem] text-[color:var(--color-forest-900)] mb-2">
              {p.title}
            </div>
            <p className="text-sm text-[color:var(--color-ink-700)] leading-relaxed mb-5">
              {p.tagline}
            </p>
            <p className="text-sm text-[color:var(--color-ink-700)] leading-relaxed">
              {p.summary}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-forest-800)]">
              Read more
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
