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
        width="46"
        height="46"
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
        {/* RWE lettering — each letter placed individually so optical
            spacing on either side of the wide W stays balanced. */}
        <g
          fontFamily="var(--font-cormorant), 'Cormorant Garamond', Georgia, serif"
          fontSize="13"
          fontWeight="500"
          fill={rweColor}
        >
          <text x="15.5" y="23" textAnchor="middle">R</text>
          <text x="24" y="23" textAnchor="middle">W</text>
          <text x="32.5" y="23" textAnchor="middle">E</text>
        </g>
        {/* Family Law */}
        <text
          x="24"
          y="32.4"
          textAnchor="middle"
          fontFamily="var(--font-cormorant), 'Cormorant Garamond', Georgia, serif"
          fontStyle="italic"
          fontSize="5.5"
          fontWeight="500"
          fill="var(--color-gold-500)"
          letterSpacing="0.1"
        >
          Family Law
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
          <span
            className="text-[0.62rem] uppercase tracking-[0.24em] mt-0.5"
            style={{
              color:
                variant === "light"
                  ? "var(--color-gold-400)"
                  : "var(--color-gold-600)",
            }}
          >
            Est. 2012
          </span>
        </span>
      )}
    </span>
  );
}
