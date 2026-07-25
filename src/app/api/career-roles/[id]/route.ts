import { prisma } from "@/lib/db";
import { item } from "@/lib/crud";
import { careerRoleSchema } from "@/lib/schemas";

export const { GET, PUT, DELETE } = item(prisma.careerRole, careerRoleSchema);
