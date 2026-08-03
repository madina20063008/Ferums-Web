import type { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { PRODUCTS, PROJECTS, ARTICLES, ROLES, INDUSTRIES, SERVICES, PARTNERS, SITE, SOCIAL } from "./seed-data";

/** Idempotent: fills the database with the admin user + all starting content. */
export async function seedDatabase(db: PrismaClient = prisma) {
  // ---------------- Admin user ----------------
  const email = process.env.ADMIN_EMAIL || "ats@ats-systems.net";
  const password = process.env.ADMIN_PASSWORD || "ats-c89475630a";
  const hash = await bcrypt.hash(password, 10);
  await db.user.upsert({
    where: { email },
    update: { password: hash, role: "admin", active: true },
    create: { email, password: hash, name: "FERUMS Admin", role: "admin" },
  });

  // ---------------- Site settings (static bilingual copy) ----------------
  const siteJson = SITE as unknown as Prisma.InputJsonValue;
  await db.setting.upsert({
    where: { key: "site" },
    update: { valueJson: siteJson },
    create: { key: "site", valueJson: siteJson },
  });

  // ---------------- Social media links ----------------
  const socialJson = SOCIAL as unknown as Prisma.InputJsonValue;
  await db.setting.upsert({
    where: { key: "social" },
    update: { valueJson: socialJson },
    create: { key: "social", valueJson: socialJson },
  });

  // ---------------- Products ----------------
  await db.product.deleteMany();
  for (let i = 0; i < PRODUCTS.length; i++) {
    await db.product.create({ data: { ...PRODUCTS[i], order: i } });
  }

  // ---------------- Projects ----------------
  await db.project.deleteMany();
  for (let i = 0; i < PROJECTS.length; i++) {
    await db.project.create({ data: { ...PROJECTS[i], order: i } });
  }

  // ---------------- News / Articles ----------------
  await db.article.deleteMany();
  for (let i = 0; i < ARTICLES.length; i++) {
    await db.article.create({ data: { ...ARTICLES[i], order: i } });
  }

  // ---------------- Career roles ----------------
  await db.careerRole.deleteMany();
  for (let i = 0; i < ROLES.length; i++) {
    await db.careerRole.create({ data: { ...ROLES[i], order: i } });
  }

  // ---------------- Industries ----------------
  await db.industry.deleteMany();
  for (let i = 0; i < INDUSTRIES.length; i++) {
    await db.industry.create({ data: { ...INDUSTRIES[i], order: i } });
  }

  // ---------------- Services ----------------
  await db.service.deleteMany();
  for (let i = 0; i < SERVICES.length; i++) {
    await db.service.create({ data: { ...SERVICES[i], order: i } });
  }

  // ---------------- Partners ----------------
  await db.partner.deleteMany();
  for (let i = 0; i < PARTNERS.length; i++) {
    await db.partner.create({ data: { ...PARTNERS[i], order: i } });
  }
}

/**
 * Idempotent backfill for resources added AFTER a database was first seeded
 * (older production DBs never got Partners, Services, or the social setting,
 * because the full seed only runs on a completely empty DB). Each block runs
 * only when that resource is empty/missing, so it never overwrites admin edits.
 */
export async function backfillMissing(db: PrismaClient = prisma) {
  // Partners
  try {
    if ((await db.partner.count()) === 0) {
      for (let i = 0; i < PARTNERS.length; i++) await db.partner.create({ data: { ...PARTNERS[i], order: i } });
      console.log("✔ backfilled partners");
    }
  } catch (e) { console.error("[backfill] partners:", (e as Error)?.message); }

  // Services
  try {
    if ((await db.service.count()) === 0) {
      for (let i = 0; i < SERVICES.length; i++) await db.service.create({ data: { ...SERVICES[i], order: i } });
      console.log("✔ backfilled services");
    }
  } catch (e) { console.error("[backfill] services:", (e as Error)?.message); }

  // Social media setting
  try {
    const existing = await db.setting.findUnique({ where: { key: "social" } });
    if (!existing) {
      await db.setting.create({ data: { key: "social", valueJson: SOCIAL as unknown as Prisma.InputJsonValue } });
      console.log("✔ backfilled social setting");
    }
  } catch (e) { console.error("[backfill] social:", (e as Error)?.message); }
}

let seedPromise: Promise<void> | null = null;
export async function ensureSeeded() {
  try {
    const count = await prisma.user.count();
    if (count === 0) {
      if (!seedPromise) seedPromise = seedDatabase().then(() => undefined);
      await seedPromise;
    }
    // Always backfill resources that older, already-seeded DBs may lack.
    await backfillMissing();
  } catch (e) {
    seedPromise = null;
    console.error("[ensureSeeded]", e);
  }
}
