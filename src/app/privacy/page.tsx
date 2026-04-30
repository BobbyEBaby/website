import type { Metadata } from "next";
import Link from "next/link";
import { firm } from "@/data/firm";
import { Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How RWE Family Law collects, uses, stores, and protects the personal information you share through this website and during the intake process.",
};

const LAST_UPDATED = "April 30, 2026";

export default function PrivacyPage() {
  return (
    <Container className="py-16 md:py-24 max-w-3xl">
      <SectionHeading
        eyebrow="Policy"
        title={<>Privacy policy.</>}
        lead="How we collect, use, and protect the personal information you share with us through this website."
      />

      <p className="mt-6 text-sm text-[color:var(--color-ink-500)]">
        Last updated: {LAST_UPDATED}
      </p>

      <div className="mt-10 space-y-10 text-[color:var(--color-ink-700)] leading-relaxed">
        <Section title="Who we are">
          <p>
            This website is operated by {firm.legalName} (&ldquo;{firm.shortName}
            &rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), a British Columbia
            law corporation practising as {firm.name} from {firm.address.line1},{" "}
            {firm.address.city}, {firm.address.region} {firm.address.postal}.
            We are bound by British Columbia&rsquo;s Personal Information
            Protection Act (PIPA), Canada&rsquo;s Personal Information
            Protection and Electronic Documents Act (PIPEDA) where applicable,
            and the privacy obligations imposed on lawyers by the Law Society
            of British Columbia.
          </p>
          <p>
            This policy explains what personal information we collect through{" "}
            <span className="font-medium text-[color:var(--color-forest-900)]">
              this website
            </span>
            , how we use it, who we share it with, how long we keep it, and
            your rights to access and correct it. It does not cover the
            handling of personal information after you become a client of the
            firm — once a retainer is signed, our handling of your information
            is governed by the rules of professional conduct and the terms of
            your retainer agreement.
          </p>
        </Section>

        <Section title="What information we collect">
          <p>We collect personal information directly from you when you:</p>
          <ul className="mt-3 space-y-2 list-disc pl-5">
            <li>
              <span className="font-medium text-[color:var(--color-forest-900)]">
                Submit a contact form.
              </span>{" "}
              We collect your name, email, phone (if provided), and the
              content of your message.
            </li>
            <li>
              <span className="font-medium text-[color:var(--color-forest-900)]">
                Complete the booking conflict screen.
              </span>{" "}
              We collect your full name and the full name of the other party
              to your matter so we can run a conflicts check before the
              consultation goes ahead.
            </li>
            <li>
              <span className="font-medium text-[color:var(--color-forest-900)]">
                Book a consultation.
              </span>{" "}
              Scheduling is handled by Calendly. Calendly collects your name,
              email, time-zone, and any answers to questions on the booking
              form, and shares the appointment details with us.
            </li>
            <li>
              <span className="font-medium text-[color:var(--color-forest-900)]">
                Pay for a consultation, an invoice, or deposit a retainer.
              </span>{" "}
              Payments are processed by Stripe. Stripe collects your card
              details directly. We do not receive or store your card number
              or CVV; we receive a confirmation of payment, the amount, the
              last four digits of the card, and any reference fields you
              entered (such as an invoice number).
            </li>
            <li>
              <span className="font-medium text-[color:var(--color-forest-900)]">
                Complete the new-client intake form.
              </span>{" "}
              We collect the information you provide on that form, which can
              include contact details, information about the other party, the
              names and birthdates of children, dates relevant to the
              relationship, financial information, and your goals for the
              matter. Every field on that form is optional.
            </li>
            <li>
              <span className="font-medium text-[color:var(--color-forest-900)]">
                Email us directly.
              </span>{" "}
              Anything you send to a firm email address is collected the same
              way it would be at any other professional services firm.
            </li>
          </ul>
          <p className="mt-4">
            Our hosting provider (Vercel) automatically logs basic technical
            information — your IP address, the page you requested, the time
            of the request, and your browser&rsquo;s user-agent string — for
            the limited purpose of operating the website and protecting it
            against abuse. We do not link this technical information to the
            personal information you submit through forms.
          </p>
        </Section>

        <Section title="How we use your information">
          <p>We use the information you provide to:</p>
          <ul className="mt-3 space-y-2 list-disc pl-5">
            <li>respond to your inquiry and arrange a consultation;</li>
            <li>
              run a conflicts check before any lawyer at the firm reviews the
              substance of your matter;
            </li>
            <li>
              prepare for and conduct your consultation, and to assess whether
              we can act for you;
            </li>
            <li>
              process payment for consultations, invoices, and trust-account
              retainer deposits;
            </li>
            <li>
              if you become a client, to carry out the work covered by your
              retainer; and
            </li>
            <li>
              to comply with our professional and legal obligations as
              lawyers, including the Law Society of British Columbia&rsquo;s
              record-keeping rules.
            </li>
          </ul>
          <p className="mt-4">
            We do not sell your personal information. We do not use it for
            marketing to you unless you have asked us to add you to a list.
          </p>
        </Section>

        <Section title="Conflict-of-interest checks">
          <p>
            Before any lawyer at the firm reviews the substance of what you
            have sent us, we screen the names you provide against our existing
            client and matter records. If a possible conflict comes up — for
            example, the other party to your matter is or was a client of the
            firm — we will let you know that we are unable to act for you, and
            we will{" "}
            <span className="font-medium text-[color:var(--color-forest-900)]">
              delete the information you submitted from our systems before any
              of our lawyers reviews it
            </span>
            . If no conflict comes up, your information is forwarded to the
            lawyer most likely to be a fit for your matter.
          </p>
        </Section>

        <Section title="Who we share information with">
          <p>
            We share personal information with third parties only where it is
            necessary to operate the website, communicate with you, or carry
            out the work you have asked us to do. Our current service
            providers are:
          </p>
          <ul className="mt-3 space-y-2 list-disc pl-5">
            <li>
              <span className="font-medium text-[color:var(--color-forest-900)]">
                Vercel
              </span>{" "}
              — website hosting. Servers are located in North America.
            </li>
            <li>
              <span className="font-medium text-[color:var(--color-forest-900)]">
                Resend
              </span>{" "}
              — transactional email delivery for forms and notifications.
            </li>
            <li>
              <span className="font-medium text-[color:var(--color-forest-900)]">
                Calendly
              </span>{" "}
              — appointment scheduling. Calendly stores its own copy of your
              booking details under its own privacy policy.
            </li>
            <li>
              <span className="font-medium text-[color:var(--color-forest-900)]">
                Stripe
              </span>{" "}
              — payment processing. Stripe handles your card details directly
              under its own privacy policy and PCI-DSS compliance.
            </li>
          </ul>
          <p className="mt-4">
            Some of these providers store data on servers in the United States.
            Personal information stored outside Canada may be subject to
            disclosure under foreign laws. We have selected providers that we
            believe maintain appropriate safeguards, but we cannot guarantee
            that foreign authorities will not request access to data stored
            in their jurisdiction.
          </p>
          <p>
            We do not disclose personal information to anyone else without
            your consent, except where required by law (for example, in
            response to a valid court order) or as authorized under PIPA.
          </p>
        </Section>

        <Section title="How long we keep your information">
          <p>
            How long we keep your information depends on what it is and what
            it is for:
          </p>
          <ul className="mt-3 space-y-2 list-disc pl-5">
            <li>
              <span className="font-medium text-[color:var(--color-forest-900)]">
                Website inquiries that do not lead to a retainer
              </span>{" "}
              — kept for as long as is reasonably necessary to respond and to
              keep a record of contact, generally not longer than two years.
            </li>
            <li>
              <span className="font-medium text-[color:var(--color-forest-900)]">
                Information from people we have a conflict with
              </span>{" "}
              — deleted from our systems promptly once the conflict is
              identified, except where retention is required by law (for
              example, the conflict record itself).
            </li>
            <li>
              <span className="font-medium text-[color:var(--color-forest-900)]">
                Client files
              </span>{" "}
              — kept in accordance with the Law Society of British Columbia's
              record-retention rules and the firm&rsquo;s file-closing
              policies, which may require retention for several years after
              the file closes.
            </li>
            <li>
              <span className="font-medium text-[color:var(--color-forest-900)]">
                Trust accounting records
              </span>{" "}
              — retained for the period required by the Law Society of British
              Columbia&rsquo;s trust accounting rules.
            </li>
          </ul>
        </Section>

        <Section title="Cookies and analytics">
          <p>
            This website uses essential cookies only — small files needed to
            keep the site functioning (for example, to remember that
            you&rsquo;ve dismissed a notice). We do not use advertising
            cookies and we do not track you across other websites.
          </p>
          <p>
            We do not currently use a third-party analytics service. If we add
            one in the future, we will update this policy and use a
            privacy-friendly provider that does not collect personally
            identifying information.
          </p>
        </Section>

        <Section title="Email and security">
          <p>
            Email is the primary way we communicate with prospective clients
            through this website. Email between you and the firm is sent over
            standard TLS-encrypted connections, but it is not end-to-end
            encrypted. You should treat email to the firm the same way you
            would treat email to any other professional — useful for
            arranging meetings and discussing high-level questions, but not
            the right channel for highly sensitive disclosures. Once you are
            a client, we can arrange a more secure way to send documents.
          </p>
          <p>
            We protect personal information with reasonable physical,
            technical, and organizational safeguards. No method of electronic
            storage or transmission is perfectly secure, however, and we
            cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            Under PIPA and PIPEDA, you have the right to:
          </p>
          <ul className="mt-3 space-y-2 list-disc pl-5">
            <li>
              ask whether we hold personal information about you, and what
              kinds of information;
            </li>
            <li>
              access the personal information we hold about you, subject to
              limited exceptions (for example, information protected by
              solicitor-client privilege);
            </li>
            <li>
              ask us to correct personal information that is inaccurate or
              incomplete;
            </li>
            <li>
              withdraw your consent to our use of your personal information,
              subject to legal or contractual restrictions and reasonable
              notice; and
            </li>
            <li>
              make a complaint to the Office of the Information and Privacy
              Commissioner for British Columbia if you believe we have not
              handled your personal information appropriately.
            </li>
          </ul>
          <p className="mt-4">
            To exercise any of these rights, contact our privacy officer using
            the details below. We will respond to access and correction
            requests within 30 days.
          </p>
        </Section>

        <Section title="Children&rsquo;s privacy">
          <p>
            This website is intended for adults. We do not knowingly collect
            personal information from children under the age of 16. If you
            believe a child has submitted personal information through this
            site, contact us and we will delete it.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this policy from time to time. The &ldquo;Last
            updated&rdquo; date at the top of the page reflects when it was
            most recently changed. We will not change the policy in a way
            that materially reduces your rights without prior notice on the
            website.
          </p>
        </Section>

        <Section title="Contact our privacy officer">
          <p>
            For privacy questions, access requests, correction requests, or
            complaints, contact:
          </p>
          <div className="mt-4 rounded-xl border border-[color:var(--color-forest-100)] bg-white/70 p-5 not-italic">
            <div className="font-medium text-[color:var(--color-forest-900)]">
              Privacy Officer, {firm.legalName}
            </div>
            <div>{firm.address.line1}</div>
            <div>
              {firm.address.city}, {firm.address.region} {firm.address.postal}
            </div>
            <div className="mt-2">
              <Link
                href={`mailto:${firm.email}`}
                className="text-[color:var(--color-forest-700)] hover:text-[color:var(--color-forest-900)]"
              >
                {firm.email}
              </Link>
              {" · "}
              <Link
                href={`tel:${firm.phone}`}
                className="text-[color:var(--color-forest-700)] hover:text-[color:var(--color-forest-900)]"
              >
                {firm.phoneDisplay}
              </Link>
            </div>
          </div>
        </Section>
      </div>
    </Container>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl text-[color:var(--color-forest-900)] mb-4">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
