import { prisma } from "@/lib/db";
import { item } from "@/lib/crud";
import { projectSchema } from "@/lib/schemas";

export const { GET, PUT, DELETE } = item(prisma.project, projectSchema);
