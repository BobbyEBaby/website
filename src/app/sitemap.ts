import type { MetadataRoute } from "next";
import { lawyers } from "@/data/lawyers";
import { practiceAreas } from "@/data/practice-areas";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://rwelaw.ca";

// Static, indexable top-level routes. Anything that's a tool surface
// (/admin, /pay, /retainer) or an API route is intentionally excluded —
// they shouldn't appear in search results.
const STATIC_PATHS: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "monthly" },
  { path: "/lawyers", priority: 0.9, changeFrequency: "monthly" },
  { path: "/practice-areas", priority: 0.9, changeFrequency: "monthly" },
  { path: "/high-net-worth", priority: 0.8, changeFrequency: "monthly" },
  { path: "/mediation", priority: 0.8, changeFrequency: "monthly" },
  { path: "/fees", priority: 0.7, changeFrequency: "monthly" },
  { path: "/book", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/intake", priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(
    ({ path, priority, changeFrequency }) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency,
      priority,
    })
  );

  const lawyerEntries: MetadataRoute.Sitemap = lawyers.map((lawyer) => ({
    url: `${SITE_URL}/lawyers/${lawyer.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Skip practice areas that route to a custom page (e.g. high-net-worth → /high-net-worth);
  // those are already in STATIC_PATHS.
  const practiceAreaEntries: MetadataRoute.Sitemap = practiceAreas
    .filter((p) => !p.customHref)
    .map((p) => ({
      url: `${SITE_URL}/practice-areas/${p.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [...staticEntries, ...lawyerEntries, ...practiceAreaEntries];
}
