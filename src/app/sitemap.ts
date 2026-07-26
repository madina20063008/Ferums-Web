import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getProducts, getProjects, getArticles } from "@/lib/site-data";

const STATIC_PATHS = [
  "", "/industries", "/services", "/products", "/projects",
  "/news", "/careers", "/about", "/sustainability", "/ferums-digital", "/partners", "/contact",
];

function entry(path: string, lastModified?: Date): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}/en${path}`,
    lastModified,
    alternates: {
      languages: {
        en: `${SITE_URL}/en${path}`,
        ru: `${SITE_URL}/ru${path}`,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, projects, articles] = await Promise.all([getProducts(), getProjects(), getArticles()]);

  const entries: MetadataRoute.Sitemap = [
    ...STATIC_PATHS.map((p) => entry(p)),
    ...products.map((p) => entry(`/products/${p.slug}`, p.updatedAt)),
    ...projects.map((p) => entry(`/projects/${p.slug}`, p.updatedAt)),
    ...articles.map((a) => entry(`/news/${a.slug}`, a.updatedAt)),
  ];
  return entries;
}
