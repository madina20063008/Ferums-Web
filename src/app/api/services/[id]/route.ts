import { prisma } from "@/lib/db";
import { item } from "@/lib/crud";
import { serviceSchema } from "@/lib/schemas";

export const { GET, PUT, DELETE } = item(prisma.service, serviceSchema);
