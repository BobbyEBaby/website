import Link from "next/link";
import { practiceAreas } from "@/data/practice-areas";
import { lawyers } from "@/data/lawyers";
import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";

// Pre-sort once at module load. Lawyer data is keyed by displayOrder so
// the dropdown reflects firm-defined seniority/billing order rather than
// alphabetical or whatever the array happens to be in.
const orderedLawyers = [...lawyers].sort(
  (a, b) => a.displayOrder - b.displayOrder
);

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[color:var(--color-cream-50)]/80 border-b border-[color:var(--color-forest-100)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8 h-[4.5rem] md:h-[5.25rem] flex items-center justify-between gap-4 md:gap-6">
        <Link
          href="/"
          className="flex items-center font-display min-w-0"
          aria-label="RWE Family Law — home"
        >
          <Logo />
        </Link>

        <nav
          className="hidden md:flex items-center gap-7 text-sm text-[color:var(--color-ink-700)]"
          aria-label="Primary"
        >
          <div className="relative group">
            <PrimaryLink href="/lawyers">Lawyer Profiles</PrimaryLink>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-opacity duration-150 absolute left-1/2 -translate-x-1/2 top-full pt-3">
              <ul className="min-w-[17rem] rounded-lg border border-[color:var(--color-forest-100)] bg-[color:var(--color-cream-50)] shadow-[0_18px_50px_-18px_rgba(18,42,32,0.35)] py-2">
                {orderedLawyers.map((l) => (
                  <li key={l.slug}>
                    <Link
                      href={`/lawyers/${l.slug}`}
                      className="block px-4 py-2 text-sm hover:bg-[color:var(--color-forest-50)] hover:text-[color:var(--color-forest-800)]"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="relative group">
            <PrimaryLink href="/practice-areas">Practice Areas</PrimaryLink>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-opacity duration-150 absolute left-1/2 -translate-x-1/2 top-full pt-3">
              <ul className="min-w-[17rem] rounded-lg border border-[color:var(--color-forest-100)] bg-[color:var(--color-cream-50)] shadow-[0_18px_50px_-18px_rgba(18,42,32,0.35)] py-2">
                {practiceAreas.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={p.customHref ?? `/practice-areas/${p.slug}`}
                      className="block px-4 py-2 text-sm hover:bg-[color:var(--color-forest-50)] hover:text-[color:var(--color-forest-800)]"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <PrimaryLink href="/mediation">Mediation</PrimaryLink>
          <PrimaryLink href="/fees">Legal Fees</PrimaryLink>
          <PrimaryLink href="/intake">New Client Intake</PrimaryLink>
        </nav>

        <div className="flex items-center gap-3">
          {/*
            Primary nav CTA. Family-law clients are emotional and cautious;
            "Contact" is a softer first step than committing to a paid
            consultation cold. Booking is still surfaced everywhere else
            (home hero, lawyer profiles, mediation, footer), so demoting it
            from the nav doesn't bury the funnel — it just gives clients an
            easier way in.
          */}
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-[color:var(--color-forest-800)] text-[color:var(--color-cream-50)] text-sm font-medium px-4 md:px-5 py-2 md:py-2.5 transition-colors hover:bg-[color:var(--color-forest-900)]"
          >
            Contact
            <span aria-hidden="true" className="text-[color:var(--color-gold-400)]">→</span>
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="relative py-2 hover:text-[color:var(--color-forest-800)] transition-colors"
    >
      {children}
    </Link>
  );
}
