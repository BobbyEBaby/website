import { NextRequest, NextResponse } from "next/server";

const USERNAME = process.env.PREVIEW_USERNAME || "preview";
const PASSWORD = process.env.PREVIEW_PASSWORD || "password";

export function middleware(req: NextRequest) {
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

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
