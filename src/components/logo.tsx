type LogoProps = {
  className?: string;
  variant?: "dark" | "light";
  showWordmark?: boolean;
};

/**
 * RWE monogram: three-letter mark inside a soft forest-green shield with a gold
 * hairline under the letters. Scales off font-size so it pairs cleanly with
 * the wordmark beside it.
 */
export function Logo({ className = "", variant = "dark", showWordmark = true }: LogoProps) {
  const ink =
    variant === "light" ? "var(--color-cream-50)" : "var(--color-forest-900)";
  const shield =
    variant === "light" ? "var(--color-forest-700)" : "var(--color-forest-800)";
  const shieldStroke =
    variant === "light"
      ? "var(--color-forest-600)"
      : "var(--color-forest-700)";
  const rweColor =
    variant === "light" ? "var(--color-cream-50)" : "var(--color-cream-50)";

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width="42"
        height="42"
        viewBox="0 0 48 48"
        role="img"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="rwe-shield" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={shield} stopOpacity="1" />
            <stop offset="100%" stopColor="var(--color-forest-950)" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Shield */}
        <path
          d="M24 3 L44 10 V24 C44 35 35 42 24 45 C13 42 4 35 4 24 V10 Z"
          fill="url(#rwe-shield)"
          stroke={shieldStroke}
          strokeWidth="0.75"
        />
        {/* Gold hairline rule */}
        <rect
          x="14"
          y="29"
          width="20"
          height="1.2"
          rx="0.6"
          fill="var(--color-gold-500)"
        />
        {/* RWE lettering */}
        <text
          x="24"
          y="25"
          textAnchor="middle"
          fontFamily="var(--font-cormorant), 'Cormorant Garamond', Georgia, serif"
          fontSize="14"
          fontWeight="500"
          fill={rweColor}
          letterSpacing="0.6"
        >
          RWE
        </text>
      </svg>
      {showWordmark && (
        <span className="hidden sm:flex flex-col leading-none">
          <span
            className="font-display text-[1.15rem] md:text-[1.35rem] tracking-tight"
            style={{ color: ink }}
          >
            RWE Family Law
          </span>
          <span
            className="text-[0.62rem] uppercase tracking-[0.24em] mt-1"
            style={{
              color:
                variant === "light"
                  ? "var(--color-cream-200)"
                  : "var(--color-gold-600)",
            }}
          >
            Vancouver, British Columbia
          </span>
        </span>
      )}
    </span>
  );
}
