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

// --- Lawyer-grid orphan centering (3-col lg layout) ---------------------
//
// On lg+ this page uses 3 columns. With N lawyers the bottom row has
// N % 3 orphans. Pushing the first orphan right by
// floor((3 - orphans) / 2) columns centers the orphan row.
//
//   9 lawyers   → 0 orphans  → no offset (full grid)
//   10 lawyers  → 1 orphan   → lg:col-start-2 (orphan in centre col)
//   11 lawyers  → 2 orphans  → no offset (default left-bias of cols 1-2)
//   12 lawyers  → 0 orphans  → no offset (full row)
//
// On mobile / tablet (2 columns) we don't bother — orphans there read
// fine without intervention.
const LAWYERS_LG_COLS = 3;
const lawyersOrphans = lawyers.length % LAWYERS_LG_COLS;
const lawyersFirstOrphanIdx =
  lawyersOrphans > 0 ? lawyers.length - lawyersOrphans : -1;
const lawyersOrphanStartCol =
  lawyersOrphans > 0
    ? Math.floor((LAWYERS_LG_COLS - lawyersOrphans) / 2) + 1
    : 1;
// Tailwind needs literal class names — branch on each possible value.
const lawyersOrphanClass =
  lawyersOrphanStartCol === 2
    ? "lg:col-start-2"
    : lawyersOrphanStartCol === 3
    ? "lg:col-start-3"
    : "";

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
            className={`group flex flex-col ${
              idx === lawyersFirstOrphanIdx ? lawyersOrphanClass : ""
            }`}
          >
            <LawyerPortrait lawyer={lawyer} priority={idx < 3} />
            <div className="mt-4">
              <div className="font-display text-xl text-[color:var(--color-forest-900)] group-hover:text-[color:var(--color-forest-700)]">
                {lawyer.name}
                {lawyer.honorific ? `, ${lawyer.honorific}` : ""}
              </div>
              <div className="text-sm text-[color:var(--color-ink-500)] mb-2">
                {lawyer.slug === "bionca-chu" ? "Articling Student" : "Lawyer"}
                {lawyer.isMediator && " · Mediator"}
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
