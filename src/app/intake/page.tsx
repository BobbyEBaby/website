import type { Metadata } from "next";
import { firm } from "@/data/firm";
import { Container, SectionHeading } from "@/components/ui";
import { IntakeForm } from "@/components/intake-form";

export const metadata: Metadata = {
  title: "New client intake",
  description:
    "Share the details of your family-law matter with RWE Family Law before your first consult. Every field is optional.",
};

export default function IntakePage() {
  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-3xl">
        <SectionHeading
          eyebrow="Before your consult"
          title={<>New client intake.</>}
          lead="The more we know before we sit down, the more useful our first conversation can be. Fill in what you can; skip anything you&rsquo;re unsure about. We&rsquo;ll review and follow up within one business day."
        />
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="order-2 md:order-1">
          <IntakeForm />

          {/* Privacy / use-of-info notice. Family-law intake collects
              sensitive personal and financial information; clients should
              know how it's transmitted and what submitting does (and
              doesn't) do legally. */}
          <div className="mt-8 rounded-xl border border-[color:var(--color-forest-100)] bg-white/70 p-6 md:p-7">
            <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-gold-600)] mb-2">
              About the information you share
            </div>
            <ul className="space-y-2.5 text-sm text-[color:var(--color-ink-700)] leading-relaxed">
              <li>
                <span className="font-medium text-[color:var(--color-forest-900)]">
                  Sent by email.
                </span>{" "}
                Your form is delivered to the firm&rsquo;s intake inbox over a
                standard TLS-encrypted email connection. It is not
                end-to-end encrypted; treat it the same way you would any
                email to a professional.
              </li>
              <li>
                <span className="font-medium text-[color:var(--color-forest-900)]">
                  Conflict check.
                </span>{" "}
                We screen the names you give us against our conflicts
                database before responding or sending this information to
                any of our lawyers. If a possible conflict comes up,
                we&rsquo;ll let you know we can&rsquo;t take the file and
                delete the information from our system before any of our
                lawyers have reviewed the information.
              </li>
              <li>
                <span className="font-medium text-[color:var(--color-forest-900)]">
                  Not a retainer.
                </span>{" "}
                Submitting this form does not create a lawyer&ndash;client
                relationship. We&rsquo;re only retained once you&rsquo;ve
                signed a retainer agreement and deposited funds in trust.
              </li>
              <li>
                <span className="font-medium text-[color:var(--color-forest-900)]">
                  Stored only in our practice management system.
                </span>{" "}
                We don&rsquo;t store this form on the website. After review,
                relevant details are filed in our practice management
                software the same way any client matter is tracked.
              </li>
            </ul>
          </div>
        </div>

        <aside className="order-1 md:order-2 space-y-6">
          <div className="rounded-xl border border-[color:var(--color-forest-100)] bg-white/70 p-6">
            <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-gold-600)] mb-2">
              Tips for filling this out
            </div>
            <ul className="space-y-3 text-sm text-[color:var(--color-ink-700)] leading-relaxed">
              <li>
                <span className="font-medium text-[color:var(--color-forest-900)]">
                  Approximate is fine.
                </span>{" "}
                If you don&rsquo;t remember an exact date or dollar amount,
                a rough one is better than nothing. We&rsquo;ll get the
                exact numbers later.
              </li>
              <li>
                <span className="font-medium text-[color:var(--color-forest-900)]">
                  Skip what doesn&rsquo;t apply.
                </span>{" "}
                Court fields, children, retainer source — leave anything
                blank that isn&rsquo;t relevant.
              </li>
              <li>
                <span className="font-medium text-[color:var(--color-forest-900)]">
                  Don&rsquo;t share documents here.
                </span>{" "}
                If you have court orders, tax returns, or financial
                statements, hold them until you meet with us — we&rsquo;ll
                set up a secure way to send them.
              </li>
            </ul>
          </div>

          <div className="rounded-xl bg-[color:var(--color-forest-900)] text-[color:var(--color-cream-50)] p-6">
            <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-gold-400)] mb-2">
              Prefer to talk first?
            </div>
            <p className="text-sm text-[color:var(--color-cream-100)]/85 leading-relaxed">
              Some people would rather start with a phone call. Either is
              fine — call the office or email us.
            </p>
            <div className="mt-4 text-sm">
              <a
                href={`tel:${firm.phone}`}
                className="text-[color:var(--color-gold-400)] hover:text-[color:var(--color-gold-300)]"
              >
                {firm.phoneDisplay}
              </a>
              <span className="text-[color:var(--color-cream-100)]/40 mx-2">·</span>
              <a
                href={`mailto:${firm.email}`}
                className="text-[color:var(--color-gold-400)] hover:text-[color:var(--color-gold-300)]"
              >
                {firm.email}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}
