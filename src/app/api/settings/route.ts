import { prisma } from "@/lib/db";
import { ok, auth, handler, parse } from "@/lib/api";
import { settingSchema } from "@/lib/schemas";

// GET /api/settings            -> all settings
// GET /api/settings?key=site   -> single setting's valueJson (public; site reads this)
export const GET = handler(async (req) => {
  const key = new URL(req.url).searchParams.get("key");
  if (key) {
    const row = await prisma.setting.findUnique({ where: { key } });
    return ok(row?.valueJson ?? null);
  }
  const all = await prisma.setting.findMany({ orderBy: { key: "asc" } });
  return ok(all);
});

// PUT /api/settings { key, valueJson } -> upsert (auth)
export const PUT = handler(async (req) => {
  await auth();
  const { key, valueJson } = await parse(req, settingSchema);
  const row = await prisma.setting.upsert({
    where: { key },
    update: { valueJson },
    create: { key, valueJson },
  });
  return ok(row);
});
