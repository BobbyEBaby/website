import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://rwelaw.ca";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /admin is the firm-only intake/booking dashboard.
        // /api is server-side only — nothing useful for search.
        // /pay and /retainer are transactional checkout endpoints.
        disallow: ["/admin", "/api/", "/pay", "/retainer"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
