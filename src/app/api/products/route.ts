import { prisma } from "@/lib/db";
import { collection } from "@/lib/crud";
import { productSchema } from "@/lib/schemas";

export const { GET, POST } = collection(prisma.product, productSchema);
