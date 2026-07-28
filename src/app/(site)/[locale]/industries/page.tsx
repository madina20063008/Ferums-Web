import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, pick, field, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getIndustries } from "@/lib/site-data";
import { HeroVideo } from "@/components/site/HeroVideo";

// Faithful port of Industries.dc.html. Static hero copy is bilingual below; the
// industries list comes from the DB so the admin can manage it.
const T = {
  en: {
    label: "Industries",
    title: "Critical equipment for critical industries.",
    intro:
      "FERUMS serves the process and energy industries where downtime is not an option — with critical equipment, engineering expertise and lifecycle support.",
  },
  ru: {
    label: "Отрасли",
    title: "Оптимальное оборудование для ключевых отраслей промышленности",
    intro:
      "FERUMS работает с предприятиями технологического и энергетического секторов, где простои недопустимы — обеспечивая надёжное оборудование, инженерные компетенции и сопровождение на всех этапах производственного цикла.",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const t = T[loc];
  return buildMetadata({ locale: loc, path: "/industries", title: t.title, description: t.intro });
}

export default async function IndustriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = T[locale];
  const industries = await getIndustries();

  return (
    <>
      {/* Hero */}
      <section
        className="video-hero hero-onvideo"
        style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}
      >
        <HeroVideo media="industries" />
        <div className="container">
          <div className="eyebrow reveal" style={{ marginBottom: 24 }}>{t.label}</div>
          <h1 className="h1 reveal" style={{ maxWidth: 900 }}>{t.title}</h1>
          <p className="reveal" style={{ margin: "32px 0 0", fontSize: 16, lineHeight: 1.65, color: "rgba(255,255,255,.75)", maxWidth: 620 }}>{t.intro}</p>
        </div>
      </section>

      {/* Industry cards */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="grid-2">
            {industries.map((it) => {
              const tags = (it.tags as unknown as { en: string; ru: string }[]) || [];
              return (
                <div key={it.id} className="reveal card card-hover" style={{ borderRadius: 20, overflow: "hidden", background: "var(--card)", border: "1px solid var(--border)" }}>
                  <div style={{ aspectRatio: "16 / 8", overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.image} alt={field(it, "title", locale)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "36px 40px 40px" }}>
                    <h2 style={{ margin: 0, fontSize: "clamp(22px,3.6vw,30px)", fontWeight: 600, letterSpacing: "-.01em", color: "var(--text)" }}>{field(it, "title", locale)}</h2>
                    <p style={{ margin: "14px 0 0", fontSize: 15, lineHeight: 1.7, color: "var(--text-dim)" }}>{field(it, "desc", locale)}</p>
                    {tags.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
                        {tags.map((tag, i) => (
                          <span key={i} className="mono" style={{ padding: "7px 14px", borderRadius: 99, border: "1px solid var(--border)", fontSize: 12, color: "var(--text-faint)" }}>{pick(tag, locale)}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
