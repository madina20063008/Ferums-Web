import { prisma } from "@/lib/db";
import { ok, auth, handler, parse } from "@/lib/api";
import { contactSubmissionSchema } from "@/lib/schemas";

// GET is admin-only (submissions are private). POST is public (contact form).
export const GET = handler(async () => {
  await auth();
  const items = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });
  return ok(items);
});

export const POST = handler(async (req) => {
  const data = await parse(req, contactSubmissionSchema);
  const created = await prisma.contactSubmission.create({ data });
  return ok(created, 201);
});
