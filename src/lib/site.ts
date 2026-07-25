// Canonical site origin used for absolute URLs in metadata, sitemap, JSON-LD,
// Open Graph and hreflang. Override with NEXT_PUBLIC_SITE_URL in production.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://ferums.com").replace(/\/$/, "");

export function absUrl(path = "/"): string {
  return SITE_URL + (path.startsWith("/") ? path : "/" + path);
}
