import { NextRequest, NextResponse } from "next/server";

// Preview gate: HTTP Basic Auth is enforced ONLY when both PREVIEW_USERNAME
// and PREVIEW_PASSWORD are explicitly set in the environment. To open the
// site to the public for launch, simply remove (or unset) those two env
// vars in Vercel — no code change required.
//
// In non-production builds the gate is always off so local dev isn't
// nagged for credentials.
const USERNAME = process.env.PREVIEW_USERNAME;
const PASSWORD = process.env.PREVIEW_PASSWORD;
const GATE_ENABLED =
  process.env.NODE_ENV === "production" && !!USERNAME && !!PASSWORD;

export function middleware(req: NextRequest) {
  if (!GATE_ENABLED) {
    return NextResponse.next();
  }
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const [user, pass] = atob(auth.slice(6)).split(":");
    if (user === USERNAME && pass === PASSWORD) {
      return NextResponse.next();
    }
  }
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="RWE Family Law preview"',
    },
  });
}

// Exclude paths that must be reachable without Basic Auth:
//   - _next/static, _next/image, favicon.ico — Next asset paths
//   - sitemap.xml, robots.txt — must be reachable by crawlers (only relevant
//     once the gate is removed, but harmless to allow through always)
//   - api/stripe/webhook — operating-account Stripe webhook
//   - api/stripe/webhook-trust — trust-account Stripe webhook
//   Stripe servers POST to both webhook paths and can't send Basic creds.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/stripe/webhook|api/stripe/webhook-trust).*)",
  ],
};
