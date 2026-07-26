import { prisma } from "@/lib/db";
import { collection } from "@/lib/crud";
import { partnerSchema } from "@/lib/schemas";

export const { GET, POST } = collection(prisma.partner, partnerSchema);
