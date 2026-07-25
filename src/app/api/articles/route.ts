import { prisma } from "@/lib/db";
import { collection } from "@/lib/crud";
import { articleSchema } from "@/lib/schemas";

export const { GET, POST } = collection(prisma.article, articleSchema);
