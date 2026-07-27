import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, pick, field, type Locale } from "@/lib/i18n";
import { localized } from "@/lib/nav";
import { buildMetadata } from "@/lib/seo";
import { getSite, getProducts } from "@/lib/site-data";
import { PageHeader, Media } from "@/components/site/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const site = await getSite();
  const s = site.sectionIntros.products;
  return buildMetadata({
    locale: loc,
    path: "/products",
    title: pick(s.title, loc),
    description: pick(s.subtitle, loc),
  });
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [site, products] = await Promise.all([getSite(), getProducts()]);
  const s = site.sectionIntros.products;

  return (
    <>
      <PageHeader title={pick(s.title, locale)} lead={pick(s.subtitle, locale)} video="products" />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
            {products.map((p) => (
              <Link key={p.id} href={localized(locale, `/products/${p.slug}`)} className="card card-hover reveal" style={{ overflow: "hidden" }}>
                <Media src={p.image} alt={field(p, "title", locale)} ratio="4 / 3" radius={0} />
                <div style={{ padding: "18px 20px" }}>
                  {field(p, "category", locale) && (
                    <div className="mono" style={{ fontSize: 12, color: "var(--accent)" }}>{field(p, "category", locale)}</div>
                  )}
                  <h3 style={{ margin: "10px 0 0", fontSize: 18, fontWeight: 600 }}>{field(p, "title", locale)}</h3>
                  <div className="mono" style={{ marginTop: 8, fontSize: 12, color: "var(--text-faint)" }}>{field(p, "spec", locale)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
