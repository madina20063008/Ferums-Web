import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, pick, field, ui, type Locale } from "@/lib/i18n";
import { localized } from "@/lib/nav";
import { buildMetadata } from "@/lib/seo";
import { absUrl } from "@/lib/site";
import { getProduct, getProducts, getSite } from "@/lib/site-data";
import { JsonLd } from "@/components/site/JsonLd";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const p = await getProduct(slug);
  if (!p) return {};
  const title = field(p, "metaTitle", loc) || field(p, "title", loc);
  const desc = field(p, "metaDesc", loc) || field(p, "desc", loc);
  return buildMetadata({ locale: loc, path: `/products/${slug}`, title, description: desc, image: p.image, type: "website" });
}

type Bi = { en: string; ru: string };
type Spec = { kEn: string; kRu: string; vEn: string; vRu: string };
type Feat = { titleEn: string; titleRu: string; descEn: string; descRu: string };

export default async function ProductDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const [p, all, site] = await Promise.all([getProduct(slug), getProducts(), getSite()]);
  if (!p) notFound();
  const t = ui(locale);

  const chips = (p.chips as unknown as Bi[]) || [];
  const specs = (p.specs as unknown as Spec[]) || [];
  const features = (p.features as unknown as Feat[]) || [];
  const related = all.filter((x) => x.id !== p.id).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: field(p, "title", locale),
    description: field(p, "desc", locale),
    ...(p.image ? { image: p.image } : {}),
    category: field(p, "category", locale) || undefined,
    brand: { "@type": "Brand", name: site.seo.siteName },
    url: absUrl(localized(locale, `/products/${slug}`)),
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Product hero */}
      <section className="section" style={{ paddingBottom: 80 }}>
        <div className="container">
          {/* Breadcrumb */}
          <div className="reveal mono" style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 40 }}>
            <Link href={localized(locale, "/products")} style={{ color: "var(--text-faint)" }}>{t.allProducts}</Link>
            <span style={{ color: "var(--text-faint)" }}>/</span>
            <span style={{ color: "var(--green)" }}>{field(p, "category", locale) || field(p, "title", locale)}</span>
          </div>

          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "minmax(280px,1.1fr) minmax(0,1fr)", gap: 80, alignItems: "center" }}>
            {/* Image */}
            <div className="reveal" style={{ borderRadius: 24, overflow: "hidden", aspectRatio: "4 / 3", background: "var(--surface-alt)", border: "1px solid var(--border)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={field(p, "title", locale)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            {/* Copy */}
            <div>
              {field(p, "category", locale) && (
                <div className="reveal mono" style={{ fontSize: 13, letterSpacing: ".28em", textTransform: "uppercase", color: "var(--green)", marginBottom: 20 }}>{field(p, "category", locale)}</div>
              )}
              <h1 className="reveal h1" style={{ margin: 0, fontSize: "clamp(40px,3.8vw,56px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.06 }}>{field(p, "title", locale)}</h1>
              <p className="reveal" style={{ margin: "24px 0 0", fontSize: 15, lineHeight: 1.7, color: "var(--text-dim)" }}>{field(p, "desc", locale)}</p>
              {chips.length > 0 && (
                <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 }}>
                  {chips.map((c, i) => <span key={i} className="chip">{pick(c, locale)}</span>)}
                </div>
              )}
              <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 40 }}>
                <Link href={localized(locale, "/contact")} className="btn btn-primary">{t.getInTouch}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      {specs.length > 0 && (
        <section className="section section-alt">
          <div className="container two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80, alignItems: "start" }}>
            <h2 className="h2 reveal">{t.specifications}</h2>
            <div className="reveal" style={{ display: "flex", flexDirection: "column" }}>
              {specs.map((s, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, padding: "20px 0", borderTop: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 15, color: "var(--text-dim)" }}>{pick({ en: s.kEn, ru: s.kRu }, locale)}</span>
                  <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{pick({ en: s.vEn, ru: s.vRu }, locale)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Key features */}
      {features.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="h2 reveal" style={{ marginBottom: 56 }}>{t.keyFeatures}</h2>
            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
              {features.map((f, i) => (
                <div key={i} className="card reveal" style={{ padding: 36, borderRadius: 20 }}>
                  <span style={{ display: "block", width: 34, height: 34, border: "1.5px solid var(--green)", borderRadius: 9, marginBottom: 22, position: "relative" }}>
                    <span style={{ position: "absolute", inset: 9, border: "1.5px solid rgba(127,127,127,.4)", borderRadius: 4 }} />
                  </span>
                  <h3 style={{ margin: 0, fontSize: 21, fontWeight: 600, color: "var(--text)" }}>{pick({ en: f.titleEn, ru: f.titleRu }, locale)}</h3>
                  <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.7, color: "var(--text-dim)" }}>{pick({ en: f.descEn, ru: f.descRu }, locale)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56, gap: 24 }}>
              <h2 className="h2 reveal">{t.relatedProducts}</h2>
              <Link href={localized(locale, "/products")} className="reveal" style={{ flexShrink: 0, fontSize: 16, fontWeight: 600, color: "var(--green)" }}>{t.allProducts} →</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 32 }}>
              {related.map((r) => (
                <Link key={r.id} href={localized(locale, `/products/${r.slug}`)} className="card card-hover reveal" style={{ display: "block", overflow: "hidden", borderRadius: 20 }}>
                  <span style={{ display: "block", aspectRatio: "16 / 10", overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.image} alt={field(r, "title", locale)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </span>
                  <span style={{ display: "block", padding: "24px 28px 28px" }}>
                    <span style={{ display: "block", fontSize: 20, fontWeight: 600, color: "var(--text)" }}>{field(r, "title", locale)}</span>
                    <span className="mono" style={{ display: "block", marginTop: 8, fontSize: 12, letterSpacing: ".14em", color: "var(--text-faint)" }}>{field(r, "spec", locale) || field(r, "category", locale)}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
