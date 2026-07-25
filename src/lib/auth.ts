import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const COOKIE_NAME = "ferums_session";
const ALG = "HS256";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Built-in fallback so the app works out-of-the-box. Override with the
// JWT_SECRET env var in production for better security.
export const DEFAULT_JWT_SECRET = "ferums-default-secret-ee6c1f-change-in-prod-9b2e7a4c1d";
function secret(): Uint8Array {
  return new TextEncoder().encode(process.env.JWT_SECRET || DEFAULT_JWT_SECRET);
}

export interface SessionPayload {
  sub: string; // user id
  email: string;
  role: string;
  name?: string;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: [ALG] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** Set the session cookie (call from a Route Handler / Server Action). */
export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Read & verify the current session from cookies. Returns null if unauthenticated. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

/** Throws a 401-style error if not authenticated. Use in API route handlers. */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new AuthError("Unauthorized");
  }
  return session;
}

export class AuthError extends Error {}
