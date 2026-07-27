import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, field, type Locale } from "@/lib/i18n";
import { localized } from "@/lib/nav";
import { buildMetadata } from "@/lib/seo";
import { getProducts } from "@/lib/site-data";
import { HeroVideo } from "@/components/site/HeroVideo";

// Faithful port of Products.dc.html. Static hero copy is bilingual below; the
// products list comes from the DB so the admin can manage it.
const T = {
  en: {
    label: "Products",
    title: "Critical equipment, engineered for decades of service.",
    intro:
      "Ten product categories covering rotating equipment, sealing systems and flow control for heavy industry.",
  },
  ru: {
    label: "Продукция",
    title: "Критическое оборудование на десятилетия службы.",
    intro:
      "Десять категорий продукции: вращающееся оборудование, уплотнительные системы и арматура для тяжёлой промышленности.",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const t = T[loc];
  return buildMetadata({ locale: loc, path: "/products", title: t.title, description: t.intro });
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = T[locale];
  const products = await getProducts();

  return (
    <>
      {/* Hero */}
      <section
        className="video-hero hero-onvideo"
        style={{ position: "relative", minHeight: "88vh", display: "flex", alignItems: "center", overflow: "hidden" }}
      >
        <HeroVideo media="products" />
        <div className="container">
          <div className="eyebrow reveal" style={{ marginBottom: 24 }}>{t.label}</div>
          <h1 className="h1 reveal" style={{ maxWidth: 900 }}>{t.title}</h1>
          <p className="reveal" style={{ margin: "32px 0 0", fontSize: 16, lineHeight: 1.65, color: "rgba(255,255,255,.75)", maxWidth: 620 }}>{t.intro}</p>
        </div>
      </section>

      {/* Product grid */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="grid-2">
            {products.map((p) => (
              <Link
                key={p.id}
                href={localized(locale, `/products/${p.slug}`)}
                className="reveal card card-hover stack-sm"
                style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 36, padding: 36, borderRadius: 20, background: "var(--card)", border: "1px solid var(--border)", alignItems: "center" }}
              >
                <span style={{ display: "block", borderRadius: 14, overflow: "hidden", aspectRatio: "1 / 1" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={field(p, "title", locale)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </span>
                <span>
                  <span style={{ display: "block", fontSize: 26, fontWeight: 600, letterSpacing: "-.01em", color: "var(--text)" }}>{field(p, "title", locale)}</span>
                  <span style={{ display: "block", margin: "12px 0 0", fontSize: 15, lineHeight: 1.7, color: "var(--text-dim)" }}>{field(p, "desc", locale)}</span>
                  <span className="mono" style={{ display: "block", marginTop: 16, fontSize: 12, letterSpacing: ".14em", color: "var(--text-faint)" }}>{field(p, "spec", locale) || field(p, "category", locale)}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
