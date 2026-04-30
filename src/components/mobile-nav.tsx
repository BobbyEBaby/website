"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { firm } from "@/data/firm";
import { practiceAreas } from "@/data/practice-areas";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
              <MobileLink href="/lawyers">Lawyer Profiles</MobileLink>
              <li className="py-4">
                <Link
                  href="/practice-areas"
                  className="font-display text-2xl text-[color:var(--color-forest-900)] hover:text-[color:var(--color-forest-700)]"
                >
                  Practice Areas
                </Link>
                <ul className="mt-3 pl-1 space-y-1">
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
                </ul>
              </li>
              <MobileLink href="/mediation">Mediation</MobileLink>
              <MobileLink href="/fees">Legal Fees</MobileLink>
              <MobileLink href="/contact">Contact</MobileLink>
              <MobileLink href="/intake">New Client Intake</MobileLink>
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
