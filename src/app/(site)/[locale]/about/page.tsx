import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, pick, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getSite } from "@/lib/site-data";
import { PageHeader, SectionTitle, Media } from "@/components/site/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const site = await getSite();
  return buildMetadata({
    locale: loc,
    path: "/about",
    title: pick(site.about.title, loc),
    description: pick(site.about.lead, loc),
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const site = await getSite();
  const a = site.about;

  return (
    <>
      <PageHeader title={pick(a.title, locale)} lead={pick(a.lead, locale)} video="about" />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="lead reveal" style={{ maxWidth: 820 }}>{pick(a.body, locale)}</p>
        </div>
      </section>

      {a.values.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
              {a.values.map((v, i) => (
                <div key={i} className="card reveal" style={{ padding: "26px 24px" }}>
                  <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 600 }}>{pick(v.title, locale)}</h3>
                  <p style={{ margin: 0, color: "var(--text-dim)", fontSize: 14, lineHeight: 1.6 }}>{pick(v.desc, locale)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {a.team.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <SectionTitle title={pick({ en: "Team", ru: "Команда" }, locale)} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
              {a.team.map((m, i) => (
                <div key={i} className="card reveal" style={{ overflow: "hidden" }}>
                  <Media src={m.image} alt={m.name} ratio="1 / 1" radius={0} />
                  <div style={{ padding: "18px 20px" }}>
                    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{m.name}</h3>
                    <div style={{ marginTop: 6, fontSize: 14, color: "var(--text-dim)" }}>{pick(m.role, locale)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {a.timeline.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {a.timeline.map((tl, i) => (
                <div key={i} className="reveal" style={{ display: "flex", gap: 24, padding: "18px 0", borderBottom: i < a.timeline.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div className="mono" style={{ color: "var(--accent)", fontSize: 14, minWidth: 72 }}>{tl.year}</div>
                  <div style={{ fontSize: 15, color: "var(--text-dim)" }}>{pick(tl.label, locale)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
