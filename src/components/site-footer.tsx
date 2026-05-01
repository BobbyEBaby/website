import Link from "next/link";
import { firm } from "@/data/firm";
import { practiceAreas } from "@/data/practice-areas";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-[color:var(--color-forest-100)] bg-[color:var(--color-forest-900)] text-[color:var(--color-cream-100)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-14 md:py-20 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-1">
          <div className="font-display text-2xl text-[color:var(--color-cream-50)] mb-2">
            RWE <span className="text-[color:var(--color-gold-400)]">·</span>{" "}
            Family Law
          </div>
          <p className="text-sm text-[color:var(--color-cream-100)]/75 leading-relaxed">
            Vancouver family lawyers focused on divorce, parenting, property
            division, and child protection.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {firm.social.twitter && (
              <SocialIcon
                href={firm.social.twitter}
                label="RWE Family Law on X (Twitter)"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2H21.5l-7.47 8.537L22.5 22h-6.828l-5.348-6.993L4.2 22H.94l7.993-9.137L1.5 2h6.984l4.832 6.389L18.244 2Zm-2.392 18h1.87L7.23 4h-1.95l10.572 16Z" />
                </svg>
              </SocialIcon>
            )}
            {firm.social.instagram && (
              <SocialIcon
                href={firm.social.instagram}
                label="RWE Family Law on Instagram"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
                </svg>
              </SocialIcon>
            )}
            {firm.social.wechat && (
              <SocialIcon
                href={firm.social.wechat}
                label="RWE Family Law on WeChat"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M8.7 4C4.99 4 2 6.48 2 9.55c0 1.73.96 3.27 2.47 4.3L4 15.8l2.17-1.14c.62.16 1.27.25 1.96.27-.11-.4-.17-.82-.17-1.26 0-2.83 2.71-5.12 6.06-5.12.22 0 .44.01.65.03C14.2 5.73 11.71 4 8.7 4ZM6.5 7.25a.85.85 0 1 1 0 1.7.85.85 0 0 1 0-1.7Zm4.4 0a.85.85 0 1 1 0 1.7.85.85 0 0 1 0-1.7ZM14 9.9c-3.18 0-5.76 2.08-5.76 4.65 0 2.56 2.58 4.65 5.76 4.65.66 0 1.3-.08 1.9-.24L17.7 20l-.45-1.56c1.34-.87 2.2-2.2 2.2-3.89 0-2.57-2.58-4.65-5.46-4.65Zm-1.9 3.15a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Zm3.8 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Z" />
                </svg>
              </SocialIcon>
            )}
          </div>
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
          <FooterHeading>For Clients</FooterHeading>
          <ul className="space-y-2 text-sm">
            <li><FooterLink href="/intake">New client intake</FooterLink></li>
            <li><FooterLink href="/pay">Pay an invoice</FooterLink></li>
            <li><FooterLink href="/retainer">Deposit a retainer</FooterLink></li>
          </ul>
        </div>

        <div>
          <FooterHeading>Reach us</FooterHeading>
          <address className="not-italic text-sm text-[color:var(--color-cream-100)]/75 leading-relaxed">
            <div className="text-[color:var(--color-gold-400)] text-[0.65rem] uppercase tracking-[0.18em] mb-1">
              Vancouver Office
            </div>
            <div>{firm.name}</div>
            <div>{firm.address.line1}</div>
            <div>
              {firm.address.city}, {firm.address.region}{" "}
              {firm.address.postal}
            </div>

            {/* New Westminster office. Hard-coded here for the same reason
                as the contact page: phone/email/etc. are firm-wide and
                there's no other place in the app that needs these
                details. Promote to data/firm.ts if a third office shows
                up. */}
            <div className="text-[color:var(--color-gold-400)] text-[0.65rem] uppercase tracking-[0.18em] mt-4 mb-1">
              New Westminster Office
            </div>
            <div>RWE Family Law</div>
            <div>604 Columbia St Unit 400</div>
            <div>New Westminster, BC V3M 1A5</div>

            <div className="mt-4">
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

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[color:var(--color-forest-700)] text-[color:var(--color-cream-100)]/80 hover:text-[color:var(--color-gold-400)] hover:border-[color:var(--color-gold-400)] transition-colors"
    >
      {children}
    </a>
  );
}

