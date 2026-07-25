import { prisma } from "@/lib/db";
import { collection } from "@/lib/crud";
import { industrySchema } from "@/lib/schemas";

export const { GET, POST } = collection(prisma.industry, industrySchema);
