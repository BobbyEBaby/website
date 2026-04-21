import Link from "next/link";
import { firm } from "@/data/firm";
import { practiceAreas } from "@/data/practice-areas";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-[color:var(--color-forest-100)] bg-[color:var(--color-forest-900)] text-[color:var(--color-cream-100)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-14 md:py-20 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="font-display text-2xl text-[color:var(--color-cream-50)] mb-2">
            RWE <span className="text-[color:var(--color-gold-400)]">·</span>{" "}
            Family Law
          </div>
          <p className="text-sm text-[color:var(--color-cream-100)]/75 leading-relaxed">
            Vancouver family lawyers focused on divorce, parenting, property
            division, and child protection.
          </p>
        </div>

        <div>
          <FooterHeading>Practice</FooterHeading>
          <ul className="space-y-2 text-sm">
            {practiceAreas.slice(0, 6).map((p) => (
              <li key={p.slug}>
                <FooterLink href={`/practice-areas/${p.slug}`}>
                  {p.title}
                </FooterLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <FooterHeading>Firm</FooterHeading>
          <ul className="space-y-2 text-sm">
            <li><FooterLink href="/lawyers">Lawyer Profiles</FooterLink></li>
            <li><FooterLink href="/mediation">Mediation</FooterLink></li>
            <li><FooterLink href="/fees">Legal Fees</FooterLink></li>
            <li><FooterLink href="/contact">Contact</FooterLink></li>
            <li><FooterLink href="/book">Book a consultation</FooterLink></li>
          </ul>
        </div>

        <div>
          <FooterHeading>Reach us</FooterHeading>
          <address className="not-italic text-sm text-[color:var(--color-cream-100)]/75 leading-relaxed">
            <div>{firm.name}</div>
            <div>{firm.address.line1}</div>
            <div>
              {firm.address.city}, {firm.address.region}{" "}
              {firm.address.postal}
            </div>
            <div className="mt-3">
              <a
                href={`tel:${firm.phone}`}
                className="hover:text-[color:var(--color-gold-400)]"
              >
                {firm.phoneDisplay}
              </a>
            </div>
            <div>
              <a
                href={`mailto:${firm.email}`}
                className="hover:text-[color:var(--color-gold-400)]"
              >
                {firm.email}
              </a>
            </div>
          </address>
        </div>
      </div>

      <div className="border-t border-[color:var(--color-forest-800)]">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-xs text-[color:var(--color-cream-100)]/60">
          <div>
            © {year} {firm.legalName}. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/privacy" className="hover:text-[color:var(--color-gold-400)]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[color:var(--color-gold-400)]">
              Terms
            </Link>
            <span>The information on this website is general in nature and not legal advice.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[color:var(--color-gold-400)] text-xs uppercase tracking-[0.16em] mb-3 font-medium">
      {children}
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[color:var(--color-cream-100)]/85 hover:text-[color:var(--color-gold-400)] transition-colors"
    >
      {children}
    </Link>
  );
}
