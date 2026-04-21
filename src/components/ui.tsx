import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto max-w-6xl px-5 md:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <header className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <div className="flex items-center gap-3 mb-4 text-[color:var(--color-gold-600)] text-xs uppercase tracking-[0.18em] font-medium">
          <span className="gold-rule" aria-hidden="true" />
          <span>{eyebrow}</span>
        </div>
      )}
      <h2 className="font-display text-[clamp(1.875rem,4vw,3rem)] leading-[1.1] text-[color:var(--color-forest-900)]">
        {title}
      </h2>
      {lead && (
        <p className="mt-5 text-lg text-[color:var(--color-ink-700)] max-w-2xl leading-relaxed">
          {lead}
        </p>
      )}
    </header>
  );
}

type ButtonVariant = "primary" | "ghost" | "gold";
type ButtonSize = "sm" | "md" | "lg";

const buttonClasses = (variant: ButtonVariant, size: ButtonSize) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
  const sizes: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm md:text-base",
    lg: "px-7 py-3.5 text-base",
  };
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[color:var(--color-forest-800)] text-[color:var(--color-cream-50)] hover:bg-[color:var(--color-forest-900)]",
    ghost:
      "bg-transparent text-[color:var(--color-forest-800)] border border-[color:var(--color-forest-200)] hover:bg-[color:var(--color-forest-50)]",
    gold: "bg-[color:var(--color-gold-500)] text-[color:var(--color-forest-950)] hover:bg-[color:var(--color-gold-400)]",
  };
  return `${base} ${sizes[size]} ${variants[variant]}`;
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link
      href={href}
      className={`${buttonClasses(variant, size)} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      {...rest}
      className={`${buttonClasses(variant, size)} ${className}`}
    >
      {children}
    </button>
  );
}
