import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "rwe_admin";
const MAX_AGE = 60 * 60 * 12; // 12 hours

function signingSecret() {
  return (
    process.env.ADMIN_PASSWORD ??
    "dev-change-me-this-is-not-secure"
  );
}

function signToken(payload: string) {
  return createHmac("sha256", signingSecret()).update(payload).digest("hex");
}

export function createSessionCookieValue() {
  const issued = Date.now().toString(36);
  const sig = signToken(issued);
  return `${issued}.${sig}`;
}

export function verifyCookieValue(value: string | undefined): boolean {
  if (!value) return false;
  const [issued, sig] = value.split(".");
  if (!issued || !sig) return false;
  const expected = signToken(issued);
  try {
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return false;
    if (!timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  const ageSec = (Date.now() - parseInt(issued, 36)) / 1000;
  return ageSec < MAX_AGE;
}

export async function isAdminAuthed() {
  const jar = await cookies();
  return verifyCookieValue(jar.get(COOKIE_NAME)?.value);
}

export async function setAdminCookie() {
  const jar = await cookies();
  jar.set({
    name: COOKIE_NAME,
    value: createSessionCookieValue(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export function passwordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
