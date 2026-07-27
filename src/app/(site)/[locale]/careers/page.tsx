import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, pick, field, ui, type Locale } from "@/lib/i18n";
import { localized } from "@/lib/nav";
import { buildMetadata } from "@/lib/seo";
import { getSite, getRoles } from "@/lib/site-data";
import { PageHeader, SectionTitle } from "@/components/site/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const site = await getSite();
  return buildMetadata({
    locale: loc,
    path: "/careers",
    title: pick(site.sectionIntros.careers.title, loc),
    description: pick(site.careers.intro, loc),
  });
}

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [site, roles] = await Promise.all([getSite(), getRoles()]);
  const t = ui(locale);
  const c = site.careers;

  return (
    <>
      <PageHeader title={pick(site.sectionIntros.careers.title, locale)} lead={pick(c.intro, locale)} video="careers" />

      {c.benefits.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
              {c.benefits.map((b, i) => (
                <div key={i} className="card reveal" style={{ padding: "26px 24px" }}>
                  <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 600 }}>{pick(b.title, locale)}</h3>
                  <p style={{ margin: 0, color: "var(--text-dim)", fontSize: 14, lineHeight: 1.6 }}>{pick(b.desc, locale)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionTitle title={t.openRoles} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 18 }}>
            {roles.map((r) => (
              <div key={r.id} className="card card-hover reveal" style={{ padding: "26px 24px", display: "flex", flexDirection: "column" }}>
                <h3 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 600 }}>{field(r, "title", locale)}</h3>
                <div className="mono" style={{ fontSize: 12, color: "var(--accent)" }}>
                  {field(r, "dept", locale)} · {field(r, "location", locale)} · {field(r, "type", locale)}
                </div>
                {field(r, "desc", locale) && (
                  <p style={{ margin: "14px 0 0", color: "var(--text-dim)", fontSize: 14, lineHeight: 1.6 }}>{field(r, "desc", locale)}</p>
                )}
                <div style={{ marginTop: 22 }}>
                  <Link href={localized(locale, "/contact")} className="btn btn-primary">{t.apply}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
