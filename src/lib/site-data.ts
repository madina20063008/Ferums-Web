import type { Product, Project, Article, CareerRole, Industry, Service } from "@prisma/client";
import { prisma } from "./db";
import type { SiteContent } from "./site-content";
import { SITE as SITE_FALLBACK, PRODUCTS, PROJECTS, ARTICLES, ROLES, INDUSTRIES, SERVICES } from "./seed-data";

// The public site is DB-optional: every read tries the database first, and
// falls back to the bundled design content when the DB is empty, unmigrated or
// unreachable. This keeps `next build` (which prerenders these pages) working
// before a production database exists — the DB/admin simply overrides the
// bundled defaults once it's set up and seeded.

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.error("[site-data] read failed, using bundled content:", (e as Error)?.message);
    return fallback;
  }
}

const BUILD_DATE = new Date("2026-01-01T00:00:00Z");
// Decorate a bundled seed record with the columns the Prisma models add.
function decorate<T extends object>(items: T[]) {
  return items.map((it, i) => ({
    ...it,
    id: i + 1,
    order: i,
    published: true,
    createdAt: BUILD_DATE,
    updatedAt: BUILD_DATE,
    publishedAt: BUILD_DATE,
  }));
}

const FB = {
  products: decorate(PRODUCTS) as unknown as Product[],
  projects: decorate(PROJECTS) as unknown as Project[],
  articles: decorate(ARTICLES) as unknown as Article[],
  roles: decorate(ROLES) as unknown as CareerRole[],
  industries: decorate(INDUSTRIES) as unknown as Industry[],
  services: decorate(SERVICES) as unknown as Service[],
};

const pubOrder = { where: { published: true }, orderBy: [{ order: "asc" as const }, { id: "asc" as const }] };
const nonEmpty = <T>(rows: T[], fb: T[]) => (rows.length ? rows : fb);

// ---- Static site copy (the `site` Setting) ----
export async function getSite(): Promise<SiteContent> {
  const row = await safe(() => prisma.setting.findUnique({ where: { key: "site" } }), null);
  if (row?.valueJson) return row.valueJson as unknown as SiteContent;
  return SITE_FALLBACK;
}

export async function getProducts(): Promise<Product[]> {
  return nonEmpty(await safe(() => prisma.product.findMany(pubOrder), FB.products), FB.products);
}
export async function getProduct(slug: string): Promise<Product | null> {
  const row = await safe(() => prisma.product.findFirst({ where: { slug, published: true } }), null);
  return row ?? FB.products.find((p) => p.slug === slug) ?? null;
}
export async function getProjects(): Promise<Project[]> {
  return nonEmpty(await safe(() => prisma.project.findMany(pubOrder), FB.projects), FB.projects);
}
export async function getProject(slug: string): Promise<Project | null> {
  const row = await safe(() => prisma.project.findFirst({ where: { slug, published: true } }), null);
  return row ?? FB.projects.find((p) => p.slug === slug) ?? null;
}
export async function getArticles(): Promise<Article[]> {
  return nonEmpty(await safe(() => prisma.article.findMany(pubOrder), FB.articles), FB.articles);
}
export async function getArticle(slug: string): Promise<Article | null> {
  const row = await safe(() => prisma.article.findFirst({ where: { slug, published: true } }), null);
  return row ?? FB.articles.find((a) => a.slug === slug) ?? null;
}
export async function getRoles(): Promise<CareerRole[]> {
  return nonEmpty(await safe(() => prisma.careerRole.findMany(pubOrder), FB.roles), FB.roles);
}
export async function getIndustries(): Promise<Industry[]> {
  return nonEmpty(await safe(() => prisma.industry.findMany(pubOrder), FB.industries), FB.industries);
}
export async function getServices(): Promise<Service[]> {
  return nonEmpty(await safe(() => prisma.service.findMany(pubOrder), FB.services), FB.services);
}

export type { Product, Project, Article, CareerRole as Role, Industry, Service };
