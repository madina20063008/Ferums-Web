import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "ferums_session";
const LOCALES = ["en", "ru"];
const DEFAULT_LOCALE = "en";

async function isValid(token?: string): Promise<boolean> {
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "ferums-default-secret-ee6c1f-change-in-prod-9b2e7a4c1d");
    await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

function preferredLocale(req: NextRequest): string {
  const header = req.headers.get("accept-language") || "";
  const first = header.split(",")[0]?.trim().slice(0, 2).toLowerCase();
  return LOCALES.includes(first) ? first : DEFAULT_LOCALE;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ---- Admin auth gate ----
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const valid = await isValid(token);
    const isLogin = pathname === "/admin/login";
    if (!valid && !isLogin) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    if (valid && isLogin) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ---- Locale enforcement for the public site ----
  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (!hasLocale) {
    const url = req.nextUrl.clone();
    const loc = preferredLocale(req);
    url.pathname = `/${loc}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals, API routes, and static/SEO files.
  matcher: ["/((?!_next/|api/|.*\\..*|sitemap.xml|robots.txt).*)"],
};
