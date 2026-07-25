import { prisma } from "@/lib/db";
import { collection } from "@/lib/crud";
import { careerRoleSchema } from "@/lib/schemas";

export const { GET, POST } = collection(prisma.careerRole, careerRoleSchema);
