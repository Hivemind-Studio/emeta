import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";

const COOKIE = "emeta_admin";

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(s);
}

/** Hash the admin password so it's never stored in plaintext. */
export function passwordHash(password: string): string {
  return crypto.createHmac("sha256", process.env.AUTH_SECRET || "").update(password).digest("hex");
}

export async function verifyCredentials(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD || process.env.PASSWORD;
  if (!expected) return false;
  // constant-time compare
  const a = crypto.createHmac("sha256", process.env.AUTH_SECRET || "").update(password).digest();
  const b = crypto.createHmac("sha256", process.env.AUTH_SECRET || "").update(expected).digest();
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function createSession(): Promise<void> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}

export async function requireAuth(): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin/login");
}