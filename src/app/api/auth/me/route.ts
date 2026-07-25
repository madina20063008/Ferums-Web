import { ok, fail, handler } from "@/lib/api";
import { getSession } from "@/lib/auth";

export const GET = handler(async () => {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);
  return ok({ id: session.sub, email: session.email, name: session.name, role: session.role });
});
