"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      subject: fd.get("subject"),
      message: fd.get("message"),
      website: fd.get("website"),
    };

    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
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
    } catch {
      setStatus("error");
      setError("Network error. Please try again or call us.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-[color:var(--color-forest-200)] bg-[color:var(--color-forest-50)] p-8">
        <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-gold-600)] mb-3">
          Message received
        </div>
        <h3 className="font-display text-2xl text-[color:var(--color-forest-900)]">
          Thank you — we&rsquo;ll be in touch.
        </h3>
        <p className="mt-3 text-[color:var(--color-ink-700)] leading-relaxed">
          We reply to every message within one business day. For anything urgent,
          please call the office.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-medium text-[color:var(--color-forest-800)] hover:text-[color:var(--color-forest-900)]"
        >
          Send another message
          <span aria-hidden="true" className="ml-2">→</span>
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-[color:var(--color-forest-100)] bg-white/60 p-6 md:p-8 space-y-5"
      aria-label="Send us a message"
    >
      <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-gold-600)]">
        Send us a message
      </div>
      <h3 className="font-display text-2xl text-[color:var(--color-forest-900)]">
        Tell us briefly what&rsquo;s going on.
      </h3>
      <p className="text-sm text-[color:var(--color-ink-700)] leading-relaxed">
        Your message goes straight to our intake inbox. We respond within one
        business day.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required autoComplete="name" />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
        <Field
          label="Other side's name"
          name="subject"
          autoComplete="off"
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          optional
        />
      </div>

      <label className="block">
        <span className="block text-sm font-medium text-[color:var(--color-ink-900)] mb-1.5">
          Message
        </span>
        <textarea
          name="message"
          required
          rows={6}
          className="w-full rounded-lg border border-[color:var(--color-forest-100)] bg-white px-3.5 py-2.5 text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-forest-400)] focus:border-[color:var(--color-forest-400)]"
          placeholder="A sentence or two about your situation is plenty."
        />
      </label>

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
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-forest-800)] text-[color:var(--color-cream-50)] text-sm font-medium px-5 py-2.5 transition-colors hover:bg-[color:var(--color-forest-900)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "sending" ? "Sending…" : "Send message"}
          {status !== "sending" && (
            <span aria-hidden="true" className="text-[color:var(--color-gold-400)]">
              →
            </span>
          )}
        </button>
        <p className="text-xs text-[color:var(--color-ink-500)] leading-relaxed">
          This form is for general enquiries. Sending a message does not create
          a lawyer–client relationship.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  optional = false,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-sm font-medium text-[color:var(--color-ink-900)] mb-1.5">
        <span>{label}</span>
        {optional && (
          <span className="text-xs font-normal text-[color:var(--color-ink-500)]">
            Optional
          </span>
        )}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-[color:var(--color-forest-100)] bg-white px-3.5 py-2.5 text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-forest-400)] focus:border-[color:var(--color-forest-400)]"
      />
    </label>
  );
}
