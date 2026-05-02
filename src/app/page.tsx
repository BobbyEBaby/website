import Link from "next/link";
import type { Metadata } from "next";
import { lawyers } from "@/data/lawyers";
import { practiceAreas } from "@/data/practice-areas";
import { LawyerPortrait } from "@/components/lawyer-portrait";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "RWE Family Law | Vancouver Family Lawyers & Mediators",
  description:
    "A Vancouver family law firm focused on divorce, parenting, property division, mediation and child protection. Private consultations with experienced family lawyers.",
};

// --- Lawyer-grid orphan centering ---------------------------------------
//
// On lg+ the lawyer grid is 4 columns. With N lawyers, the bottom row
// has N % 4 orphans. Pushing the first orphan right by
// floor((4 - orphans) / 2) columns centers the orphan row visually.
//
//   8 lawyers   → 0 orphans  → no offset (full grid)
//   9 lawyers   → 1 orphan   → lg:col-start-2 (orphan in col 2)
//   10 lawyers  → 2 orphans  → lg:col-start-2 (orphans in cols 2-3)
//   11 lawyers  → 3 orphans  → no offset (3 of 4 can't truly centre;
//                              default left-bias of cols 1-3 is fine)
//   12 lawyers  → 0 orphans  → no offset (full row)
//
// On mobile / tablet (2 columns) we don't bother — orphans there read
// fine without intervention.
const HOME_LAWYER_LG_COLS = 4;
const homeLawyerOrphans = lawyers.length % HOME_LAWYER_LG_COLS;
const homeLawyerFirstOrphanIdx =
  homeLawyerOrphans > 0 ? lawyers.length - homeLawyerOrphans : -1;
const homeLawyerOrphanStartCol =
  homeLawyerOrphans > 0
    ? Math.floor((HOME_LAWYER_LG_COLS - homeLawyerOrphans) / 2) + 1
    : 1;
