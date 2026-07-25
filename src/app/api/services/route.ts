import { prisma } from "@/lib/db";
import { collection } from "@/lib/crud";
import { serviceSchema } from "@/lib/schemas";

export const { GET, POST } = collection(prisma.service, serviceSchema);
