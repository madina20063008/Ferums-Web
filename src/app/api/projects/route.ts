import { prisma } from "@/lib/db";
import { collection } from "@/lib/crud";
import { projectSchema } from "@/lib/schemas";

export const { GET, POST } = collection(prisma.project, projectSchema);
