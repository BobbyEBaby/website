import Link from "next/link";
import { firm } from "@/data/firm";

export function MobileCTABar() {
  return (
    <div
      className="md:hidden fixed inset-x-0 bottom-0 z-30 bg-[color:var(--color-cream-50)]/95 backdrop-blur-md border-t border-[color:var(--color-forest-100)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Quick actions"
    >
      <div className="flex items-stretch gap-2 p-2">
        <a
          href={`tel:${firm.phone}`}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--color-forest-800)] text-[color:var(--color-forest-800)] text-sm font-medium py-3 transition-colors hover:bg-[color:var(--color-forest-50)]"
          aria-label={`Call us at ${firm.phoneDisplay}`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.8 12.8 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.8 12.8 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Call
        </a>
        <Link
          href="/contact"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-forest-800)] text-[color:var(--color-cream-50)] text-sm font-medium py-3 transition-colors hover:bg-[color:var(--color-forest-900)]"
        >
          Contact Office
          <span aria-hidden="true" className="text-[color:var(--color-gold-400)]">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
