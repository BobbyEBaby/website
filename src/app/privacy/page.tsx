import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <Container className="py-16 md:py-24 max-w-3xl">
      <SectionHeading eyebrow="Policy" title={<>Privacy policy.</>} />
      <div className="mt-10 space-y-6 text-[color:var(--color-ink-700)] leading-relaxed">
        <p>
          This is a placeholder privacy policy. Replace with the final
          PIPEDA-compliant text reviewed by the firm before launch. It should
          cover: what personal information we collect through the site, how
          consultation intake data is stored, how long we retain it, your
          rights to access and correct your information, and who to contact
          with privacy questions.
        </p>
      </div>
    </Container>
  );
}
