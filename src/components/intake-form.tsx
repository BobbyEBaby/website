"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function IntakeForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const get = (k: string) => String(fd.get(k) ?? "").trim();

    const payload = {
      clientName: get("clientName"),
      phone: get("phone"),
      email: get("email"),
      opposingName: get("opposingName"),
      nextCourtDate: get("nextCourtDate"),
      courtLocation: get("courtLocation"),
      opposingLawyer: get("opposingLawyer"),
      marriageDate: get("marriageDate"),
      separationDate: get("separationDate"),
      children: get("children"),
      assets: get("assets"),
      debts: get("debts"),
      clientIncome: get("clientIncome"),
      opposingIncome: get("opposingIncome"),
      retainerSource: get("retainerSource"),
      occupation: get("occupation"),
      occupationAddress: get("occupationAddress"),
      occupationPhone: get("occupationPhone"),
      objective: get("objective"),
      questions: get("questions"),
      website: get("website"),
    };

    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("sent");
      form.reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
      setError("Network error. Please try again or call us.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-[color:var(--color-forest-200)] bg-[color:var(--color-forest-50)] p-8">
        <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-gold-600)] mb-3">
          Form received
        </div>
        <h3 className="font-display text-2xl text-[color:var(--color-forest-900)]">
          Thank you — we&rsquo;ll be in touch.
        </h3>
        <p className="mt-3 text-[color:var(--color-ink-700)] leading-relaxed">
          A lawyer will review what you&rsquo;ve sent and reach out within
          one business day. For anything urgent, please call the office.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-medium text-[color:var(--color-forest-800)] hover:text-[color:var(--color-forest-900)]"
        >
          Submit another intake
          <span aria-hidden="true" className="ml-2">→</span>
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-[color:var(--color-forest-100)] bg-white/60 p-6 md:p-8 space-y-10"
      aria-label="New client intake form"
    >
      <div>
        <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-gold-600)]">
          Client intake
        </div>
        <h3 className="font-display text-2xl text-[color:var(--color-forest-900)] mt-2">
          Tell us about your situation.
        </h3>
        <p className="mt-2 text-sm text-[color:var(--color-ink-700)] leading-relaxed">
          Every field is optional — share as much or as little as you&rsquo;re
          comfortable with. The more we know up front, the more useful our
          first conversation can be.
        </p>
      </div>

      <Section title="Contact">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Your name"
            name="clientName"
            autoComplete="name"
            hint="So we know who&rsquo;s asking."
          />
          <Field
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
          />
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            wide
          />
        </div>
      </Section>

      <Section title="The other side">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Their name" name="opposingName" autoComplete="off" />
          <Field
            label="Their lawyer (if any)"
            name="opposingLawyer"
            autoComplete="off"
          />
          <Field
            label="Their income (if known)"
            name="opposingIncome"
            autoComplete="off"
            wide
            hint="Annual figure or what you know — &ldquo;approx. $90k&rdquo; is fine."
          />
        </div>
      </Section>

      <Section title="Relationship">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Date of marriage or cohabitation"
            name="marriageDate"
            placeholder="e.g. June 2018"
            autoComplete="off"
          />
          <Field
            label="Date of separation"
            name="separationDate"
            placeholder="e.g. March 2024"
            autoComplete="off"
          />
        </div>
      </Section>

      <Section title="Children">
        <TextArea
          label="Names and birthdates"
          name="children"
          rows={4}
          placeholder={"One per line — Name, Date of birth\ne.g. Sophie, 2014-08-12\n      Liam, 2017-04-30"}
        />
      </Section>

      <Section title="Court (if proceedings have started)">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Next court date"
            name="nextCourtDate"
            placeholder="e.g. November 12, 2026"
            autoComplete="off"
          />
          <Field
            label="Court location"
            name="courtLocation"
            placeholder="e.g. Vancouver Provincial Court"
            autoComplete="off"
          />
        </div>
      </Section>

      <Section title="Finances">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Your annual income"
            name="clientIncome"
            placeholder="e.g. $85,000"
            autoComplete="off"
            wide
          />
          <TextArea
            label="Source of retainer funds"
            name="retainerSource"
            rows={2}
            wide
            placeholder="e.g. Employment income · Savings · Loan from family · Line of credit"
          />
          <TextArea
            label="List of assets"
            name="assets"
            rows={5}
            wide
            placeholder={"One per line — what it is, who&rsquo;s on title, rough value\ne.g. House on Kingsway (joint, ~$1.4M)\n      RRSP (mine, ~$120k)"}
          />
          <TextArea
            label="List of debts"
            name="debts"
            rows={5}
            wide
            placeholder={"One per line — what it is, in whose name, balance\ne.g. Mortgage on Kingsway (joint, ~$680k)\n      Visa (mine, ~$8k)"}
          />
        </div>
      </Section>

      <Section title="Your work">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Occupation"
            name="occupation"
            autoComplete="organization-title"
          />
          <Field
            label="Work phone"
            name="occupationPhone"
            type="tel"
            autoComplete="tel-extension"
          />
          <Field
            label="Work address"
            name="occupationAddress"
            autoComplete="street-address"
            wide
          />
        </div>
      </Section>

      <Section title="What you want from us">
        <div className="grid gap-5">
          <TextArea
            label="Your objective or goal"
            name="objective"
            rows={4}
            placeholder="What does a good outcome look like to you?"
          />
          <TextArea
            label="Questions or concerns"
            name="questions"
            rows={6}
            placeholder="Anything you&rsquo;d like the lawyer to know before your consult."
          />
        </div>
      </Section>

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

      {status === "error" && error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm"
        >
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-forest-800)] text-[color:var(--color-cream-50)] text-sm font-medium px-5 py-2.5 transition-colors hover:bg-[color:var(--color-forest-900)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {sending ? "Sending…" : "Submit intake"}
          {!sending && (
            <span aria-hidden="true" className="text-[color:var(--color-gold-400)]">
              →
            </span>
          )}
        </button>
        <p className="text-xs text-[color:var(--color-ink-500)] leading-relaxed">
          Submitting this form does not create a lawyer&ndash;client
          relationship.
        </p>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-gold-600)] font-medium">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
  hint,
  wide = false,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
  wide?: boolean;
}) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="block text-sm font-medium text-[color:var(--color-ink-900)] mb-1.5">
        {label}
      </span>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[color:var(--color-forest-100)] bg-white px-3.5 py-2.5 text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-forest-400)] focus:border-[color:var(--color-forest-400)]"
      />
      {hint && (
        <span className="mt-1 block text-xs text-[color:var(--color-ink-500)]">
          {hint}
        </span>
      )}
    </label>
  );
}

function TextArea({
  label,
  name,
  rows = 4,
  placeholder,
  hint,
  wide = false,
}: {
  label: string;
  name: string;
  rows?: number;
  placeholder?: string;
  hint?: string;
  wide?: boolean;
}) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="block text-sm font-medium text-[color:var(--color-ink-900)] mb-1.5">
        {label}
      </span>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[color:var(--color-forest-100)] bg-white px-3.5 py-2.5 text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-forest-400)] focus:border-[color:var(--color-forest-400)] font-sans"
      />
      {hint && (
        <span className="mt-1 block text-xs text-[color:var(--color-ink-500)]">
          {hint}
        </span>
      )}
    </label>
  );
}
