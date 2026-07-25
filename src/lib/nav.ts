import type { Locale } from "./i18n";

// Prefix a locale-relative path (e.g. "/products") with the active locale.
export function localized(locale: Locale, path: string): string {
  if (!path || path === "/") return `/${locale}`;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}