// Tailwind's JIT only picks up class names that appear as literal
// strings somewhere in the source; an interpolation like
// `lg:col-start-${n}` would get purged. Branch on the computed value
// so each possible class name is present as a literal.
const homeLawyerOrphanClass =
  homeLawyerOrphanStartCol === 2
    ? "lg:col-start-2"
    : homeLawyerOrphanStartCol === 3
    ? "lg:col-start-3"
    : homeLawyerOrphanStartCol === 4
    ? "lg:col-start-4"
    : "";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[color:var(--color-cream-50)] bg-grain">
        {/* Layered glow washes */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(1400px 700px at 85% -10%, color-mix(in srgb, var(--color-forest-800) 10%, transparent), transparent 60%), radial-gradient(900px 500px at -5% 105%, color-mix(in srgb, var(--color-gold-500) 14%, transparent), transparent 60%)",
          }}
        />
        {/* Hairline topographic lines — drift subtly */}
        <svg
          aria-hidden="true"
          className="absolute right-[-8%] top-[8%] w-[52%] opacity-[0.09] hero-drift"
          viewBox="0 0 600 600"
          fill="none"
        >
          {[...Array(14)].map((_, i) => (
            <circle
              key={i}
              cx="300"
              cy="300"
              r={60 + i * 18}
              stroke="var(--color-forest-900)"
              strokeWidth="0.6"
            />
          ))}
        </svg>

        <Container className="relative pt-20 md:pt-32 pb-24 md:pb-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-7 text-[color:var(--color-gold-600)] text-xs uppercase tracking-[0.22em] font-medium hero-fade">
              <span className="inline-block w-10 h-px bg-[color:var(--color-gold-500)] hero-rule" aria-hidden="true" />
              <span>Family law &amp; mediation — Vancouver, BC</span>
            </div>
            <h1 className="font-display text-[clamp(2.75rem,7.5vw,6rem)] leading-[0.98] tracking-tight text-[color:var(--color-forest-900)] hero-rise [text-wrap:balance]">
              Steady counsel during an{" "}
              <span className="italic text-[color:var(--color-forest-700)]">
                important turning point
              </span>{" "}
              in your family&rsquo;s life.
            </h1>
            <p className="mt-8 text-lg md:text-xl text-[color:var(--color-ink-700)] leading-relaxed max-w-2xl hero-rise-slow delay-500">
              A Vancouver family law firm built around clarity, care, and
              results. Divorce, parenting, property division, mediation and
              child protection — guided by lawyers who explain the path and
              walk it with you.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 hero-rise-slow delay-700">
              <ButtonLink href="/book" size="lg">
                Book a private consultation
                <span aria-hidden="true" className="text-[color:var(--color-gold-400)]">→</span>
              </ButtonLink>
              <ButtonLink href="/practice-areas" variant="ghost" size="lg">
                Explore our practice
              </ButtonLink>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-[color:var(--color-ink-500)] hero-fade delay-700">
              <Badge>Every level of BC court</Badge>
              <Badge>Court of Appeal experience</Badge>
              <Badge>Accredited mediators on staff</Badge>
              <Badge>Multilingual team</Badge>
            </div>
          </div>
        </Container>
      </section>

      <div className="divider-topo" aria-hidden="true" />

      {/* Lawyer preview */}
      <section className="py-24 md:py-32 bg-[color:var(--color-forest-50)] relative overflow-hidden">
        <Container>
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <SectionHeading
                eyebrow="The team"
                title={<>Lawyers you can talk to.</>}
                lead="A team of ten family lawyers — each of whom takes the time to understand your matter before making a plan."
              />
              <Link
                href="/lawyers"
                className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-forest-800)] hover:text-[color:var(--color-forest-900)]"
              >
                Lawyer portfolios
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 gap-5 sm:gap-7 lg:grid-cols-4">
            {lawyers.map((lawyer, idx) => (
              <Reveal
                key={lawyer.slug}
                delay={idx * 90}
                className={
                  idx === homeLawyerFirstOrphanIdx ? homeLawyerOrphanClass : ""
                }
              >
                <Link
                  href={`/lawyers/${lawyer.slug}`}
                  className="group flex flex-col"
                >
                  <div className="relative overflow-hidden rounded-2xl ring-1 ring-[color:var(--color-forest-100)] transition-transform duration-500 group-hover:-translate-y-1">
                    <LawyerPortrait lawyer={lawyer} priority={idx < 2} />
                  </div>
                  <div className="mt-5">
                    <div className="font-display text-xl text-[color:var(--color-forest-900)] group-hover:text-[color:var(--color-forest-700)] transition-colors">
                      {lawyer.name}
                      {lawyer.honorific ? `, ${lawyer.honorific}` : ""}
                    </div>
                    <div className="text-sm text-[color:var(--color-ink-500)]">
                      {lawyer.slug === "bionca-chu" ? "Articling Student" : "Lawyer"}
                      {lawyer.isMediator && (
                        <span className="ml-2 text-[color:var(--color-gold-600)]">· Mediator</span>
                      )}
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-3 block h-px w-6 bg-[color:var(--color-gold-500)] opacity-0 group-hover:opacity-100 group-hover:w-12 transition-all duration-500"
                    />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Practice areas */}
      <section className="py-24 md:py-32 bg-grain">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="What we do"
              title={<>Family law, end to end.</>}
              lead="We handle every piece of a separation — and the appeals, if it comes to that. Nine focused areas, plus a dedicated practice for clients with corporate, trust, or complex tax exposure."
            />
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {practiceAreas
              .filter((p) => !p.customHref)
              .map((p, idx) => (
                <Reveal key={p.slug} delay={idx * 70} as="div">
                  <Link
                    href={`/practice-areas/${p.slug}`}
                    className="group card-lift relative flex flex-col h-full rounded-2xl border border-[color:var(--color-forest-100)] bg-white/70 p-7 hover:border-[color:var(--color-forest-200)]"
                  >
                    <div className="font-display text-2xl text-[color:var(--color-forest-900)] mb-3">
                      {p.title}
                    </div>
                    <p className="text-sm text-[color:var(--color-ink-700)] leading-relaxed mb-8">
                      {p.tagline}
                    </p>
                    <span className="mt-auto inline-flex flex-col gap-3">
                      <span className="card-underline" aria-hidden="true" />
                      <span className="inline-flex items-center gap-2 text-sm text-[color:var(--color-forest-700)] group-hover:text-[color:var(--color-forest-900)]">
                        Learn more
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
          </div>

          {/* Featured: a 10th area gets a wider, darker callout below the
              3×3 grid so the grid stays clean and HNW reads as a different
              kind of practice (positioning page, not generic template). */}
          {practiceAreas
            .filter((p) => p.customHref)
            .map((p) => (
              <Reveal key={p.slug} delay={300}>
                <Link
                  href={p.customHref!}
                  className="mt-6 group relative flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl bg-[color:var(--color-forest-900)] text-[color:var(--color-cream-50)] p-8 md:p-10 ring-1 ring-[color:var(--color-forest-800)] hover:ring-[color:var(--color-gold-500)] transition-all"
                >
                  <div className="md:max-w-2xl">
                    <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-gold-400)] mb-3">
                      For clients with complex assets
                    </div>
                    <div className="font-display text-3xl md:text-4xl mb-3 leading-tight">
                      {p.title}
                    </div>
                    <p className="text-[color:var(--color-cream-100)]/80 leading-relaxed">
                      {p.summary}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-gold-400)] group-hover:text-[color:var(--color-gold-300)] shrink-0">
                    Learn more
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
        </Container>
      </section>

      <div className="divider-topo" aria-hidden="true" />

      {/* How it works */}
      <section className="py-24 md:py-32 bg-[color:var(--color-forest-50)]">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="How we work together"
              title={<>From first call to final order.</>}
              lead="A process designed to give you clarity fast — so you can make the next decision with confidence."
            />
          </Reveal>

          <ol className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Book a private consultation",
                d: "Choose a lawyer and a time online. Pay your consultation fee, tell us briefly what's going on. We prepare before we meet.",
              },
              {
                n: "02",
                t: "A clear plan, in plain language",
                d: "We walk through your options, the likely timeline, what it will cost, and what your next concrete step should be.",
              },
              {
                n: "03",
                t: "Settle well — or argue fiercely",
                d: "Most matters resolve through negotiation or mediation. When trial is the right answer, we're prepared for that too.",
              },
            ].map((step, idx) => (
              <Reveal as="li" key={step.n} delay={idx * 120}>
                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -top-2 -left-2 h-10 w-10 rounded-full bg-[color:var(--color-gold-500)]/15"
                  />
                  <div className="relative font-display text-5xl md:text-6xl text-[color:var(--color-gold-500)] leading-none">
                    {step.n}
                  </div>
                </div>
                <div className="mt-5 font-display text-2xl text-[color:var(--color-forest-900)]">
                  {step.t}
                </div>
                <p className="mt-3 text-[color:var(--color-ink-700)] leading-relaxed">
                  {step.d}
                </p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="relative py-24 md:py-32 bg-[color:var(--color-forest-900)] text-[color:var(--color-cream-50)] overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(800px 400px at 90% 10%, var(--color-gold-500), transparent 60%)",
          }}
        />
        <Container className="relative">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 items-center">
            <Reveal>
              <div>
                <div className="flex items-center gap-3 mb-5 text-[color:var(--color-gold-400)] text-xs uppercase tracking-[0.22em] font-medium">
                  <span className="inline-block w-10 h-px bg-[color:var(--color-gold-500)]" aria-hidden="true" />
                  <span>A first, low-risk step</span>
                </div>
                <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05]">
                  Not sure if you need a lawyer yet?
                </h2>
                <p className="mt-5 text-lg text-[color:var(--color-cream-100)]/80 max-w-xl leading-relaxed">
                  A consultation is the lowest-risk step. You&rsquo;ll leave
                  with a real answer — whether or not you retain us.
                </p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="flex flex-col gap-3 md:items-end">
                <ButtonLink href="/book" variant="gold" size="lg">
                  Book a consultation
                </ButtonLink>
                <ButtonLink
                  href="/contact"
                  variant="ghost"
                  size="lg"
                  className="!text-[color:var(--color-cream-50)] !border-[color:var(--color-forest-700)] hover:!bg-[color:var(--color-forest-800)]"
                >
                  Ask a question first
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className="block w-1.5 h-1.5 rounded-full bg-[color:var(--color-gold-500)]"
      />
      {children}
    </span>
  );
}
