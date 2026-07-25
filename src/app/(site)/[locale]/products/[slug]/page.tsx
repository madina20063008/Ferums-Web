import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, pick, field, ui, type Locale } from "@/lib/i18n";
import { localized } from "@/lib/nav";
import { buildMetadata } from "@/lib/seo";
import { absUrl } from "@/lib/site";
import { getProduct, getProducts, getSite } from "@/lib/site-data";
import { Media } from "@/components/site/ui";
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
      <section className="section" style={{ paddingBottom: 32 }}>
        <div className="container">
          <Link href={localized(locale, "/products")} className="mono" style={{ color: "var(--text-dim)", fontSize: 13 }}>← {t.allProducts}</Link>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44, marginTop: 28, alignItems: "start" }} className="two-col">
            <div className="reveal">
              {field(p, "category", locale) && <div className="eyebrow" style={{ marginBottom: 14 }}>{field(p, "category", locale)}</div>}
              <h1 className="h1" style={{ fontSize: "clamp(36px,3.6vw,56px)" }}>{field(p, "title", locale)}</h1>
              <p className="lead" style={{ marginTop: 20 }}>{field(p, "desc", locale)}</p>
              {chips.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
                  {chips.map((c, i) => <span key={i} className="chip">{pick(c, locale)}</span>)}
                </div>
              )}
              <div style={{ marginTop: 30 }}>
                <Link href={localized(locale, "/contact")} className="btn btn-primary">{t.getInTouch}</Link>
              </div>
            </div>
            <div className="reveal">
              <Media src={p.image} alt={field(p, "title", locale)} ratio="4 / 3" />
            </div>
          </div>
        </div>
      </section>

      {specs.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 className="h2 reveal" style={{ marginBottom: 24 }}>{t.specifications}</h2>
            <div className="card reveal" style={{ padding: "8px 24px" }}>
              {specs.map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 20, padding: "16px 0", borderBottom: i < specs.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ color: "var(--text-dim)" }}>{pick({ en: s.kEn, ru: s.kRu }, locale)}</span>
                  <span className="mono" style={{ fontWeight: 500, textAlign: "right" }}>{pick({ en: s.vEn, ru: s.vRu }, locale)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {features.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 className="h2 reveal" style={{ marginBottom: 24 }}>{t.keyFeatures}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 18 }}>
              {features.map((f, i) => (
                <div key={i} className="card reveal" style={{ padding: "24px 22px" }}>
                  <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 600 }}>{pick({ en: f.titleEn, ru: f.titleRu }, locale)}</h3>
                  <p style={{ margin: 0, color: "var(--text-dim)", fontSize: 14, lineHeight: 1.6 }}>{pick({ en: f.descEn, ru: f.descRu }, locale)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 className="h2 reveal" style={{ marginBottom: 24 }}>{t.relatedProducts}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 18 }}>
              {related.map((r) => (
                <Link key={r.id} href={localized(locale, `/products/${r.slug}`)} className="card card-hover reveal" style={{ overflow: "hidden" }}>
                  <Media src={r.image} alt={field(r, "title", locale)} ratio="4 / 3" radius={0} />
                  <div style={{ padding: "18px 20px" }}>
                    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{field(r, "title", locale)}</h3>
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
