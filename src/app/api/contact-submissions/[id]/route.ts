import { prisma } from "@/lib/db";
import { item } from "@/lib/crud";
import { contactSubmissionSchema } from "@/lib/schemas";

export const { GET, PUT, DELETE } = item(prisma.contactSubmission, contactSubmissionSchema);
