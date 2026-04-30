import type { Metadata } from "next";
import Link from "next/link";
import { firm } from "@/data/firm";
import { Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Website Terms of Use",
  description:
    "Terms governing your use of the RWE Family Law website. Submitting information through this site does not create a lawyer–client relationship.",
};

const LAST_UPDATED = "April 30, 2026";

export default function TermsPage() {
  return (
    <Container className="py-16 md:py-24 max-w-3xl">
      <SectionHeading
        eyebrow="Terms"
        title={<>Website terms of use.</>}
        lead="The terms that govern your use of this website. Reading them once is enough — they don&rsquo;t change often."
      />

      <p className="mt-6 text-sm text-[color:var(--color-ink-500)]">
        Last updated: {LAST_UPDATED}
      </p>

      <div className="mt-10 space-y-10 text-[color:var(--color-ink-700)] leading-relaxed">
        <Section title="About this website">
          <p>
            This website is operated by {firm.legalName} (&ldquo;{firm.shortName}
            &rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), a British Columbia
            law corporation practising as {firm.name}. By accessing or using
            this website, you agree to these terms. If you do not agree with
            them, please do not use the site.
          </p>
        </Section>

        <Section title="No lawyer–client relationship">
          <p>
            Using this website, sending us a message through a contact form,
            booking a consultation, completing the new-client intake form, or
            corresponding with us by email{" "}
            <span className="font-medium text-[color:var(--color-forest-900)]">
              does not, on its own, create a lawyer&ndash;client relationship
              between you and the firm or any of our lawyers
            </span>
            .
          </p>
          <p>
            A lawyer&ndash;client relationship with the firm is created only
            when:
          </p>
          <ul className="mt-3 space-y-2 list-disc pl-5">
            <li>
              we have completed our conflict-of-interest checks and confirmed
              we are able to act for you;
            </li>
            <li>
              you and the firm have signed a written retainer agreement
              setting out the scope of the work; and
            </li>
            <li>where applicable, you have deposited the agreed retainer in trust.</li>
          </ul>
          <p className="mt-4">
            Until those steps are complete, please do not send us
            time-sensitive or confidential information that you would only
            share with your own lawyer.
          </p>
        </Section>

        <Section title="The information on this site is general, not legal advice">
          <p>
            The content on this website — including the practice-area pages,
            articles, and answers to common questions — is intended as
            general legal information only. It is not legal advice, it is not
            a substitute for a consultation with a lawyer, and it should not
            be relied upon as the basis for any decision in your matter. Laws
            change, court decisions change how laws are applied, and the
            answer to almost any family-law question depends on facts that
            are not visible on a website.
          </p>
          <p>
            If you are dealing with a family-law issue, speak with a lawyer
            about your specific situation before you act.
          </p>
        </Section>

        <Section title="Currency and accuracy">
          <p>
            We try to keep the website accurate and current, but we make no
            warranty that the information on it is complete, current, or free
            from errors. We may change the content of the website at any
            time without notice.
          </p>
        </Section>

        <Section title="External links">
          <p>
            The website may link to third-party websites for convenience. We
            do not control those sites and are not responsible for their
            content, accuracy, or privacy practices. A link to a third-party
            site is not an endorsement.
          </p>
        </Section>

        <Section title="Your use of the website">
          <p>
            When you use the website, you agree not to:
          </p>
          <ul className="mt-3 space-y-2 list-disc pl-5">
            <li>
              attempt to gain unauthorized access to any part of the site,
              its servers, or the data of other users;
            </li>
            <li>
              submit false, misleading, or impersonating information through
              any form or communication channel;
            </li>
            <li>
              use the site to send spam, malware, or other unwanted or
              harmful material; or
            </li>
            <li>
              use the site, or any content from it, in any way that is
              unlawful or that infringes the rights of any other person.
            </li>
          </ul>
        </Section>

        <Section title="Intellectual property">
          <p>
            The text, layout, photographs, and other content on this website
            are owned by {firm.legalName} or used with permission. You may
            view the website and print or save reasonable extracts for your
            own personal, non-commercial use. You may not republish, sell,
            or commercially exploit the content without our written
            permission.
          </p>
          <p>
            &ldquo;{firm.name}&rdquo; and the firm&rsquo;s logos are trade-marks
            of {firm.legalName}.
          </p>
        </Section>

        <Section title="Disclaimer and limitation of liability">
          <p>
            The website is provided on an &ldquo;as-is&rdquo; basis. To the
            fullest extent permitted by law, we disclaim all warranties of
            any kind, express or implied, including warranties of
            merchantability, fitness for a particular purpose, and
            non-infringement.
          </p>
          <p>
            To the fullest extent permitted by law, {firm.legalName} and its
            lawyers, directors, officers, employees, and agents are not
            liable for any direct, indirect, incidental, special,
            consequential, or punitive damages arising out of or in
            connection with your use of, or inability to use, the website,
            even if we have been advised of the possibility of such damages.
            Nothing in these terms limits any liability that cannot be
            limited under applicable law.
          </p>
        </Section>

        <Section title="Privacy">
          <p>
            Personal information you submit through this website is handled
            in accordance with our{" "}
            <Link
              href="/privacy"
              className="text-[color:var(--color-forest-700)] underline underline-offset-2 hover:text-[color:var(--color-forest-900)]"
            >
              Privacy Policy
            </Link>
            , which forms part of these terms.
          </p>
        </Section>

        <Section title="Governing law and jurisdiction">
          <p>
            These terms are governed by the laws of the Province of British
            Columbia and the federal laws of Canada that apply in British
            Columbia. Any dispute arising out of or in connection with these
            terms, or your use of the website, shall be resolved exclusively
            by the courts of the Province of British Columbia, and you
            consent to the jurisdiction of those courts.
          </p>
        </Section>

        <Section title="Changes to these terms">
          <p>
            We may change these terms from time to time. The &ldquo;Last
            updated&rdquo; date at the top of the page reflects when they
            were most recently changed. Continued use of the website after a
            change means you accept the updated terms.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these terms can be sent to:
          </p>
          <div className="mt-4 rounded-xl border border-[color:var(--color-forest-100)] bg-white/70 p-5 not-italic">
            <div className="font-medium text-[color:var(--color-forest-900)]">
              {firm.legalName}
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
