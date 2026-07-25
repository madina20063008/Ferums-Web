import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, field, ui, type Locale } from "@/lib/i18n";
import { localized } from "@/lib/nav";
import { buildMetadata } from "@/lib/seo";
import { absUrl } from "@/lib/site";
import { getArticle, getArticles, getSite } from "@/lib/site-data";
import { Media } from "@/components/site/ui";
import { JsonLd } from "@/components/site/JsonLd";

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const a = await getArticle(slug);
  if (!a) return {};
  const title = field(a, "metaTitle", loc) || field(a, "title", loc);
  const desc = field(a, "metaDesc", loc) || field(a, "excerpt", loc);
  return buildMetadata({ locale: loc, path: `/news/${slug}`, title, description: desc, image: a.image, type: "article" });
}

export default async function ArticleDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const [a, all, site] = await Promise.all([getArticle(slug), getArticles(), getSite()]);
  if (!a) notFound();
  const t = ui(locale);
  const body = field(a, "body", locale) || field(a, "excerpt", locale);
  const more = all.filter((x) => x.id !== a.id).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: field(a, "title", locale),
    description: field(a, "excerpt", locale),
    ...(a.image ? { image: [a.image] } : {}),
    datePublished: a.publishedAt.toISOString(),
    dateModified: a.updatedAt.toISOString(),
    author: { "@type": "Organization", name: site.seo.siteName },
    publisher: {
      "@type": "Organization",
      name: site.seo.siteName,
      logo: { "@type": "ImageObject", url: absUrl(site.seo.organization.logo || "/uploads/1.png") },
    },
    mainEntityOfPage: absUrl(localized(locale, `/news/${slug}`)),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <article className="section" style={{ paddingBottom: 40 }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <Link href={localized(locale, "/news")} className="mono" style={{ color: "var(--text-dim)", fontSize: 13 }}>← {t.allNews}</Link>
          <div className="mono reveal" style={{ color: "var(--accent)", fontSize: 13, marginTop: 24 }}>{field(a, "tag", locale)} · {field(a, "date", locale)}</div>
          <h1 className="h1 reveal" style={{ fontSize: "clamp(32px,3.4vw,52px)", marginTop: 14 }}>{field(a, "title", locale)}</h1>
          <div className="reveal" style={{ marginTop: 28 }}>
            <Media src={a.image} alt={field(a, "title", locale)} ratio="16 / 9" />
          </div>
          <div className="reveal" style={{ marginTop: 30, fontSize: 17, lineHeight: 1.75, color: "var(--text-dim)", whiteSpace: "pre-line" }}>
            {body}
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 className="h2 reveal" style={{ marginBottom: 24 }}>{t.allNews}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 18 }}>
              {more.map((r) => (
                <Link key={r.id} href={localized(locale, `/news/${r.slug}`)} className="card card-hover reveal" style={{ overflow: "hidden" }}>
                  <Media src={r.image} alt={field(r, "title", locale)} ratio="16 / 9" radius={0} />
                  <div style={{ padding: "18px 20px" }}>
                    <div className="mono" style={{ fontSize: 12, color: "var(--text-faint)" }}>{field(r, "date", locale)}</div>
                    <h3 style={{ margin: "8px 0 0", fontSize: 16, fontWeight: 600, lineHeight: 1.3 }}>{field(r, "title", locale)}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
