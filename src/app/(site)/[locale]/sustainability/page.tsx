import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, pick, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getSite } from "@/lib/site-data";
import { PageHeader, SectionTitle } from "@/components/site/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const site = await getSite();
  return buildMetadata({
    locale: loc,
    path: "/sustainability",
    title: pick(site.sustainability.title, loc),
    description: pick(site.sustainability.lead, loc),
  });
}

export default async function SustainabilityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const site = await getSite();
  const su = site.sustainability;

  return (
    <>
      <PageHeader title={pick(su.title, locale)} lead={pick(su.lead, locale)} />

      {su.pillars.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
              {su.pillars.map((p, i) => (
                <div key={i} className="card reveal" style={{ padding: "26px 24px" }}>
                  <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 600 }}>{pick(p.title, locale)}</h3>
                  <p style={{ margin: 0, color: "var(--text-dim)", fontSize: 14, lineHeight: 1.6 }}>{pick(p.desc, locale)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {su.commitments.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <SectionTitle title={pick({ en: "Commitments", ru: "Обязательства" }, locale)} />
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {su.commitments.map((c, i) => (
                <li key={i} className="reveal" style={{ display: "flex", gap: 12, alignItems: "flex-start", color: "var(--text-dim)", fontSize: 15 }}>
                  <span style={{ color: "var(--accent)" }}>—</span>{pick(c, locale)}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
