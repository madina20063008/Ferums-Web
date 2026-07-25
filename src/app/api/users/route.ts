import { prisma } from "@/lib/db";
import { ok, auth, handler, parse } from "@/lib/api";
import { userSchema } from "@/lib/schemas";
import { hashPassword } from "@/lib/auth";

const safeSelect = { id: true, email: true, name: true, role: true, active: true, createdAt: true };

export const GET = handler(async () => {
  await auth();
  const users = await prisma.user.findMany({ select: safeSelect, orderBy: { createdAt: "asc" } });
  return ok(users);
});

export const POST = handler(async (req) => {
  await auth();
  const data = await parse(req, userSchema);
  const created = await prisma.user.create({
    data: { ...data, password: await hashPassword(data.password) },
    select: safeSelect,
  });
  return ok(created, 201);
});
