import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, pick, field, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getSite, getIndustries } from "@/lib/site-data";
import { PageHeader, Media } from "@/components/site/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const site = await getSite();
  const s = site.sectionIntros.industries;
  return buildMetadata({
    locale: loc,
    path: "/industries",
    title: pick(s.title, loc),
    description: pick(s.subtitle, loc),
  });
}

export default async function IndustriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [site, industries] = await Promise.all([getSite(), getIndustries()]);
  const s = site.sectionIntros.industries;

  return (
    <>
      <PageHeader title={pick(s.title, locale)} lead={pick(s.subtitle, locale)} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
            {industries.map((it) => {
              const tags = (it.tags as unknown as { en: string; ru: string }[]) || [];
              return (
                <div key={it.id} className="card card-hover reveal" style={{ overflow: "hidden" }}>
                  <Media src={it.image} alt={field(it, "title", locale)} ratio="16 / 10" radius={0} />
                  <div style={{ padding: "22px 22px" }}>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{field(it, "title", locale)}</h3>
                    <p style={{ margin: "12px 0 0", color: "var(--text-dim)", fontSize: 14, lineHeight: 1.6 }}>{field(it, "desc", locale)}</p>
                    {tags.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
                        {tags.map((tag, i) => <span key={i} className="chip">{pick(tag, locale)}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
