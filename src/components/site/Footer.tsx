import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { pick } from "@/lib/i18n";
import { localized } from "@/lib/nav";
import type { SiteContent, Social } from "@/lib/site-content";
import { SocialIcon, SOCIAL_PLATFORM_LABEL } from "@/components/site/SocialIcons";

export function Footer({ locale, site, social }: { locale: Locale; site: SiteContent; social?: Social }) {
  const f = site.footer;
  const col = (title: string, links: SiteContent["footer"]["productLinks"]) => (
    <div>
      <div className="eyebrow" style={{ marginBottom: 16 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {links.map((l, i) => (
          <Link key={i} href={localized(locale, l.href)} style={{ color: "var(--text-dim)", fontSize: 14 }}>
            {pick(l, locale)}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <footer className="site-footer" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container" style={{ padding: "64px 40px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 40 }} className="footer-grid">
          <div>
            <div style={{ fontFamily: "'Geist',sans-serif", fontWeight: 700, fontSize: 22, letterSpacing: "-0.02em" }}>
              {site.seo.siteName}
            </div>
            <p style={{ marginTop: 14, maxWidth: 320, color: "var(--text-dim)", fontSize: 14, lineHeight: 1.6 }}>
              {pick(f.blurb, locale)}
            </p>
          </div>
          {col(site.nav.main[0] ? pick({ en: "Products", ru: "Продукция" }, locale) : "", f.productLinks)}
          {col(pick({ en: "Industries", ru: "Отрасли" }, locale), f.industryLinks)}
          {col(pick(site.nav.companyLabel, locale), f.companyLinks)}
        </div>
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span className="mono" style={{ fontSize: 12, color: "var(--text-faint)" }}>{pick(f.copyright, locale)}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Link href={localized(locale, "/contact")} className="mono" style={{ fontSize: 12, color: "var(--text-faint)" }}>
              {pick(site.nav.contactCta, locale)}
            </Link>
            {social && social.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {social.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={SOCIAL_PLATFORM_LABEL[s.platform] || s.platform}
                    title={SOCIAL_PLATFORM_LABEL[s.platform] || s.platform}
                    className="social-ico"
                  >
                    <SocialIcon platform={s.platform} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
