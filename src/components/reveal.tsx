"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Delay in ms before the fade-up triggers after entering view. */
  delay?: number;
  /** Distance in px the content starts shifted below its final position. */
  offset?: number;
  /** Optional outer className; use sparingly — usually the parent handles layout. */
  className?: string;
  /** Element tag to render. */
  as?: "div" | "section" | "li" | "article";
};

/**
 * Reveal — one-shot fade-up triggered by IntersectionObserver.
 * Respects prefers-reduced-motion (rendered visible immediately).
 */
export function Reveal({
  children,
  delay = 0,
  offset = 18,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const style = {
    transform: visible ? "translateY(0)" : `translateY(${offset}px)`,
    opacity: visible ? 1 : 0,
    transitionDelay: `${delay}ms`,
  };

  return (
    <Tag
      ref={ref as never}
      className={`transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.65,.2,1)] ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}
