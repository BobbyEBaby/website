import Link from "next/link";
import type { Metadata } from "next";
import { lawyers } from "@/data/lawyers";
import { LawyerPortrait } from "@/components/lawyer-portrait";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Family Mediation",
  description:
    "Family law mediation in Vancouver, British Columbia. Robert W. Evans and Desiree Acosta of RWE Family Law mediate separation, parenting, property, and support disputes.",
};

export default function MediationPage() {
  const mediators = lawyers.filter((l) => l.isMediator);

  return (
    <>
      {/* Hero */}
      <section className="bg-[color:var(--color-cream-50)]">
        <Container className="py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6 text-[color:var(--color-gold-600)] text-xs uppercase tracking-[0.2em] font-medium">
              <span className="gold-rule" aria-hidden="true" />
              <span>Family mediation</span>
            </div>
            <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] text-[color:var(--color-forest-900)]">
              A quieter path through the hardest part.
            </h1>
            <p className="mt-7 text-xl text-[color:var(--color-ink-700)] leading-relaxed max-w-2xl">
              Mediation helps separating couples reach durable agreements on
              parenting, property, and support — without a courtroom. RWE
              Family Law offers mediation led by two experienced family
              lawyers who also act as neutral mediators.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/book?service=mediation" size="lg">
                Book a mediation
                <span aria-hidden="true" className="text-[color:var(--color-gold-400)]">→</span>
              </ButtonLink>
              <ButtonLink href="/contact" variant="ghost" size="lg">
                Ask a question first
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* What mediation is */}
      <section className="py-20 md:py-24">
        <Container>
          <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <div>
              <SectionHeading
                eyebrow="What it is"
                title={<>A structured, confidential conversation.</>}
              />
            </div>
            <div className="space-y-5 text-[color:var(--color-ink-700)] leading-relaxed">
              <p>
                Family mediation is a voluntary process where a neutral third
                party — the mediator — helps you and your former partner
                reach agreement on the issues that come up when families
                restructure: parenting time, decision-making, child and
                spousal support, and the division of property and debt.
              </p>
              <p>
                The mediator doesn&rsquo;t decide anything. You do. Our role
                is to make sure both voices are heard, the relevant law is on
                the table, and the agreement you reach can actually hold up
                once it&rsquo;s written down.
              </p>
              <p>
                In British Columbia, mediation is increasingly the default
                entry point for separating families — and the Family Law Act
                is built to support outcomes reached this way.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Why mediate */}
      <section className="py-20 md:py-24 bg-[color:var(--color-forest-50)]">
        <Container>
          <SectionHeading
            eyebrow="Why mediate"
            title={<>The reasons most families choose this path.</>}
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Benefit
              title="Faster"
              body="Mediation moves at your pace, not the court's. Most matters resolve in a handful of sessions."
            />
            <Benefit
              title="Less expensive"
              body="You share the cost of one neutral instead of paying two full legal teams to fight through court."
            />
            <Benefit
              title="More private"
              body="Mediation is confidential. What's discussed stays between the parties and the mediator."
            />
            <Benefit
              title="Better for children"
              body="Lower conflict means better long-term outcomes for kids. A negotiated parenting plan tends to survive years of change."
            />
          </div>
        </Container>
      </section>

      {/* The process */}
      <section className="py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title={<>The mediation process, step by step.</>}
          />
          <ol className="mt-12 grid gap-10 md:grid-cols-2">
            {[
              {
                n: "01",
                t: "Agree on a mediator",
                d: "Both parties pick the mediator together. We send a short agreement confirming the process, fees, and confidentiality before we start.",
              },
              {
                n: "02",
                t: "Separate intake meetings",
                d: "Each party meets with the mediator on their own to set goals, surface concerns, and confirm mediation is appropriate — including screening for family violence.",
              },
              {
                n: "03",
                t: "Joint sessions",
                d: "Structured conversations, usually two to four sessions, working through each issue in turn — parenting, property, support — with the relevant law and numbers on the table.",
              },
              {
                n: "04",
                t: "Agreement in writing",
                d: "Once you've reached agreement, we draft a Memorandum of Understanding. Each party takes it to their own lawyer for independent legal advice before it's finalized.",
              },
            ].map((step) => (
              <li key={step.n} className="flex gap-6">
                <div className="font-display text-5xl text-[color:var(--color-gold-500)] leading-none">
                  {step.n}
                </div>
                <div>
                  <div className="font-display text-2xl text-[color:var(--color-forest-900)]">
                    {step.t}
                  </div>
                  <p className="mt-2 text-[color:var(--color-ink-700)] leading-relaxed">
                    {step.d}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Our mediators */}
      <section className="py-20 md:py-24 bg-[color:var(--color-forest-900)] text-[color:var(--color-cream-50)]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <div className="flex items-center gap-3 mb-4 text-[color:var(--color-gold-400)] text-xs uppercase tracking-[0.18em] font-medium">
                <span className="block w-10 h-[2px] bg-[color:var(--color-gold-400)]" aria-hidden="true" />
                <span>Our mediators</span>
              </div>
              <h2 className="font-display text-[clamp(2rem,4.5vw,3rem)] leading-[1.1]">
                Two lawyers. Both mediators.
              </h2>
              <p className="mt-5 text-[color:var(--color-cream-100)]/80 max-w-xl leading-relaxed">
                Both trained in mediation and grounded in day-to-day family
                law practice — the combination that keeps mediated
                agreements realistic and durable.
              </p>
            </div>
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            {mediators.map((lawyer) => (
              <article key={lawyer.slug} className="flex flex-col">
                <LawyerPortrait lawyer={lawyer} priority rounded="xl" />
                <div className="mt-6">
                  <div className="font-display text-3xl">
                    {lawyer.name}
                    {lawyer.honorific ? `, ${lawyer.honorific}` : ""}
                  </div>
                  <div className="text-sm text-[color:var(--color-cream-100)]/60 mb-5">
                    {lawyer.slug === "bionca-chu" ? "Articling Student" : "Lawyer"} · Mediator
                  </div>
                  <p className="text-[color:var(--color-cream-100)]/85 leading-relaxed">
                    {lawyer.mediationBlurb}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/lawyers/${lawyer.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-gold-400)] hover:text-[color:var(--color-gold-300)]"
                    >
                      Full profile
                      <span aria-hidden="true">→</span>
                    </Link>
                    <Link
                      href={`/book?lawyer=${lawyer.slug}&service=mediation`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-gold-400)] hover:text-[color:var(--color-gold-300)]"
                    >
                      Book with {lawyer.bookingDisplayName ?? lawyer.name.split(" ")[0]}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-24">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Common questions"
            title={<>What people ask about mediation.</>}
          />
          <dl className="mt-12 space-y-10">
            <Faq
              q="Is mediation legally binding?"
              a="The mediation itself isn't — it's a conversation. The agreement that comes out of it becomes binding once it's signed, typically after each party takes it to their own lawyer for independent legal advice."
            />
            <Faq
              q="Do we still each need our own lawyer?"
              a="For most matters, no — independent legal advice may be suggested for a final agreement, but the mediation process itself does not require a lawyer. Some parties bring their own lawyers into the mediation itself. We'll discuss what's right for your situation at intake."
            />
            <Faq
              q="What if mediation doesn't resolve everything?"
              a="That's fine. Many mediations resolve most issues and leave one or two for negotiation or court. Partial agreement is still progress and still reduces cost."
            />
            <Faq
              q="Is mediation safe if there's been family violence?"
              a="Mediation isn't always appropriate where there's been family violence — and screening for this is part of every intake. When it's not safe or appropriate, we say so clearly and point you toward better options, such as shuttle mediation."
            />
            <Faq
              q="What is shuttle mediation?"
              a="Shuttle mediation is a process where parties mediate in separate rooms. The mediator acts as a go-between for each party."
            />
            <Faq
              q="Do you offer remote mediation?"
              a="Yes — our in-person mediations offer a boardroom, a break-out room, water, coffee, and sandwiches, but we also offer remote mediations over Zoom."
            />
            <Faq
              q="What should I bring to mediation?"
              a="Before a mediation begins, the mediator will speak with each party about disclosure of existing orders, agreements, and often financial statements. At the mediation itself, you are welcome to bring your materials, but nothing further is required — everything will be provided."
            />
          </dl>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-[color:var(--color-forest-50)]">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3rem)] leading-tight text-[color:var(--color-forest-900)]">
              Ready to explore mediation?
            </h2>
            <p className="mt-5 text-lg text-[color:var(--color-ink-700)] leading-relaxed">
              Start with a short consultation to see if mediation is the
              right fit for your matter. No commitment.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <ButtonLink href="/book?service=mediation" size="lg">
                Book a consultation
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function Benefit({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-[color:var(--color-forest-100)] bg-white/80 p-6">
      <div className="font-display text-xl text-[color:var(--color-forest-900)] mb-2">
        {title}
      </div>
      <p className="text-sm text-[color:var(--color-ink-700)] leading-relaxed">
        {body}
      </p>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <dt className="font-display text-xl text-[color:var(--color-forest-900)]">
        {q}
      </dt>
      <dd className="mt-3 text-[color:var(--color-ink-700)] leading-relaxed">
        {a}
      </dd>
    </div>
  );
}
