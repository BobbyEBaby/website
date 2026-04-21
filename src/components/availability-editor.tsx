"use client";

import { useState } from "react";

type Rule = {
  id?: string;
  dayOfWeek: number;
  startMin: number;
  endMin: number;
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function minToHM(min: number) {
  const h = String(Math.floor(min / 60)).padStart(2, "0");
  const m = String(min % 60).padStart(2, "0");
  return `${h}:${m}`;
}
function hmToMin(hm: string) {
  const [h, m] = hm.split(":").map((n) => parseInt(n, 10));
  return h * 60 + m;
}

export function AvailabilityEditor({
  lawyerSlug,
  initialRules,
}: {
  lawyerSlug: string;
  initialRules: Rule[];
}) {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const addRule = (dayOfWeek: number) => {
    setRules((r) => [...r, { dayOfWeek, startMin: 9 * 60, endMin: 17 * 60 }]);
  };

  const removeRule = (idx: number) => {
    setRules((r) => r.filter((_, i) => i !== idx));
  };

  const updateRule = (idx: number, patch: Partial<Rule>) => {
    setRules((r) => r.map((rule, i) => (i === idx ? { ...rule, ...patch } : rule)));
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/admin/availability/${lawyerSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus(data.error ?? "Save failed");
        return;
      }
      setStatus("Saved.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {DAY_LABELS.map((label, dow) => {
        const dayRules = rules
          .map((r, idx) => ({ r, idx }))
          .filter((x) => x.r.dayOfWeek === dow);
        return (
          <div
            key={dow}
            className="flex gap-6 pb-6 border-b border-[color:var(--color-forest-100)] last:border-b-0"
          >
            <div className="w-16 pt-1 font-medium text-[color:var(--color-forest-900)]">
              {label}
            </div>
            <div className="flex-1 space-y-2">
              {dayRules.length === 0 && (
                <div className="text-sm text-[color:var(--color-ink-500)]">
                  Unavailable
                </div>
              )}
              {dayRules.map(({ r, idx }) => (
                <div key={idx} className="flex flex-wrap items-center gap-2">
                  <input
                    type="time"
                    value={minToHM(r.startMin)}
                    onChange={(e) =>
                      updateRule(idx, { startMin: hmToMin(e.target.value) })
                    }
                    className="rounded-md border border-[color:var(--color-forest-200)] px-2 py-1.5 text-sm bg-white/80"
                  />
                  <span className="text-[color:var(--color-ink-500)] text-sm">to</span>
                  <input
                    type="time"
                    value={minToHM(r.endMin)}
                    onChange={(e) =>
                      updateRule(idx, { endMin: hmToMin(e.target.value) })
                    }
                    className="rounded-md border border-[color:var(--color-forest-200)] px-2 py-1.5 text-sm bg-white/80"
                  />
                  <button
                    type="button"
                    onClick={() => removeRule(idx)}
                    className="text-xs text-[color:var(--color-ink-500)] hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addRule(dow)}
                className="text-xs text-[color:var(--color-forest-700)] hover:text-[color:var(--color-forest-900)]"
              >
                + Add window
              </button>
            </div>
          </div>
        );
      })}

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-forest-800)] text-[color:var(--color-cream-50)] text-sm font-medium px-5 py-2.5 transition-colors hover:bg-[color:var(--color-forest-900)] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save availability"}
        </button>
        {status && <span className="text-sm text-[color:var(--color-ink-500)]">{status}</span>}
      </div>
    </div>
  );
}
