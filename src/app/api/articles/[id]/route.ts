import { prisma } from "@/lib/db";
import { item } from "@/lib/crud";
import { articleSchema } from "@/lib/schemas";

export const { GET, PUT, DELETE } = item(prisma.article, articleSchema);
