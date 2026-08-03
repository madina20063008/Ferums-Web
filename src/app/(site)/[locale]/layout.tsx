import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../globals.css";
import { LOCALES, isLocale, pick, type Locale } from "@/lib/i18n";
import { getSite, getSocial } from "@/lib/site-data";
import { SITE_URL, absUrl } from "@/lib/site";
import { Sidebar, type NavData } from "@/components/site/Sidebar";
import { Footer } from "@/components/site/Footer";
import { ThemeScript } from "@/components/site/ThemeScript";
import { RevealObserver } from "@/components/site/Reveal";
import { JsonLd } from "@/components/site/JsonLd";
import { IntroOverlay } from "@/components/site/IntroOverlay";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

// ISR: regenerate every 60s so admin/DB changes reliably reach the live site
// even on self-hosted `next start` (where fully-static pages would otherwise be
// frozen behind a 1-year cache). On-demand revalidateSite() still updates
// instantly on admin writes; this is the safety net. Cascades to all pages.
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const site = await getSite();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: pick(site.seo.defaultTitle, loc),
      template: `%s — ${site.seo.siteName}`,
    },
    description: pick(site.seo.defaultDescription, loc),
    icons: { icon: "/uploads/f-mark.png" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [site, social] = await Promise.all([getSite(), getSocial()]);

  const nav: NavData = {
    logo: site.seo.organization.logo || "/uploads/1.png",
    siteName: site.seo.siteName,
    main: site.nav.main.map((l) => ({ label: pick(l, locale), href: l.href })),
    company: site.nav.company.map((l) => ({ label: pick(l, locale), href: l.href })),
    companyLabel: pick(site.nav.companyLabel, locale),
    contactCta: pick(site.nav.contactCta, locale),
  };

  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.seo.organization.name,
    legalName: site.seo.organization.legalName,
    url: SITE_URL,
    logo: absUrl(site.seo.organization.logo || "/uploads/1.png"),
    description: pick(site.seo.defaultDescription, locale),
    ...(site.seo.organization.sameAs.length ? { sameAs: site.seo.organization.sameAs } : {}),
  };

  return (
    <html lang={locale} data-theme="dark">
      <head>
        <ThemeScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <IntroOverlay />
        <JsonLd data={org} />
        <div className="site-scope site-shell">
          <Sidebar locale={locale} nav={nav} />
          <div className="site-main">
            <main>{children}</main>
            <Footer locale={locale} site={site} social={social} />
          </div>
        </div>
        <RevealObserver />
      </body>
    </html>
  );
}
