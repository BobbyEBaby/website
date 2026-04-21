import type { Metadata } from "next";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Booking cancelled",
  robots: { index: false, follow: false },
};

export default function BookingCancelPage() {
  return (
    <Container className="py-20 max-w-2xl">
      <SectionHeading
        eyebrow="Booking"
        title={<>No payment was made.</>}
        lead="You can try again whenever you're ready — we hold the time for a few minutes, then release it for someone else."
      />
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/book" size="lg">
          Try again
        </ButtonLink>
        <ButtonLink href="/contact" variant="ghost" size="lg">
          Contact the firm
        </ButtonLink>
      </div>
    </Container>
  );
}
