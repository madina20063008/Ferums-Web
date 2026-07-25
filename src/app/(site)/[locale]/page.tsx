import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, pick, field, ui, type Locale } from "@/lib/i18n";
import { localized } from "@/lib/nav";
import { buildMetadata } from "@/lib/seo";
import { getSite, getIndustries, getServices, getProducts, getProjects, getArticles } from "@/lib/site-data";
import { Section, SectionTitle, Media, TextLink } from "@/components/site/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const site = await getSite();
  return buildMetadata({
    locale: loc,
    path: "",
    title: pick(site.seo.defaultTitle, loc),
    description: pick(site.seo.defaultDescription, loc),
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = ui(locale);
  const [site, industries, services, products, projects, articles] = await Promise.all([
    getSite(), getIndustries(), getServices(), getProducts(), getProjects(), getArticles(),
  ]);
  const h = site.home;
  const s = site.sectionIntros;

  return (
    <>
      {/* Hero */}
      <section className="section" style={{ paddingTop: 96, paddingBottom: 56 }}>
        <div className="container">
          <div className="eyebrow reveal" style={{ marginBottom: 22 }}>{pick(site.seo.keywords, locale)}</div>
          <h1 className="h1 reveal" style={{ maxWidth: 980 }}>
            {pick(h.heroTitle, locale).split("\n").map((line, i) => (
              <span key={i} style={{ display: "block" }}>{line}</span>
            ))}
          </h1>
          <p className="lead reveal" style={{ marginTop: 26, maxWidth: 640 }}>{pick(h.heroSubtitle, locale)}</p>
          <div className="reveal" style={{ display: "flex", gap: 14, marginTop: 34, flexWrap: "wrap" }}>
            <Link href={localized(locale, "/contact")} className="btn btn-primary">{pick(h.heroPrimaryCta, locale)}</Link>
            <Link href={localized(locale, "/products")} className="btn btn-ghost">{pick(h.heroSecondaryCta, locale)}</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      {h.stats.length > 0 && (
        <Section style={{ paddingTop: 0, paddingBottom: 40 }}>
          <div className="reveal" style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(h.stats.length, 5)}, 1fr)`, gap: 20 }}>
            {h.stats.map((st, i) => (
              <div key={i} className="card" style={{ padding: "26px 22px" }}>
                <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--accent)" }}>{st.value}</div>
                <div style={{ marginTop: 8, fontSize: 14, color: "var(--text-dim)" }}>{pick(st.label, locale)}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Who we are */}
      <Section>
        <div className="reveal" style={{ maxWidth: 820 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>{pick(h.whoEyebrow, locale)}</div>
          <h2 className="h2">{pick(h.whoTitle, locale)}</h2>
          <p className="lead" style={{ marginTop: 18 }}>{pick(h.whoBody, locale)}</p>
        </div>
      </Section>

      {/* Industries */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle title={pick(s.industries.title, locale)} subtitle={pick(s.industries.subtitle, locale)} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
          {industries.slice(0, 6).map((it) => (
            <Link key={it.id} href={localized(locale, "/industries")} className="card card-hover reveal" style={{ overflow: "hidden" }}>
              <Media src={it.image} alt={field(it, "title", locale)} ratio="16 / 10" radius={0} />
              <div style={{ padding: "18px 20px" }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{field(it, "title", locale)}</h3>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 26 }}><TextLink locale={locale} href="/industries">{t.viewAll}</TextLink></div>
      </Section>

      {/* Services */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle title={pick(s.services.title, locale)} subtitle={pick(s.services.subtitle, locale)} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
          {services.map((sv) => (
            <div key={sv.id} className="card card-hover reveal" style={{ padding: "26px 24px" }}>
              <div className="mono" style={{ color: "var(--accent)", fontSize: 13 }}>{sv.numberTag}</div>
              <h3 style={{ margin: "12px 0 8px", fontSize: 20, fontWeight: 600 }}>{field(sv, "title", locale)}</h3>
              <p style={{ margin: 0, color: "var(--text-dim)", fontSize: 14, lineHeight: 1.6 }}>{field(sv, "desc", locale)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Products */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle title={pick(s.products.title, locale)} subtitle={pick(s.products.subtitle, locale)} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {products.slice(0, 6).map((p) => (
            <Link key={p.id} href={localized(locale, `/products/${p.slug}`)} className="card card-hover reveal" style={{ overflow: "hidden" }}>
              <Media src={p.image} alt={field(p, "title", locale)} ratio="4 / 3" radius={0} />
              <div style={{ padding: "18px 20px" }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{field(p, "title", locale)}</h3>
                <div className="mono" style={{ marginTop: 8, fontSize: 12, color: "var(--text-faint)" }}>{field(p, "spec", locale)}</div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 26 }}><TextLink locale={locale} href="/products">{t.allProducts}</TextLink></div>
      </Section>

      {/* Lifecycle */}
      {h.lifecycle.length > 0 && (
        <Section style={{ paddingTop: 0 }}>
          <SectionTitle title={pick(h.lifecycleTitle, locale)} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
            {h.lifecycle.map((l, i) => (
              <div key={i} className="card reveal" style={{ padding: "20px 18px" }}>
                <div className="mono" style={{ color: "var(--accent)", fontSize: 13 }}>{l.step}</div>
                <div style={{ marginTop: 10, fontSize: 15, fontWeight: 500 }}>{pick(l.label, locale)}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Why + certifications */}
      <Section style={{ paddingTop: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 40 }} className="two-col">
          <div className="reveal">
            <h2 className="h2">{pick(h.whyTitle, locale)}</h2>
            <ul style={{ margin: "24px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {h.why.map((w, i) => (
                <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", color: "var(--text-dim)", fontSize: 15 }}>
                  <span style={{ color: "var(--accent)" }}>—</span>{pick(w, locale)}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 16 }}>{pick(h.certificationsTitle, locale)}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {h.certifications.map((c, i) => <span key={i} className="chip">{c}</span>)}
            </div>
          </div>
        </div>
      </Section>

      {/* Projects */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle title={pick(s.projects.title, locale)} subtitle={pick(s.projects.subtitle, locale)} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 18 }}>
          {projects.slice(0, 4).map((pr) => (
            <Link key={pr.id} href={localized(locale, `/projects/${pr.slug}`)} className="card card-hover reveal" style={{ overflow: "hidden" }}>
              <Media src={pr.image} alt={field(pr, "title", locale)} ratio="16 / 9" radius={0} />
              <div style={{ padding: "20px 22px" }}>
                <div className="mono" style={{ fontSize: 12, color: "var(--accent)" }}>{field(pr, "tag", locale)} · {field(pr, "loc", locale)}</div>
                <h3 style={{ margin: "10px 0 0", fontSize: 20, fontWeight: 600 }}>{field(pr, "title", locale)}</h3>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 26 }}><TextLink locale={locale} href="/projects">{t.allProjects}</TextLink></div>
      </Section>

      {/* News */}
      <Section style={{ paddingTop: 0 }}>
        <SectionTitle title={pick(s.news.title, locale)} subtitle={pick(s.news.subtitle, locale)} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
          {articles.slice(0, 3).map((a) => (
            <Link key={a.id} href={localized(locale, `/news/${a.slug}`)} className="card card-hover reveal" style={{ overflow: "hidden" }}>
              <Media src={a.image} alt={field(a, "title", locale)} ratio="16 / 9" radius={0} />
              <div style={{ padding: "18px 20px" }}>
                <div className="mono" style={{ fontSize: 12, color: "var(--text-faint)" }}>{field(a, "tag", locale)} · {field(a, "date", locale)}</div>
                <h3 style={{ margin: "10px 0 0", fontSize: 17, fontWeight: 600, lineHeight: 1.3 }}>{field(a, "title", locale)}</h3>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 26 }}><TextLink locale={locale} href="/news">{t.allNews}</TextLink></div>
      </Section>

      {/* CTA banner */}
      <Section style={{ paddingTop: 0 }}>
        <div className="card reveal" style={{ padding: "56px 44px", textAlign: "center", borderColor: "rgba(28,175,232,.35)" }}>
          <h2 className="h2" style={{ maxWidth: 720, margin: "0 auto" }}>{pick(h.ctaTitle, locale)}</h2>
          <p className="lead" style={{ marginTop: 16, maxWidth: 560, marginInline: "auto" }}>{pick(h.ctaBody, locale)}</p>
          <div style={{ marginTop: 28 }}>
            <Link href={localized(locale, "/contact")} className="btn btn-primary">{pick(h.ctaButton, locale)}</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
