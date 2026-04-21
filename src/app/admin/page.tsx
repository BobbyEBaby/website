import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { Container, SectionHeading } from "@/components/ui";
import { AdminLoginForm } from "@/components/admin-login-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false } };

export default async function AdminHomePage() {
  const authed = await isAdminAuthed();
  if (!authed) {
    return (
      <Container className="py-20 max-w-md">
        <SectionHeading eyebrow="Admin" title={<>Sign in.</>} />
        <div className="mt-8">
          <AdminLoginForm />
        </div>
        <p className="mt-6 text-xs text-[color:var(--color-ink-500)]">
          Shared admin password is set via the ADMIN_PASSWORD environment variable.
          Replace this with per-lawyer auth before going to production.
        </p>
      </Container>
    );
  }

  const lawyers = await prisma.lawyer.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          bookings: { where: { status: { in: ["PENDING_PAYMENT", "CONFIRMED"] } } },
        },
      },
    },
  });

  const upcoming = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      start: { gte: new Date() },
    },
    orderBy: { start: "asc" },
    take: 10,
    include: { lawyer: true },
  });

  return (
    <Container className="py-12 md:py-16 max-w-5xl">
      <div className="flex items-center justify-between mb-10">
        <SectionHeading eyebrow="Admin" title={<>Dashboard.</>} />
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="text-sm text-[color:var(--color-ink-500)] hover:text-[color:var(--color-forest-900)]"
          >
            Sign out
          </button>
        </form>
      </div>

      <section className="mb-14">
        <h2 className="font-display text-2xl text-[color:var(--color-forest-900)] mb-5">
          Upcoming consultations
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-[color:var(--color-ink-500)]">No upcoming bookings.</p>
        ) : (
          <ul className="divide-y divide-[color:var(--color-forest-100)] rounded-lg border border-[color:var(--color-forest-100)] bg-white/60">
            {upcoming.map((b) => (
              <li key={b.id} className="p-4 flex items-center gap-4 text-sm">
                <div className="flex-1">
                  <div className="font-medium text-[color:var(--color-forest-900)]">
                    {b.clientName}{" "}
                    <span className="text-[color:var(--color-ink-500)] font-normal">
                      → {b.lawyer.name}
                    </span>
                  </div>
                  <div className="text-[color:var(--color-ink-500)] text-xs">
                    {new Intl.DateTimeFormat("en-CA", {
                      timeZone: b.lawyer.timezone,
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    }).format(b.start)}
                    {b.urgency === "URGENT" && (
                      <span className="ml-2 text-[color:var(--color-gold-600)] font-medium">URGENT</span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-[color:var(--color-ink-500)]">
                  {b.service === "MEDIATION" ? "Mediation" : "Consultation"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-display text-2xl text-[color:var(--color-forest-900)] mb-5">
          Manage availability
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lawyers.map((l) => (
            <li key={l.id}>
              <Link
                href={`/admin/lawyers/${l.slug}`}
                className="block rounded-lg border border-[color:var(--color-forest-100)] bg-white/60 p-4 hover:bg-[color:var(--color-forest-50)]"
              >
                <div className="font-medium text-[color:var(--color-forest-900)]">
                  {l.name}
                </div>
                <div className="text-xs text-[color:var(--color-ink-500)] mt-1">
                  {l.title}
                  {l.isMediator && " · Mediator"}
                </div>
                <div className="text-xs text-[color:var(--color-ink-500)] mt-2">
                  {l._count.bookings} active booking
                  {l._count.bookings === 1 ? "" : "s"}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
