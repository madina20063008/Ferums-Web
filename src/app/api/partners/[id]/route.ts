import { prisma } from "@/lib/db";
import { item } from "@/lib/crud";
import { partnerSchema } from "@/lib/schemas";

export const { GET, PUT, DELETE } = item(prisma.partner, partnerSchema);
