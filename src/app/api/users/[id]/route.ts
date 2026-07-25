import { prisma } from "@/lib/db";
import { ok, fail, auth, handler, parse } from "@/lib/api";
import { userSchema } from "@/lib/schemas";
import { hashPassword } from "@/lib/auth";

const safeSelect = { id: true, email: true, name: true, role: true, active: true, createdAt: true };

export const GET = handler(async (_req, ctx) => {
  await auth();
  const { id } = await ctx.params;
  const user = await prisma.user.findUnique({ where: { id }, select: safeSelect });
  if (!user) return fail("Not found", 404);
  return ok(user);
});

export const PUT = handler(async (req, ctx) => {
  await auth();
  const { id } = await ctx.params;
  const data = await parse(req, userSchema.partial());
  const patch: Record<string, unknown> = { ...data };
  if (data.password) patch.password = await hashPassword(data.password);
  else delete patch.password;
  const updated = await prisma.user.update({ where: { id }, data: patch, select: safeSelect });
  return ok(updated);
});

export const DELETE = handler(async (_req, ctx) => {
  await auth();
  const { id } = await ctx.params;
  await prisma.user.delete({ where: { id } });
  return ok({ success: true });
});
