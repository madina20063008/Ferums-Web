import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, pick, field, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getSite, getServices } from "@/lib/site-data";
import { PageHeader } from "@/components/site/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const site = await getSite();
  const s = site.sectionIntros.services;
  return buildMetadata({
    locale: loc,
    path: "/services",
    title: pick(s.title, loc),
    description: pick(s.subtitle, loc),
  });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [site, services] = await Promise.all([getSite(), getServices()]);
  const s = site.sectionIntros.services;

  return (
    <>
      <PageHeader title={pick(s.title, locale)} lead={pick(s.subtitle, locale)} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
            {services.map((sv) => {
              const items = (sv.items as unknown as { en: string; ru: string }[]) || [];
              return (
                <div key={sv.id} className="card card-hover reveal" style={{ padding: "26px 24px" }}>
                  <div className="mono" style={{ color: "var(--accent)", fontSize: 13 }}>{sv.numberTag}</div>
                  <h3 style={{ margin: "12px 0 8px", fontSize: 20, fontWeight: 600 }}>{field(sv, "title", locale)}</h3>
                  <p style={{ margin: 0, color: "var(--text-dim)", fontSize: 14, lineHeight: 1.6 }}>{field(sv, "desc", locale)}</p>
                  {items.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
                      {items.map((item, i) => <span key={i} className="chip">{pick(item, locale)}</span>)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
