import { prisma } from "@/lib/db";
import { ok, fail, handler, parse } from "@/lib/api";
import { loginSchema } from "@/lib/schemas";
import { verifyPassword, signSession, setSessionCookie } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed-core";

export const POST = handler(async (req) => {
  await ensureSeeded();
  const { email, password } = await parse(req, loginSchema);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.active) return fail("Invalid credentials", 401);
  const valid = await verifyPassword(password, user.password);
  if (!valid) return fail("Invalid credentials", 401);

  const token = await signSession({ sub: user.id, email: user.email, role: user.role, name: user.name ?? undefined });
  await setSessionCookie(token);
  return ok({ id: user.id, email: user.email, name: user.name, role: user.role });
});
