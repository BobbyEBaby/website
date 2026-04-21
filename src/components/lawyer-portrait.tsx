"use client";

import Image from "next/image";
import { useState, useId } from "react";
import type { Lawyer } from "@/data/lawyers";
import { getInitials } from "@/data/lawyers";

type Props = {
  lawyer: Lawyer;
  /** Pixel size of the square; the actual box uses aspect-[3/4] scaling. */
  priority?: boolean;
  /** Rounded corners — pass "full" for circular thumbnails. */
  rounded?: "md" | "lg" | "xl" | "full";
  className?: string;
};

/**
 * Subtle crossfade between two portraits on hover (desktop) and tap-toggle (mobile).
 * Falls back to initials-in-a-circle when photos aren't present yet.
 */
export function LawyerPortrait({
  lawyer,
  priority = false,
  rounded = "lg",
  className = "",
}: Props) {
  const [tapActive, setTapActive] = useState(false);
  const descId = useId();
  const hasPrimary = Boolean(lawyer.photoPrimary);
  const hasSecondary = Boolean(lawyer.photoSecondary);

  const radius =
    rounded === "full"
      ? "rounded-full"
      : rounded === "xl"
      ? "rounded-2xl"
      : rounded === "md"
      ? "rounded-md"
      : "rounded-xl";

  if (!hasPrimary) {
    return (
      <div
        className={`relative aspect-[3/4] overflow-hidden ${radius} bg-gradient-to-br from-[color:var(--color-forest-700)] to-[color:var(--color-forest-900)] grid place-items-center select-none ${className}`}
        aria-label={`Portrait placeholder for ${lawyer.name}`}
      >
        <span className="font-display text-[color:var(--color-cream-50)] text-[clamp(2.5rem,6vw,4rem)]">
          {getInitials(lawyer.name)}
        </span>
        <span className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-[color:var(--color-gold-400)]" />
      </div>
    );
  }

  return (
    <figure
      className={`group relative aspect-[3/4] overflow-hidden ${radius} bg-[color:var(--color-forest-100)] ${className}`}
      onClick={() => hasSecondary && setTapActive((v) => !v)}
      onKeyDown={(e) => {
        if (hasSecondary && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          setTapActive((v) => !v);
        }
      }}
      tabIndex={hasSecondary ? 0 : -1}
      role={hasSecondary ? "button" : undefined}
      aria-describedby={hasSecondary ? descId : undefined}
      aria-label={
        hasSecondary ? `${lawyer.name}, tap to see alternate portrait` : undefined
      }
    >
      {/* Primary */}
      <Image
        src={lawyer.photoPrimary!}
        alt={`${lawyer.name} — ${lawyer.title}`}
        fill
        priority={priority}
        sizes="(max-width: 768px) 50vw, 25vw"
        className={`object-cover transition-[opacity,transform] duration-[650ms] ease-[cubic-bezier(.2,.7,.2,1)] ${
          hasSecondary
            ? `group-hover:opacity-0 group-hover:scale-[1.02] ${
                tapActive ? "opacity-0 scale-[1.02]" : ""
              }`
            : ""
        }`}
      />
      {/* Secondary */}
      {hasSecondary && (
        <Image
          src={lawyer.photoSecondary!}
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={`object-cover opacity-0 transition-[opacity,transform] duration-[650ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:opacity-100 group-hover:scale-[1.02] ${
            tapActive ? "opacity-100 scale-[1.02]" : ""
          }`}
        />
      )}
      {hasSecondary && (
        <span id={descId} className="sr-only">
          Tap to alternate between two portraits.
        </span>
      )}
    </figure>
  );
}
