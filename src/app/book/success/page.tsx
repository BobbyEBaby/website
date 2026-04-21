import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Booking confirmed",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function BookingSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.token;

  const booking = token
    ? await prisma.booking.findUnique({
        where: { confirmationToken: token },
        include: { lawyer: true },
      })
    : null;

  if (!booking) {
    return (
      <Container className="py-20 max-w-2xl">
        <SectionHeading
          eyebrow="Booking"
          title={<>We couldn&rsquo;t find that booking.</>}
          lead="The link may have expired. If you just paid but don't see a confirmation, check your email — or contact the firm and we'll sort it out."
        />
      </Container>
    );
  }

  const pending = booking.status === "PENDING_PAYMENT";
  const when = new Intl.DateTimeFormat("en-CA", {
    timeZone: booking.lawyer.timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(booking.start);

  return (
    <Container className="py-16 md:py-24 max-w-2xl">
      <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-gold-600)] font-medium mb-4">
        {pending ? "Booking received" : "Booking confirmed"}
      </div>
      <h1 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] text-[color:var(--color-forest-900)]">
        {pending
          ? "Thank you — we're confirming your payment."
          : `You're booked with ${booking.lawyer.name}.`}
      </h1>

      <div className="mt-10 rounded-xl border border-[color:var(--color-forest-100)] bg-white/70 p-6 md:p-8">
        <dl className="grid gap-4 sm:grid-cols-2">
          <Row k="Service" v={booking.service === "MEDIATION" ? "Mediation" : "Consultation"} />
          <Row k="With" v={booking.lawyer.name} />
          <Row k="When" v={when} />
          <Row k="Duration" v={`${Math.round((booking.end.getTime() - booking.start.getTime()) / 60000)} minutes`} />
          <Row k="Amount" v={`$${(booking.priceCents / 100).toFixed(2)} ${booking.currency}`} />
          <Row k="Reference" v={booking.id} />
        </dl>
      </div>

      <p className="mt-8 text-[color:var(--color-ink-700)] leading-relaxed">
        {pending
          ? "Stripe is still confirming the payment. You'll receive a confirmation email with a calendar invite within a minute or two. If it doesn't arrive, check your spam folder or contact the firm."
          : `A confirmation email with a calendar invite is on its way to ${booking.clientEmail}. If you need to reschedule, reply to that email at least 24 hours in advance.`}
      </p>

      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-forest-800)] hover:text-[color:var(--color-forest-900)]"
        >
          ← Back to home
        </Link>
      </div>
    </Container>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.14em] text-[color:var(--color-gold-600)] mb-1">
        {k}
      </dt>
      <dd className="text-[color:var(--color-ink-900)]">{v}</dd>
    </div>
  );
}
