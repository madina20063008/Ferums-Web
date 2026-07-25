import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";
import { getSession, AuthError, type SessionPayload } from "./auth";

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(message: string, status = 400, extra?: unknown) {
  return NextResponse.json({ error: message, ...(extra ? { details: extra } : {}) }, { status });
}

/** Ensure the caller is authenticated; returns the session or throws AuthError. */
export async function auth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new AuthError("Unauthorized");
  return session;
}

/** Wrap a handler so thrown AuthError/ZodError/etc. become proper JSON responses. */
export function handler(
  fn: (req: Request, ctx: { params: Promise<Record<string, string>> }) => Promise<NextResponse>,
) {
  return async (req: Request, ctx: { params: Promise<Record<string, string>> }) => {
    try {
      return await fn(req, ctx ?? { params: Promise.resolve({}) });
    } catch (e) {
      if (e instanceof AuthError) return fail("Unauthorized", 401);
      if (e instanceof ZodError) return fail("Validation failed", 422, e.flatten());
      console.error("[api]", e);
      return fail("Internal server error", 500);
    }
  };
}

export async function parse<T>(req: Request, schema: ZodType<T>): Promise<T> {
  const body = await req.json().catch(() => ({}));
  return schema.parse(body);
}
