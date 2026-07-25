import { prisma } from "@/lib/db";
import { item } from "@/lib/crud";
import { industrySchema } from "@/lib/schemas";

export const { GET, PUT, DELETE } = item(prisma.industry, industrySchema);
