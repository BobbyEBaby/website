"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { firm } from "@/data/firm";
import { practiceAreas } from "@/data/practice-areas";
import { lawyers } from "@/data/lawyers";

const orderedLawyers = [...lawyers].sort(
  (a, b) => a.displayOrder - b.displayOrder
);

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Tracks which parent sections (lawyers / practice areas) are
  // currently expanded. Mobile menu is finite and only two items have
  // disclosures, but a Set keeps the shape future-proof if more get
  // added later (services, FAQs, etc.).
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // On any route change: close the sheet AND collapse all disclosures
  // so the next time the user opens the menu they see the compact
  // baseline state, not a stale half-expanded view.
  useEffect(() => {
    setOpen(false);
    setExpandedSections(new Set());
  }, [pathname]);

  const toggleSection = (key: string) =>
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-nav-sheet"
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 rounded-full text-[color:var(--color-forest-900)] hover:bg-[color:var(--color-forest-50)]"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      </button>

      {mounted && createPortal(
      <div
        aria-hidden={!open}
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-[color:var(--color-forest-950)]/60"
          aria-hidden="true"
        />
        <aside
          id="mobile-nav-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={`absolute top-0 right-0 h-full w-[min(88vw,22rem)] bg-[color:var(--color-cream-50)] shadow-[-18px_0_50px_-18px_rgba(18,42,32,0.4)] transition-transform duration-300 ease-out flex flex-col ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-gold-600)]">
              Menu
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center w-11 h-11 -mr-2 rounded-full text-[color:var(--color-forest-900)] hover:bg-[color:var(--color-forest-50)]"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 pb-8" aria-label="Mobile primary">
            <ul className="divide-y divide-[color:var(--color-forest-100)]">
              <DisclosureSection
                sectionKey="lawyers"
                href="/lawyers"
                label="Lawyer Profiles"
                expanded={expandedSections.has("lawyers")}
                onToggle={() => toggleSection("lawyers")}
              >
                {orderedLawyers.map((l) => (
                  <li key={l.slug}>
                    <Link
                      href={`/lawyers/${l.slug}`}
                      className="block py-1.5 text-sm text-[color:var(--color-ink-700)] hover:text-[color:var(--color-forest-800)]"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
              </DisclosureSection>
              <DisclosureSection
                sectionKey="practice-areas"
                href="/practice-areas"
                label="Practice Areas"
                expanded={expandedSections.has("practice-areas")}
                onToggle={() => toggleSection("practice-areas")}
              >
                {practiceAreas.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={p.customHref ?? `/practice-areas/${p.slug}`}
                      className="block py-1.5 text-sm text-[color:var(--color-ink-700)] hover:text-[color:var(--color-forest-800)]"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </DisclosureSection>
              <MobileLink href="/mediation">Mediation</MobileLink>
              <MobileLink href="/fees">Legal Fees</MobileLink>
              <MobileLink href="/contact">Contact</MobileLink>
              <MobileLink href="/intake">New Client Intake</MobileLink>
              <MobileLink href="/book">Book Consult</MobileLink>
            </ul>

            <div className="mt-8 rounded-xl bg-[color:var(--color-forest-900)] text-[color:var(--color-cream-50)] p-5">
              <div className="text-[0.65rem] uppercase tracking-[0.2em] text-[color:var(--color-gold-400)] mb-2">
                Reach us directly
              </div>
              <a
                href={`tel:${firm.phone}`}
                className="font-display text-xl block hover:text-[color:var(--color-gold-400)]"
              >
                {firm.phoneDisplay}
              </a>
              <a
                href={`mailto:${firm.email}`}
                className="text-sm text-[color:var(--color-cream-100)]/80 block mt-1 hover:text-[color:var(--color-gold-400)]"
              >
                {firm.email}
              </a>
            </div>
          </nav>
        </aside>
      </div>,
      document.body
      )}
    </>
  );
}

function MobileLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li className="py-4">
      <Link
        href={href}
        className="font-display text-2xl text-[color:var(--color-forest-900)] hover:text-[color:var(--color-forest-700)]"
      >
        {children}
      </Link>
    </li>
  );
}

/**
 * Tap-to-expand parent nav row.
 *
 * Two distinct hit targets, by design:
 *  - The big label is a Link that navigates to the index page (e.g.
 *    /lawyers, /practice-areas) so visitors who want to browse the
 *    full landing page get there in one tap.
 *  - The chevron button toggles the inline child list, so visitors
 *    who already know which lawyer or practice area they want can
 *    drill down without leaving the menu.
 *
 * Putting both on a single row would force one behaviour and lose
 * the other — splitting the hit target keeps both paths available.
 */
function DisclosureSection({
  sectionKey,
  href,
  label,
  expanded,
  onToggle,
  children,
}: {
  sectionKey: string;
  href: string;
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const listId = `mobile-nav-${sectionKey}-list`;
  return (
    <li className="py-4">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={href}
          className="font-display text-2xl text-[color:var(--color-forest-900)] hover:text-[color:var(--color-forest-700)]"
        >
          {label}
        </Link>
        <button
          type="button"
          aria-label={expanded ? `Collapse ${label}` : `Expand ${label}`}
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={onToggle}
          className="inline-flex items-center justify-center w-10 h-10 -mr-2 rounded-full text-[color:var(--color-forest-900)] hover:bg-[color:var(--color-forest-50)]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
      {expanded && (
        <ul id={listId} className="mt-3 pl-1 space-y-1">
          {children}
        </ul>
      )}
    </li>
  );
}
