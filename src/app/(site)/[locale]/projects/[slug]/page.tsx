import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, field, ui, type Locale } from "@/lib/i18n";
import { localized } from "@/lib/nav";
import { buildMetadata } from "@/lib/seo";
import { getProject, getProjects } from "@/lib/site-data";
import { Media } from "@/components/site/ui";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const p = await getProject(slug);
  if (!p) return {};
  const title = field(p, "metaTitle", loc) || field(p, "title", loc);
  const desc = field(p, "metaDesc", loc) || field(p, "desc", loc);
  return buildMetadata({ locale: loc, path: `/projects/${slug}`, title, description: desc, image: p.image });
}

export default async function ProjectDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const p = await getProject(slug);
  if (!p) notFound();
  const t = ui(locale);

  const stats = [
    { v: p.stat1, l: field(p, "stat1Label", locale) },
    { v: p.stat2, l: field(p, "stat2Label", locale) },
  ].filter((s) => s.v);

  return (
    <>
      <section className="section" style={{ paddingBottom: 32 }}>
        <div className="container">
          <Link href={localized(locale, "/projects")} className="mono" style={{ color: "var(--text-dim)", fontSize: 13 }}>← {t.allProjects}</Link>
          <div className="reveal" style={{ marginTop: 24 }}>
            <div className="mono" style={{ color: "var(--accent)", fontSize: 13 }}>{field(p, "tag", locale)} · {field(p, "loc", locale)}</div>
            <h1 className="h1" style={{ fontSize: "clamp(36px,3.8vw,60px)", marginTop: 14, maxWidth: 900 }}>{field(p, "title", locale)}</h1>
          </div>
          <div className="reveal" style={{ marginTop: 28 }}>
            <Media src={p.image} alt={field(p, "title", locale)} ratio="16 / 9" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 40, marginTop: 40 }} className="two-col">
            <p className="lead reveal">{field(p, "desc", locale)}</p>
            {stats.length > 0 && (
              <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {stats.map((s, i) => (
                  <div key={i} className="card" style={{ padding: "22px 24px" }}>
                    <div style={{ fontSize: 34, fontWeight: 700, color: "var(--accent)" }}>{s.v}</div>
                    <div style={{ marginTop: 6, fontSize: 14, color: "var(--text-dim)" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ marginTop: 40 }}>
            <Link href={localized(locale, "/contact")} className="btn btn-primary">{t.getInTouch}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
