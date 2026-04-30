import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { practiceAreas, getPracticeAreaBySlug } from "@/data/practice-areas";
import { ButtonLink, Container } from "@/components/ui";

export function generateStaticParams() {
  return practiceAreas.map((p) => ({ slug: p.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = getPracticeAreaBySlug(slug);
  if (!area) return {};
  return { title: area.title, description: area.summary };
}

export default async function PracticeAreaPage({ params }: PageProps) {
  const { slug } = await params;
  const area = getPracticeAreaBySlug(slug);
  if (!area) notFound();

  return (
    <Container className="py-16 md:py-24">
      <Link
        href="/practice-areas"
        className="inline-flex items-center gap-2 text-sm text-[color:var(--color-forest-700)] hover:text-[color:var(--color-forest-900)] mb-10"
      >
        <span aria-hidden="true">←</span>
        All practice areas
      </Link>

      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-6 text-[color:var(--color-gold-600)] text-xs uppercase tracking-[0.18em] font-medium">
          <span className="gold-rule" aria-hidden="true" />
          <span>Practice area</span>
        </div>
        <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] text-[color:var(--color-forest-900)]">
          {area.title}
        </h1>
        <p className="mt-5 text-xl text-[color:var(--color-forest-700)] italic font-display">
          {area.tagline}
        </p>
        <p className="mt-7 text-lg text-[color:var(--color-ink-700)] leading-relaxed">
          {area.summary}
        </p>
      </div>

      <div className="mt-14 grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-16">
        <div className="space-y-8">
          {area.body.map((block) => (
            <section key={block.heading}>
              <h2 className="font-display text-2xl text-[color:var(--color-forest-900)] mb-3">
                {block.heading}
              </h2>
              <p className="text-[color:var(--color-ink-700)] leading-relaxed">
                {block.text}
              </p>
            </section>
          ))}

          {area.relatedLinks && area.relatedLinks.length > 0 && (
            <section className="mt-4 border-t border-[color:var(--color-forest-100)] pt-10">
              <h2 className="font-display text-2xl text-[color:var(--color-forest-900)] mb-6">
                Related
              </h2>
              <ul className="space-y-4">
                {area.relatedLinks.map((rl) => (
                  <li key={rl.href}>
                    <Link
                      href={rl.href}
                      className="block rounded-xl border border-[color:var(--color-forest-100)] bg-white/70 p-5 hover:border-[color:var(--color-forest-200)] hover:bg-[color:var(--color-forest-50)] transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="font-display text-xl text-[color:var(--color-forest-900)]">
                          {rl.title}
                        </div>
                        <span
                          aria-hidden="true"
                          className="text-[color:var(--color-gold-500)] group-hover:text-[color:var(--color-gold-400)] transition-colors mt-1"
                        >
                          →
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-[color:var(--color-ink-700)] leading-relaxed">
                        {rl.blurb}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {area.faqs.length > 0 && (
            <section className="mt-4 border-t border-[color:var(--color-forest-100)] pt-10">
              <h2 className="font-display text-2xl text-[color:var(--color-forest-900)] mb-6">
                Common questions
              </h2>
              <dl className="space-y-6">
                {area.faqs.map((faq) => (
                  <div key={faq.q}>
                    <dt className="font-medium text-[color:var(--color-forest-900)]">
                      {faq.q}
                    </dt>
                    <dd className="mt-2 text-[color:var(--color-ink-700)] leading-relaxed">
                      {faq.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>

        <aside className="md:sticky md:top-28 h-fit rounded-xl bg-[color:var(--color-forest-900)] text-[color:var(--color-cream-50)] p-8">
          <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-gold-400)] mb-3">
            Ready to talk?
          </div>
          <div className="font-display text-2xl leading-tight">
            Book a private consultation about {area.title.toLowerCase()}.
          </div>
          <p className="mt-4 text-sm text-[color:var(--color-cream-100)]/80 leading-relaxed">
            One hour with a family lawyer who handles this area every week.
          </p>
          <ButtonLink href="/book" variant="gold" size="md" className="mt-6 w-full">
            Book now
          </ButtonLink>
        </aside>
      </div>
    </Container>
  );
}
