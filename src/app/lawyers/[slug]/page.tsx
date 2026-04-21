import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { lawyers, getLawyerBySlug } from "@/data/lawyers";
import { LawyerPortrait } from "@/components/lawyer-portrait";
import { ButtonLink, Container } from "@/components/ui";

export function generateStaticParams() {
  return lawyers.map((l) => ({ slug: l.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lawyer = getLawyerBySlug(slug);
  if (!lawyer) return {};
  return {
    title: `${lawyer.name}${lawyer.honorific ? `, ${lawyer.honorific}` : ""}`,
    description: lawyer.shortBio,
  };
}

export default async function LawyerProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const lawyer = getLawyerBySlug(slug);
  if (!lawyer) notFound();

  return (
    <Container className="py-16 md:py-24">
      <Link
        href="/lawyers"
        className="inline-flex items-center gap-2 text-sm text-[color:var(--color-forest-700)] hover:text-[color:var(--color-forest-900)] mb-10"
      >
        <span aria-hidden="true">←</span>
        All lawyers
      </Link>

      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-16">
        <div>
          <LawyerPortrait lawyer={lawyer} priority rounded="xl" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-4 text-[color:var(--color-gold-600)] text-xs uppercase tracking-[0.18em] font-medium">
            <span className="gold-rule" aria-hidden="true" />
            <span>
              {lawyer.title}
              {lawyer.isMediator && " · Mediator"}
            </span>
          </div>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] text-[color:var(--color-forest-900)]">
            {lawyer.name}
            {lawyer.honorific ? (
              <span className="text-[color:var(--color-forest-600)]">
                , {lawyer.honorific}
              </span>
            ) : null}
          </h1>
          <p className="mt-6 text-lg text-[color:var(--color-ink-700)] leading-relaxed">
            {lawyer.shortBio}
          </p>

          <div className="mt-8 space-y-5 text-[color:var(--color-ink-700)] leading-relaxed">
            {lawyer.bio.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            {lawyer.isMediator && lawyer.mediationBlurb && (
              <div className="mt-6 border-l-2 border-[color:var(--color-gold-500)] pl-5">
                <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-gold-600)] mb-2">
                  Also a mediator
                </div>
                <p>{lawyer.mediationBlurb}</p>
                <Link
                  href="/mediation"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-forest-800)] hover:text-[color:var(--color-forest-900)]"
                >
                  Read about our mediation practice
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            )}
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[color:var(--color-forest-100)] pt-8">
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-gold-600)] mb-2">
                Bar admissions
              </dt>
              <dd className="text-[color:var(--color-ink-900)]">
                {lawyer.barAdmissions.join(", ")}
              </dd>
            </div>
            {lawyer.education && lawyer.education.length > 0 && (
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-gold-600)] mb-2">
                  Education
                </dt>
                <dd className="text-[color:var(--color-ink-900)] space-y-1">
                  {lawyer.education.map((e) => (
                    <div key={e}>{e}</div>
                  ))}
                </dd>
              </div>
            )}
            {lawyer.languages && lawyer.languages.length > 0 && (
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-gold-600)] mb-2">
                  Languages
                </dt>
                <dd className="text-[color:var(--color-ink-900)]">
                  {lawyer.languages.join(", ")}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-gold-600)] mb-2">
                Consultation
              </dt>
              <dd className="text-[color:var(--color-ink-900)]">
                ${lawyer.consultationRateCad} CAD · {lawyer.consultationMinutes} min
              </dd>
            </div>
            {(lawyer.email || lawyer.phoneDisplay) && (
              <div className="col-span-2">
                <dt className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-gold-600)] mb-2">
                  Direct contact
                </dt>
                <dd className="text-[color:var(--color-ink-900)] flex flex-wrap gap-x-6 gap-y-1">
                  {lawyer.phoneDisplay && (
                    <a
                      href={`tel:${lawyer.phoneDisplay.replace(/[^\d+]/g, "")}`}
                      className="hover:text-[color:var(--color-forest-800)]"
                    >
                      {lawyer.phoneDisplay}
                    </a>
                  )}
                  {lawyer.email && (
                    <a
                      href={`mailto:${lawyer.email}`}
                      className="hover:text-[color:var(--color-forest-800)]"
                    >
                      {lawyer.email}
                    </a>
                  )}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={`/book?lawyer=${lawyer.slug}`} size="lg">
              Book with {lawyer.name.split(" ")[0]}
              <span aria-hidden="true" className="text-[color:var(--color-gold-400)]">→</span>
            </ButtonLink>
          </div>
        </div>
      </div>
    </Container>
  );
}
