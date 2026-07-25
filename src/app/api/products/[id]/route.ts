import { prisma } from "@/lib/db";
import { item } from "@/lib/crud";
import { productSchema } from "@/lib/schemas";

export const { GET, PUT, DELETE } = item(prisma.product, productSchema);
