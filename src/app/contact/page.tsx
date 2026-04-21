import type { Metadata } from "next";
import { firm } from "@/data/firm";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact RWE Family Law — phone, email, office location, and online consultation booking.",
};

export default function ContactPage() {
  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-3xl">
        <SectionHeading
          eyebrow="Get in touch"
          title={<>Reach the firm.</>}
          lead="For a specific matter, the fastest path is to book a consultation online. For general questions, call us or send a note and we&rsquo;ll get back within one business day."
        />
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="space-y-8 order-2 md:order-1">
          <ContactBlock label="By phone">
            <a
              href={`tel:${firm.phone}`}
              className="text-xl text-[color:var(--color-forest-900)] hover:text-[color:var(--color-forest-700)]"
            >
              {firm.phoneDisplay}
            </a>
          </ContactBlock>

          <ContactBlock label="By email">
            <a
              href={`mailto:${firm.email}`}
              className="font-display text-2xl text-[color:var(--color-forest-900)] hover:text-[color:var(--color-forest-700)]"
            >
              {firm.email}
            </a>
          </ContactBlock>

          <ContactBlock label="Hours">
            <ul className="space-y-1 text-[color:var(--color-ink-900)]">
              {firm.hours.map((h) => (
                <li key={h.day} className="flex justify-between max-w-xs">
                  <span className="text-[color:var(--color-ink-700)]">{h.day}</span>
                  <span>{h.hours}</span>
                </li>
              ))}
            </ul>
          </ContactBlock>

          <ContactBlock label="Office">
            <address className="not-italic text-[color:var(--color-ink-900)] leading-relaxed">
              {firm.name}
              <br />
              {firm.address.line1}
              <br />
              {firm.address.city}, {firm.address.region} {firm.address.postal}
            </address>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                "RWE Family Law"
              )}`}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 block overflow-hidden rounded-xl border border-[color:var(--color-forest-100)] group"
              aria-label="Find RWE Family Law on Google Maps"
            >
              <iframe
                title="RWE Family Law office location"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  firm.address.lng - 0.0041
                }%2C${firm.address.lat - 0.0027}%2C${
                  firm.address.lng + 0.0041
                }%2C${firm.address.lat + 0.0027}&layer=mapnik&marker=${
                  firm.address.lat
                }%2C${firm.address.lng}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full h-64 border-0 pointer-events-none transition duration-500 [filter:grayscale(1)_contrast(1.05)] group-hover:[filter:grayscale(0)_contrast(1)]"
              />
            </a>
            <div className="mt-2 text-xs text-[color:var(--color-ink-500)]">
              Click map to find RWE Family Law on Google Maps.
            </div>
          </ContactBlock>
        </div>

        <div className="space-y-8 order-1 md:order-2">
          <ContactForm />
          <aside className="rounded-xl bg-[color:var(--color-forest-900)] text-[color:var(--color-cream-50)] p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-gold-400)] mb-3">
              Ready for specifics?
            </div>
            <div className="font-display text-2xl leading-tight">
              Book a private consultation online.
            </div>
            <p className="mt-4 text-sm text-[color:var(--color-cream-100)]/80 leading-relaxed">
              Choose a lawyer and a time. Pay securely. You&rsquo;ll get a
              confirmation email immediately and a calendar invite for the
              appointment.
            </p>
            <ButtonLink href="/book" variant="gold" size="md" className="mt-6 w-full">
              Book now
            </ButtonLink>
          </aside>
        </div>
      </div>
    </Container>
  );
}

function ContactBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-gold-600)] mb-2">
        {label}
      </div>
      {children}
    </section>
  );
}
