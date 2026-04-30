"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getInitials } from "@/data/lawyers";

type LawyerSummary = {
  slug: string;
  name: string;
  honorific: string | null;
  title: string;
  shortBio: string;
  rateCad: number;
  minutes: number;
  isMediator: boolean;
  photoPrimary: string | null;
  calendlyUrl: string | null;
};

type Service = "CONSULTATION" | "MEDIATION";

type Step = 1 | 2 | 3;

type Props = {
  lawyers: LawyerSummary[];
  preselectedLawyerSlug?: string;
  preselectedService?: Service;
};

export function BookingFlow({
  lawyers,
  preselectedLawyerSlug,
  preselectedService = "CONSULTATION",
}: Props) {
  const [step, setStep] = useState<Step>(preselectedLawyerSlug ? 2 : 1);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    preselectedLawyerSlug ?? null
  );
  const [service, setService] = useState<Service>(preselectedService);

  const selectedLawyer =
    lawyers.find((l) => l.slug === selectedSlug) ?? null;

  const onPickLawyer = (slug: string) => {
    setSelectedSlug(slug);
    setStep(2);
  };

  return (
    <div className="space-y-10">
      <Stepper step={step} />

      {step === 1 && (
        <LawyerPicker
          lawyers={lawyers}
          service={service}
          onServiceChange={setService}
          onPick={onPickLawyer}
        />
      )}

      {step === 2 && selectedLawyer && (
        <DetailsStep
          lawyer={selectedLawyer}
          service={service}
          onBack={() => setStep(1)}
          onContinue={() => setStep(3)}
        />
      )}

      {step === 3 && selectedLawyer && (
        <CalendlyStep
          lawyer={selectedLawyer}
          service={service}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps = [
    { n: 1, label: "Choose lawyer" },
    { n: 2, label: "A few details" },
    { n: 3, label: "Pick a time" },
  ];
  return (
    <ol className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
      {steps.map((s) => {
        const done = s.n < step;
        const active = s.n === step;
        return (
          <li key={s.n} className="flex items-center gap-2">
            <span
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium border transition-colors ${
                done
                  ? "bg-[color:var(--color-forest-800)] text-white border-[color:var(--color-forest-800)]"
                  : active
                  ? "bg-[color:var(--color-gold-500)] text-[color:var(--color-forest-950)] border-[color:var(--color-gold-500)]"
                  : "bg-transparent text-[color:var(--color-ink-500)] border-[color:var(--color-forest-200)]"
              }`}
              aria-current={active ? "step" : undefined}
            >
              {done ? "✓" : s.n}
            </span>
            <span
              className={
                active
                  ? "text-[color:var(--color-forest-900)] font-medium"
                  : "text-[color:var(--color-ink-500)]"
              }
            >
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function LawyerPicker({
  lawyers,
  service,
  onServiceChange,
  onPick,
}: {
  lawyers: LawyerSummary[];
  service: Service;
  onServiceChange: (s: Service) => void;
  onPick: (slug: string) => void;
}) {
  const filtered = useMemo(
    () =>
      service === "MEDIATION"
        ? lawyers.filter((l) => l.isMediator)
        : lawyers,
    [service, lawyers]
  );

  return (
    <div>
      <fieldset className="mb-8">
        <legend className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-gold-600)] font-medium mb-3">
          What do you need?
        </legend>
        <div className="inline-flex rounded-full border border-[color:var(--color-forest-200)] p-1 bg-white">
          <ServiceToggle
            label="Consultation"
            active={service === "CONSULTATION"}
            onClick={() => onServiceChange("CONSULTATION")}
          />
          <ServiceToggle
            label="Mediation"
            active={service === "MEDIATION"}
            onClick={() => onServiceChange("MEDIATION")}
          />
        </div>
        <p className="mt-3 text-sm text-[color:var(--color-ink-500)]">
          {service === "MEDIATION"
            ? "Mediation is shown only for lawyers who act as mediators."
            : "A private 30-minute session with the lawyer of your choice."}
        </p>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((lawyer) => (
          <button
            key={lawyer.slug}
            type="button"
            onClick={() => onPick(lawyer.slug)}
            className="group text-left rounded-xl border border-[color:var(--color-forest-100)] bg-white/60 hover:bg-[color:var(--color-forest-50)] hover:border-[color:var(--color-forest-200)] transition-colors p-5 flex gap-4"
          >
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[color:var(--color-forest-800)] shrink-0 grid place-items-center">
              {lawyer.photoPrimary ? (
                <Image
                  src={lawyer.photoPrimary}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover object-top"
                />
              ) : (
                <span className="font-display text-white text-xl">
                  {getInitials(lawyer.name)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className="font-display text-lg text-[color:var(--color-forest-900)] truncate">
                {lawyer.name}
                {lawyer.honorific ? `, ${lawyer.honorific}` : ""}
              </div>
              <div className="text-xs text-[color:var(--color-ink-500)] mb-2">
                {lawyer.slug === "bionca-chu" ? "Articling Student" : "Lawyer"}
                {lawyer.isMediator && " · Mediator"}
              </div>
              <p className="text-sm text-[color:var(--color-ink-700)] line-clamp-3 leading-relaxed">
                {lawyer.shortBio}
              </p>
              <div className="mt-3 text-xs text-[color:var(--color-forest-700)]">
                ${lawyer.rateCad} CAD · {lawyer.minutes} min
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ServiceToggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
        active
          ? "bg-[color:var(--color-forest-800)] text-white"
          : "text-[color:var(--color-ink-700)] hover:text-[color:var(--color-forest-900)]"
      }`}
    >
      {label}
    </button>
  );
}

// ---- Step 2: Quick details (conflict screen) -------------------------

function DetailsStep({
  lawyer,
  service,
  onBack,
  onContinue,
}: {
  lawyer: LawyerSummary;
  service: Service;
  onBack: () => void;
  onContinue: () => void;
}) {
  const [clientName, setClientName] = useState("");
  const [opposingName, setOpposingName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!clientName.trim() || !opposingName.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    setSubmitting(true);
    try {
      // Fire the screen but don't block forward progress on a network blip —
      // a missed conflict alert is recoverable; preventing a paid booking
      // because of a flaky API is not.
      const res = await fetch("/api/booking-screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          opposingName: opposingName.trim(),
          lawyerSlug: lawyer.slug,
          service,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (res.status === 400) {
          setError(data.error ?? "Please check the fields above.");
          setSubmitting(false);
          return;
        }
        // 5xx — log it but proceed
        console.warn("[booking-screen] non-OK response, proceeding anyway", res.status);
      }
    } catch (e) {
      console.warn("[booking-screen] request failed, proceeding anyway", e);
    }
    onContinue();
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-[color:var(--color-forest-700)] hover:text-[color:var(--color-forest-900)]"
        >
          ← Change lawyer
        </button>
        <span className="text-sm text-[color:var(--color-ink-500)]">
          Booking with{" "}
          <span className="font-medium text-[color:var(--color-forest-900)]">
            {lawyer.name}
          </span>
        </span>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-[color:var(--color-forest-100)] bg-white/60 p-6 md:p-8 space-y-5 max-w-xl"
        aria-label="A few details before booking"
      >
        <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-gold-600)]">
          Step 2 of 3
        </div>
        <h3 className="font-display text-2xl text-[color:var(--color-forest-900)]">
          A few details before we show you times.
        </h3>
        <p className="text-sm text-[color:var(--color-ink-700)] leading-relaxed">
          We use these to make sure there&rsquo;s no conflict of interest between
          you, the other side, and our existing clients.
        </p>

        <label className="block">
          <span className="block text-sm font-medium text-[color:var(--color-ink-900)] mb-1.5">
            Your full name
          </span>
          <input
            type="text"
            name="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
            autoComplete="name"
            className="w-full rounded-lg border border-[color:var(--color-forest-100)] bg-white px-3.5 py-2.5 text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-forest-400)] focus:border-[color:var(--color-forest-400)]"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-[color:var(--color-ink-900)] mb-1.5">
            Other side&rsquo;s full name
          </span>
          <input
            type="text"
            name="opposingName"
            value={opposingName}
            onChange={(e) => setOpposingName(e.target.value)}
            required
            autoComplete="off"
            placeholder="Spouse, ex-partner, or whomever the matter is against"
            className="w-full rounded-lg border border-[color:var(--color-forest-100)] bg-white px-3.5 py-2.5 text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-forest-400)] focus:border-[color:var(--color-forest-400)]"
          />
        </label>

        {/* Honeypot */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden"
        >
          <label>
            Leave this field empty
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm"
          >
            {error}
          </div>
        )}

        <div className="pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-forest-800)] text-[color:var(--color-cream-50)] text-sm font-medium px-5 py-2.5 transition-colors hover:bg-[color:var(--color-forest-900)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Continuing…" : "Continue to scheduling"}
            {!submitting && (
              <span aria-hidden="true" className="text-[color:var(--color-gold-400)]">
                →
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ---- Step 3: Calendly embed ------------------------------------------

function CalendlyStep({
  lawyer,
  service,
  onBack,
}: {
  lawyer: LawyerSummary;
  service: Service;
  onBack: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-[color:var(--color-forest-700)] hover:text-[color:var(--color-forest-900)]"
        >
          ← Change lawyer
        </button>
        <span className="text-sm text-[color:var(--color-ink-500)]">
          Booking with{" "}
          <span className="font-medium text-[color:var(--color-forest-900)]">
            {lawyer.name}
          </span>
        </span>
      </div>

      {lawyer.calendlyUrl ? (
        <CalendlyEmbed url={lawyer.calendlyUrl} service={service} />
      ) : (
        <CalendlyUnavailable lawyer={lawyer} />
      )}
    </div>
  );
}

function CalendlyEmbed({ url, service }: { url: string; service: Service }) {
  const [origin, setOrigin] = useState<string>("");

  useEffect(() => {
    setOrigin(window.location.host);
  }, []);

  // Brand the widget and prefill the event type via UTM so Calendly can route
  // mediation vs. consultation to the right event on the lawyer's calendar.
  const params = new URLSearchParams({
    embed_type: "Inline",
    embed_domain: origin || "rwelaw.ca",
    hide_gdpr_banner: "1",
    primary_color: "254d3c",
    utm_source: "rwelaw",
    utm_campaign: service.toLowerCase(),
  });

  const src = `${url}?${params.toString()}`;

  return (
    <div
      className="rounded-xl border border-[color:var(--color-forest-100)] overflow-hidden bg-white"
      aria-label="Scheduling calendar"
    >
      <iframe
        key={src}
        src={src}
        title="Schedule a time"
        className="block w-full"
        style={{ height: "min(1100px, 100vh)", minHeight: 720 }}
        loading="lazy"
      />
    </div>
  );
}

function CalendlyUnavailable({ lawyer }: { lawyer: LawyerSummary }) {
  return (
    <div className="rounded-xl border border-[color:var(--color-forest-100)] bg-white/70 p-8 text-[color:var(--color-ink-700)]">
      <p className="font-display text-2xl text-[color:var(--color-forest-900)] mb-3">
        Online scheduling isn&rsquo;t set up for {lawyer.name} yet.
      </p>
      <p className="leading-relaxed mb-5">
        Please reach out through the contact page and we&rsquo;ll find a time
        that works — usually within one business day.
      </p>
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-forest-800)] text-[color:var(--color-cream-50)] text-sm font-medium px-5 py-2.5 hover:bg-[color:var(--color-forest-900)] transition-colors"
      >
        Go to contact
        <span aria-hidden="true" className="text-[color:var(--color-gold-400)]">→</span>
      </Link>
    </div>
  );
}
