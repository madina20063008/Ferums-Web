import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, field, localizeStat, type Locale } from "@/lib/i18n";
import { localized } from "@/lib/nav";
import { buildMetadata } from "@/lib/seo";
import { getProjects } from "@/lib/site-data";

// Faithful port of Projects.dc.html. Static hero copy is bilingual below; the
// case-study list comes from the DB so the admin can manage it.
const T = {
  en: {
    label: "Projects",
    title: "Proven at scale, worldwide.",
    intro:
      "Engineering success stories: measurable improvements from 100+ delivered projects across oil & gas, power generation, mining and process industries.",
  },
  ru: {
    label: "Проекты",
    title: "Проверено масштабом. По всему миру.",
    intro:
      "Истории инженерного успеха: измеримые улучшения из более чем 100 реализованных проектов в нефтегазовой отрасли, энергетике, горной добыче и переработке.",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const t = T[loc];
  return buildMetadata({ locale: loc, path: "/projects", title: t.title, description: t.intro });
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = T[locale];
  const projects = await getProjects();

  return (
    <>
      {/* Hero */}
      <header className="section">
        <div className="container">
          <div className="eyebrow reveal">{t.label}</div>
          <h1 className="h1 reveal">{t.title}</h1>
          <p
            className="reveal"
            style={{ marginTop: 22, fontSize: 16, lineHeight: 1.6, color: "var(--text-dim)", maxWidth: 640 }}
          >
            {t.intro}
          </p>
        </div>
      </header>

      {/* Case studies */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {projects.map((pr) => (
              <Link
                key={pr.id}
                href={localized(locale, `/projects/${pr.slug}`)}
                className="reveal card-hover"
                data-keep-dark
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "flex-end",
                  borderRadius: 24,
                  overflow: "hidden",
                  minHeight: 440,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pr.image}
                  alt={field(pr, "title", locale)}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg,rgba(9,9,9,.15) 20%,rgba(9,9,9,.92) 100%)",
                  }}
                />
                <div
                  className="project-card-grid"
                  style={{
                    position: "relative",
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr",
                    gap: 48,
                    width: "100%",
                    boxSizing: "border-box",
                    alignItems: "end",
                    padding: "48px 56px",
                  }}
                >
                  <div>
                    <span
                      className="mono"
                      style={{ fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--green)" }}
                    >
                      {field(pr, "tag", locale)} · {field(pr, "loc", locale)}
                    </span>
                    <h2 style={{ margin: "12px 0 0", fontSize: "clamp(22px,3.6vw,30px)", fontWeight: 600, letterSpacing: "-.01em", color: "#fff" }}>
                      {field(pr, "title", locale)}
                    </h2>
                    <p style={{ margin: "14px 0 0", fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,.65)", maxWidth: 560 }}>
                      {field(pr, "desc", locale)}
                    </p>
                  </div>
                  <div>
                    <span style={{ display: "block", fontSize: "clamp(26px,6vw,40px)", fontWeight: 700, letterSpacing: "-.02em", color: "#fff" }}>
                      {localizeStat(pr.stat1, locale)}
                    </span>
                    <span
                      className="mono"
                      style={{ display: "block", marginTop: 6, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.5)" }}
                    >
                      {field(pr, "stat1Label", locale)}
                    </span>
                  </div>
                  <div>
                    <span style={{ display: "block", fontSize: "clamp(26px,6vw,40px)", fontWeight: 700, letterSpacing: "-.02em", color: "#fff" }}>
                      {localizeStat(pr.stat2, locale)}
                    </span>
                    <span
                      className="mono"
                      style={{ display: "block", marginTop: 6, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.5)" }}
                    >
                      {field(pr, "stat2Label", locale)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
