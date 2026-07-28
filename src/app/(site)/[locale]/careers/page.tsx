import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, field, type Locale } from "@/lib/i18n";
import { localized } from "@/lib/nav";
import { buildMetadata } from "@/lib/seo";
import { getRoles } from "@/lib/site-data";
import { HeroVideo } from "@/components/site/HeroVideo";

// Faithful port of Careers.dc.html. Static hero + benefits copy is bilingual
// below; the open roles list comes from the DB so the admin can manage it.
const T = {
  en: {
    label: "Careers",
    title: "Build what the world runs on.",
    intro:
      "Join 350+ engineers working on energy systems, automation and AI infrastructure across 27 countries.",
    rolesTitle: "Open roles.",
    whyTitle: "Why FERUMS.",
    apply: "Apply",
    benefits: [
      { title: "Real projects", desc: "Work on infrastructure that powers cities, factories and compute — not slideware." },
      { title: "Global mobility", desc: "Rotations and assignments across five regional hubs on four continents." },
      { title: "Deep expertise", desc: "Certification programs with leading OEMs and industry bodies (IEC, API, ISO)." },
      { title: "Engineering culture", desc: "Decisions made on technical merit, led by engineers at every level." },
    ],
  },
  ru: {
    label: "Карьера",
    title: "Создавайте то, на чём работает мир.",
    intro:
      "Присоединяйтесь к 350+ инженерам, работающим над энергосистемами, автоматизацией и AI-инфраструктурой в 27 странах.",
    rolesTitle: "Открытые вакансии.",
    whyTitle: "Почему FERUMS.",
    apply: "Откликнуться",
    benefits: [
      { title: "Настоящие проекты", desc: "Инфраструктура, питающая города, заводы и вычисления, — а не презентации." },
      { title: "Глобальная мобильность", desc: "Ротации и командировки между пятью региональными хабами на четырёх континентах." },
      { title: "Глубокая экспертиза", desc: "Программы сертификации с ведущими производителями и отраслевыми организациями (IEC, API, ISO)." },
      { title: "Инженерная культура", desc: "Решения принимаются по техническим аргументам — инженерами на всех уровнях." },
    ],
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const t = T[loc];
  return buildMetadata({ locale: loc, path: "/careers", title: t.title, description: t.intro });
}

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = T[locale];
  const roles = await getRoles();

  return (
    <>
      {/* Hero */}
      <section
        className="video-hero hero-onvideo"
        style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}
      >
        <HeroVideo media="careers" />
        <div className="container hero-center">
          <div className="eyebrow reveal" style={{ marginBottom: 24 }}>{t.label}</div>
          <h1 className="h1 reveal" style={{ maxWidth: 1040, fontSize: "clamp(30px,4vw,48px)" }}>{t.title}</h1>
          <p className="reveal" style={{ margin: "32px 0 0", fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,.75)", maxWidth: 1080 }}>{t.intro}</p>
        </div>
      </section>

      {/* Open roles */}
      <section className="section">
        <div className="container">
          <h2 className="h2 reveal" style={{ margin: "0 0 48px" }}>{t.rolesTitle}</h2>
          <div style={{ display: "flex", flexDirection: "column", borderRadius: 20, overflow: "hidden", border: "1px solid var(--border)" }}>
            {roles.map((r) => {
              const desc = field(r, "desc", locale);
              const type = field(r, "type", locale);
              return (
                <div
                  key={r.id}
                  className="reveal stack-sm"
                  style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 32, alignItems: "center", padding: "32px 40px", background: "var(--surface-alt)", borderBottom: "1px solid var(--border)" }}
                >
                  <span>
                    <span style={{ display: "block", fontSize: 20, fontWeight: 600, color: "var(--text)" }}>{field(r, "title", locale)}</span>
                    {desc ? <span style={{ display: "block", marginTop: 8, fontSize: 15, lineHeight: 1.6, color: "var(--text-dim)" }}>{desc}</span> : null}
                  </span>
                  <span className="mono" style={{ fontSize: 13, letterSpacing: ".08em", color: "var(--text)" }}>{field(r, "dept", locale)}</span>
                  <span className="mono" style={{ fontSize: 13, letterSpacing: ".08em", color: "var(--text)" }}>
                    {field(r, "location", locale)}{type ? ` · ${type}` : ""}
                  </span>
                  <Link href={localized(locale, "/contact")} className="btn btn-primary" style={{ justifySelf: "end" }}>{t.apply}</Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why FERUMS / benefits */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="h2 reveal" style={{ margin: "0 0 64px" }}>{t.whyTitle}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32 }} className="grid-4">
            {t.benefits.map((b, i) => (
              <div key={i} className="reveal" style={{ borderTop: "1px solid var(--border-strong)", paddingTop: 24 }}>
                <h3 style={{ margin: 0, fontSize: 19, fontWeight: 600, color: "var(--text)" }}>{b.title}</h3>
                <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.65, color: "var(--text-dim)" }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
