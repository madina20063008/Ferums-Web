import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, pick, field, type Locale } from "@/lib/i18n";
import { localized } from "@/lib/nav";
import { buildMetadata } from "@/lib/seo";
import { getSite, getProjects } from "@/lib/site-data";
import { PageHeader, Media } from "@/components/site/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const site = await getSite();
  const s = site.sectionIntros.projects;
  return buildMetadata({
    locale: loc,
    path: "/projects",
    title: pick(s.title, loc),
    description: pick(s.subtitle, loc),
  });
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [site, projects] = await Promise.all([getSite(), getProjects()]);
  const s = site.sectionIntros.projects;

  return (
    <>
      <PageHeader title={pick(s.title, locale)} lead={pick(s.subtitle, locale)} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 18 }}>
            {projects.map((pr) => (
              <Link key={pr.id} href={localized(locale, `/projects/${pr.slug}`)} className="card card-hover reveal" style={{ overflow: "hidden" }}>
                <Media src={pr.image} alt={field(pr, "title", locale)} ratio="16 / 9" radius={0} />
                <div style={{ padding: "20px 22px" }}>
                  <div className="mono" style={{ fontSize: 12, color: "var(--accent)" }}>{field(pr, "tag", locale)} · {field(pr, "loc", locale)}</div>
                  <h3 style={{ margin: "10px 0 8px", fontSize: 20, fontWeight: 600 }}>{field(pr, "title", locale)}</h3>
                  <p style={{ margin: 0, color: "var(--text-dim)", fontSize: 14, lineHeight: 1.6 }}>{field(pr, "desc", locale)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
