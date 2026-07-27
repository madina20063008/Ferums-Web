import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, field, type Locale } from "@/lib/i18n";
import { localized } from "@/lib/nav";
import { buildMetadata } from "@/lib/seo";
import { getArticles } from "@/lib/site-data";

// Faithful port of News.dc.html. Static hero copy is bilingual below; the
// news list comes from the DB so the admin can manage it.
const T = {
  en: {
    label: "News",
    title: "Latest from FERUMS.",
  },
  ru: {
    label: "Новости",
    title: "Новости FERUMS.",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const t = T[loc];
  return buildMetadata({ locale: loc, path: "/news", title: t.title, description: t.title });
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = T[locale];
  const articles = await getArticles();

  return (
    <>
      {/* Hero */}
      <header className="section">
        <div className="container">
          <div className="eyebrow reveal">{t.label}</div>
          <h1 className="h1 reveal">{t.title}</h1>
        </div>
      </header>

      {/* Articles */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 40 }}>
            {articles.map((a) => (
              <Link key={a.id} href={localized(locale, `/news/${a.slug}`)} className="reveal" style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ display: "block", borderRadius: 20, overflow: "hidden", aspectRatio: "3 / 2", marginBottom: 24 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </span>
                <span className="mono" style={{ fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--green)" }}>{field(a, "tag", locale)} · {field(a, "date", locale)}</span>
                <h2 style={{ margin: "12px 0 0", fontSize: 22, fontWeight: 600, lineHeight: 1.3, letterSpacing: "-.01em", color: "var(--text)" }}>{field(a, "title", locale)}</h2>
                <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.65, color: "var(--text-dim)" }}>{field(a, "excerpt", locale)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
