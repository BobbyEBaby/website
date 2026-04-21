import Link from "next/link";
import type { Metadata } from "next";
import { lawyers } from "@/data/lawyers";
import { LawyerPortrait } from "@/components/lawyer-portrait";
import { Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Our Lawyers",
  description:
    "Meet the family law team at RWE Family Law in Vancouver, British Columbia.",
};

export default function LawyersIndexPage() {
  return (
    <Container className="py-16 md:py-24">
      <SectionHeading
        eyebrow="Our team"
        title={<>Ten lawyers. One focus: family law.</>}
        lead="Every lawyer on our team practises exclusively in family law. Choose the person whose experience and approach fits your matter — or let us match you after a brief intake."
      />

      <div className="mt-14 grid grid-cols-2 gap-5 sm:gap-8 lg:grid-cols-3">
        {lawyers.map((lawyer, idx) => (
          <Link
            key={lawyer.slug}
            href={`/lawyers/${lawyer.slug}`}
            className="group flex flex-col"
          >
            <LawyerPortrait lawyer={lawyer} priority={idx < 3} />
            <div className="mt-4">
              <div className="font-display text-xl text-[color:var(--color-forest-900)] group-hover:text-[color:var(--color-forest-700)]">
                {lawyer.name}
                {lawyer.honorific ? `, ${lawyer.honorific}` : ""}
              </div>
              <div className="text-sm text-[color:var(--color-ink-500)] mb-2">
                {lawyer.title}
              </div>
              <p className="text-sm text-[color:var(--color-ink-700)] leading-relaxed">
                {lawyer.shortBio}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
