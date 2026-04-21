import type { Metadata } from "next";
import { lawyers } from "@/data/lawyers";
import { BookingFlow } from "@/components/booking-flow";
import { Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Book a consultation",
  description:
    "Book a private consultation or mediation with a family lawyer at RWE Family Law. Pick your lawyer, pick a time, and pay securely online.",
};

type PageProps = {
  searchParams: Promise<{ lawyer?: string; service?: string }>;
};

export default async function BookPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const preselectedLawyer =
    typeof params.lawyer === "string" ? params.lawyer : undefined;
  const preselectedService =
    params.service === "mediation" ? "MEDIATION" : "CONSULTATION";

  return (
    <Container className="py-12 md:py-20 max-w-5xl">
      <div className="max-w-2xl">
        <SectionHeading
          eyebrow="Booking"
          title={<>Book a private consultation.</>}
          lead="Pick your lawyer and a time that works. Pay your consultation fee securely. You'll get a confirmation email and a calendar invite immediately."
        />
      </div>

      <div className="mt-10">
        <BookingFlow
          lawyers={lawyers.map((l) => ({
            slug: l.slug,
            name: l.name,
            honorific: l.honorific ?? null,
            title: l.title,
            shortBio: l.shortBio,
            rateCad: l.consultationRateCad,
            minutes: l.consultationMinutes,
            isMediator: Boolean(l.isMediator),
            photoPrimary: l.photoPrimary ?? null,
            calendlyUrl: l.calendlyUrl ?? null,
          }))}
          preselectedLawyerSlug={preselectedLawyer}
          preselectedService={preselectedService}
        />
      </div>
    </Container>
  );
}
