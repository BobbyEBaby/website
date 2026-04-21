import Link from "next/link";
import { notFound } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { Container } from "@/components/ui";
import { AvailabilityEditor } from "@/components/availability-editor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit availability", robots: { index: false } };

type PageProps = { params: Promise<{ slug: string }> };

export default async function LawyerAdminPage({ params }: PageProps) {
  const { slug } = await params;
  if (!(await isAdminAuthed())) notFound();

  const lawyer = await prisma.lawyer.findUnique({
    where: { slug },
    include: {
      availabilityRules: { orderBy: [{ dayOfWeek: "asc" }, { startMin: "asc" }] },
      bookings: {
        where: { start: { gte: new Date() }, status: { in: ["PENDING_PAYMENT", "CONFIRMED"] } },
        orderBy: { start: "asc" },
        take: 20,
      },
    },
  });
  if (!lawyer) notFound();

  return (
    <Container className="py-12 md:py-16 max-w-4xl">
      <Link
        href="/admin"
        className="text-sm text-[color:var(--color-forest-700)] hover:text-[color:var(--color-forest-900)]"
      >
        ← Admin dashboard
      </Link>
      <h1 className="font-display text-4xl text-[color:var(--color-forest-900)] mt-4 mb-2">
        {lawyer.name}
      </h1>
      <p className="text-[color:var(--color-ink-500)]">
        {lawyer.title}
        {lawyer.isMediator && " · Mediator"} · {lawyer.email}
      </p>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-[color:var(--color-forest-900)] mb-5">
          Weekly availability
        </h2>
        <AvailabilityEditor
          lawyerSlug={lawyer.slug}
          initialRules={lawyer.availabilityRules.map((r) => ({
            id: r.id,
            dayOfWeek: r.dayOfWeek,
            startMin: r.startMin,
            endMin: r.endMin,
          }))}
        />
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl text-[color:var(--color-forest-900)] mb-5">
          Upcoming bookings
        </h2>
        {lawyer.bookings.length === 0 ? (
          <p className="text-[color:var(--color-ink-500)]">
            None scheduled.
          </p>
        ) : (
          <ul className="divide-y divide-[color:var(--color-forest-100)] rounded-lg border border-[color:var(--color-forest-100)] bg-white/60">
            {lawyer.bookings.map((b) => (
              <li key={b.id} className="p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <div>
                    <div className="font-medium text-[color:var(--color-forest-900)]">
                      {b.clientName}
                    </div>
                    <div className="text-xs text-[color:var(--color-ink-500)]">
                      {b.clientEmail} · {b.clientPhoneE164}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[color:var(--color-ink-900)]">
                      {new Intl.DateTimeFormat("en-CA", {
                        timeZone: lawyer.timezone,
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      }).format(b.start)}
                    </div>
                    <div className="text-xs text-[color:var(--color-ink-500)]">
                      {b.status}
                      {b.urgency === "URGENT" && (
                        <span className="ml-2 text-[color:var(--color-gold-600)] font-medium">URGENT</span>
                      )}
                    </div>
                  </div>
                </div>
                {b.clientSummary && (
                  <p className="mt-2 text-[color:var(--color-ink-700)]">
                    {b.clientSummary}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </Container>
  );
}
