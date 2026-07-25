import type { Metadata } from "next";
import { absUrl, SITE_URL } from "./site";
import type { Locale } from "./i18n";

interface SeoInput {
  locale: Locale;
  /** locale-relative path, e.g. "/products" or "" for home. No locale prefix. */
  path: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  siteName?: string;
  /** override the full <title>; by default we append " — {siteName}". */
  absoluteTitle?: boolean;
  noindex?: boolean;
}

// Build Next.js Metadata with canonical + hreflang alternates + Open Graph.
// hreflang is essential for a bilingual site: each locale is its own indexable
// URL and every page advertises its en / ru / x-default counterparts.
export function buildMetadata(input: SeoInput): Metadata {
  const { locale, path, title, description, image, type = "website", siteName = "FERUMS", absoluteTitle, noindex } = input;
  const fullTitle = absoluteTitle ? title : `${title} — ${siteName}`;
  const canonical = absUrl(`/${locale}${path}`);
  const ogImage = image ? (image.startsWith("http") ? image : absUrl(image)) : absUrl("/og.png");

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages: {
        en: absUrl(`/en${path}`),
        ru: absUrl(`/ru${path}`),
        "x-default": absUrl(`/en${path}`),
      },
    },
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: canonical,
      siteName,
      locale: locale === "ru" ? "ru_RU" : "en_US",
      alternateLocale: locale === "ru" ? "en_US" : "ru_RU",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
