import { PrismaClient } from "@prisma/client";
import { seedDatabase } from "../src/lib/seed-core";

const prisma = new PrismaClient();

async function main() {
  await seedDatabase(prisma);
  console.log("✔ database seeded");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
