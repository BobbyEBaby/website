"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "redirecting" | "error";

export function PayInvoiceForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const rawAmount = String(fd.get("amount") ?? "").trim();
    const amountCad = Number(rawAmount.replace(/[$,]/g, ""));
    if (!Number.isFinite(amountCad) || amountCad <= 0) {
      setStatus("error");
      setError("Please enter a valid amount in CAD.");
      return;
    }

    const payload = {
      clientName: String(fd.get("clientName") ?? "").trim(),
      clientEmail: String(fd.get("clientEmail") ?? "").trim(),
      invoiceNumber: String(fd.get("invoiceNumber") ?? "").trim(),
      amountCad,
      note: String(fd.get("note") ?? "").trim(),
      website: String(fd.get("website") ?? ""),
    };

    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/pay", {
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
      if (!data.checkoutUrl) {
        // Honeypot path or unexpected — fail closed.
        setStatus("error");
        setError("Something went wrong. Please try again.");
        return;
      }
      setStatus("redirecting");
      // Hand off to Stripe Checkout — Stripe handles all card collection,
      // 3DS, receipt email, etc. We never touch card data.
      window.location.href = data.checkoutUrl;
    } catch {
      setStatus("error");
      setError("Network error. Please try again or call the office.");
    }
  }

  const disabled = status === "sending" || status === "redirecting";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-[color:var(--color-forest-100)] bg-white/60 p-6 md:p-8 space-y-5"
      aria-label="Pay an invoice"
    >
      <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-gold-600)]">
        Pay an invoice
      </div>
      <h3 className="font-display text-2xl text-[color:var(--color-forest-900)]">
        Settle your account online.
      </h3>
      <p className="text-sm text-[color:var(--color-ink-700)] leading-relaxed">
        Type the amount from your invoice, then continue to our secure payment
        processor. You&rsquo;ll receive an emailed receipt automatically.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Your name"
          name="clientName"
          required
          autoComplete="name"
        />
        <Field
          label="Email"
          name="clientEmail"
          type="email"
          required
          autoComplete="email"
          hint="Receipt is emailed here."
        />
        <Field
          label="Invoice number"
          name="invoiceNumber"
          autoComplete="off"
          optional
          hint="If you have it handy."
        />
        <AmountField />
      </div>

      <label className="block">
        <span className="flex items-baseline justify-between text-sm font-medium text-[color:var(--color-ink-900)] mb-1.5">
          <span>Note</span>
          <span className="text-xs font-normal text-[color:var(--color-ink-500)]">
            Optional
          </span>
        </span>
        <textarea
          name="note"
          rows={3}
          maxLength={500}
          className="w-full rounded-lg border border-[color:var(--color-forest-100)] bg-white px-3.5 py-2.5 text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-forest-400)] focus:border-[color:var(--color-forest-400)]"
          placeholder="e.g. partial payment on Smith file"
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
          disabled={disabled}
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-forest-800)] text-[color:var(--color-cream-50)] text-sm font-medium px-5 py-2.5 transition-colors hover:bg-[color:var(--color-forest-900)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "sending"
            ? "Preparing payment…"
            : status === "redirecting"
            ? "Redirecting to Stripe…"
            : "Continue to payment"}
          {!disabled && (
            <span aria-hidden="true" className="text-[color:var(--color-gold-400)]">
              →
            </span>
          )}
        </button>
        <p className="text-xs text-[color:var(--color-ink-500)] leading-relaxed">
          Payments are processed securely by Stripe. We never see or store your
          card details.
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
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  autoComplete?: string;
  hint?: string;
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
      {hint && (
        <span className="mt-1 block text-xs text-[color:var(--color-ink-500)]">
          {hint}
        </span>
      )}
    </label>
  );
}

function AmountField() {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-sm font-medium text-[color:var(--color-ink-900)] mb-1.5">
        <span>Amount (CAD)</span>
      </span>
      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-ink-500)]"
        >
          $
        </span>
        <input
          type="text"
          inputMode="decimal"
          name="amount"
          required
          placeholder="0.00"
          autoComplete="off"
          pattern="[0-9.,$ ]+"
          className="w-full rounded-lg border border-[color:var(--color-forest-100)] bg-white pl-7 pr-3.5 py-2.5 text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-forest-400)] focus:border-[color:var(--color-forest-400)]"
        />
      </div>
      <span className="mt-1 block text-xs text-[color:var(--color-ink-500)]">
        Type the total from your invoice.
      </span>
    </label>
  );
}
