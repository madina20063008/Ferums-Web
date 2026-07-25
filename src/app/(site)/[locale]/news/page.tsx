import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, pick, field, type Locale } from "@/lib/i18n";
import { localized } from "@/lib/nav";
import { buildMetadata } from "@/lib/seo";
import { getSite, getArticles } from "@/lib/site-data";
import { PageHeader, Media } from "@/components/site/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const site = await getSite();
  const s = site.sectionIntros.news;
  return buildMetadata({
    locale: loc,
    path: "/news",
    title: pick(s.title, loc),
    description: pick(s.subtitle, loc),
  });
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [site, articles] = await Promise.all([getSite(), getArticles()]);
  const s = site.sectionIntros.news;

  return (
    <>
      <PageHeader title={pick(s.title, locale)} lead={pick(s.subtitle, locale)} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
            {articles.map((a) => (
              <Link key={a.id} href={localized(locale, `/news/${a.slug}`)} className="card card-hover reveal" style={{ overflow: "hidden" }}>
                <Media src={a.image} alt={field(a, "title", locale)} ratio="16 / 9" radius={0} />
                <div style={{ padding: "18px 20px" }}>
                  <div className="mono" style={{ fontSize: 12, color: "var(--text-faint)" }}>{field(a, "tag", locale)} · {field(a, "date", locale)}</div>
                  <h3 style={{ margin: "10px 0 8px", fontSize: 17, fontWeight: 600, lineHeight: 1.3 }}>{field(a, "title", locale)}</h3>
                  <p style={{ margin: 0, color: "var(--text-dim)", fontSize: 14, lineHeight: 1.6 }}>{field(a, "excerpt", locale)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
