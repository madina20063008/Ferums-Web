import { prisma } from "./db";
import type { SiteContent } from "./site-content";
import { SITE as SITE_FALLBACK } from "./seed-data";

// ---- Static site copy (the `site` Setting) ----
export async function getSite(): Promise<SiteContent> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: "site" } });
    if (row?.valueJson) return row.valueJson as unknown as SiteContent;
  } catch {
    // DB not ready — fall back to bundled content so pages still render.
  }
  return SITE_FALLBACK;
}

const pubOrder = { where: { published: true }, orderBy: [{ order: "asc" as const }, { id: "asc" as const }] };

export async function getProducts() {
  return prisma.product.findMany(pubOrder);
}
export async function getProduct(slug: string) {
  return prisma.product.findFirst({ where: { slug, published: true } });
}
export async function getProjects() {
  return prisma.project.findMany(pubOrder);
}
export async function getProject(slug: string) {
  return prisma.project.findFirst({ where: { slug, published: true } });
}
export async function getArticles() {
  return prisma.article.findMany(pubOrder);
}
export async function getArticle(slug: string) {
  return prisma.article.findFirst({ where: { slug, published: true } });
}
export async function getRoles() {
  return prisma.careerRole.findMany(pubOrder);
}
export async function getIndustries() {
  return prisma.industry.findMany(pubOrder);
}
export async function getServices() {
  return prisma.service.findMany(pubOrder);
}

export type Product = Awaited<ReturnType<typeof getProducts>>[number];
export type Project = Awaited<ReturnType<typeof getProjects>>[number];
export type Article = Awaited<ReturnType<typeof getArticles>>[number];
export type Role = Awaited<ReturnType<typeof getRoles>>[number];
export type Industry = Awaited<ReturnType<typeof getIndustries>>[number];
export type Service = Awaited<ReturnType<typeof getServices>>[number];
