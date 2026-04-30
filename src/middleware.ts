import { NextRequest, NextResponse } from "next/server";

const USERNAME = process.env.PREVIEW_USERNAME || "preview";
const PASSWORD = process.env.PREVIEW_PASSWORD || "password";

export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
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
//   - api/stripe/webhook — operating-account Stripe webhook
//   - api/stripe/webhook-trust — trust-account Stripe webhook
//   Stripe servers POST to both webhook paths and can't send Basic creds.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook|api/stripe/webhook-trust).*)",
  ],
};
