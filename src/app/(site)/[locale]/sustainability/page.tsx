import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { HeroVideo } from "@/components/site/HeroVideo";

// Faithful port of Sustainability.dc.html. Fully static, bilingual content is
// hardcoded verbatim from the design's `const T = { en, ru }` dictionary.
const IMG = {
  solar: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80",
  dc: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
  water: "https://images.unsplash.com/photo-1651672391284-2f5bd4451694?w=1200&q=80",
} as const;

const T = {
  en: {
    label: "Sustainability",
    title: "Engineering sustainable industry.",
    lead: "Balance-of-plant equipment, efficient infrastructure and water stewardship that cut emissions and resource use across the industrial lifecycle.",
    pillars: [
      { title: "Renewable energy systems", desc: "Balance-of-plant equipment and grid integration for wind, solar and hybrid storage projects.", img: IMG.solar },
      { title: "Efficient infrastructure", desc: "High-efficiency transformers, drives and cooling systems that cut energy losses across the lifecycle.", img: IMG.dc },
      { title: "Water stewardship", desc: "Treatment, recycling and monitoring systems that reduce industrial water consumption.", img: IMG.water },
    ],
    commitTitle: "Our commitments.",
    commitments: [
      { n: "−40%", label: "Target reduction in operational emissions by 2030 (vs. 2022 baseline)." },
      { n: "100%", label: "Of new product lines assessed for lifecycle energy efficiency." },
      { n: "1.2 GW", label: "Of renewable capacity supported by FERUMS-delivered equipment to date." },
    ],
  },
  ru: {
    label: "Устойчивое развитие",
    title: "Инженерия устойчивой промышленности.",
    lead: "Оборудование «баланса станции», эффективная инфраструктура и ответственное водопользование, снижающие выбросы и потребление ресурсов на всём промышленном жизненном цикле.",
    pillars: [
      { title: "Системы возобновляемой энергетики", desc: "Оборудование «баланса станции» и сетевая интеграция для ветровых, солнечных и гибридных проектов с накопителями.", img: IMG.solar },
      { title: "Эффективная инфраструктура", desc: "Высокоэффективные трансформаторы, приводы и системы охлаждения, снижающие потерю энергии за весь жизненный цикл.", img: IMG.dc },
      { title: "Ответственное водопользование", desc: "Системы очистки, рециркуляции и мониторинга, сокращающие промышленное водопотребление.", img: IMG.water },
    ],
    commitTitle: "Наши обязательства.",
    commitments: [
      { n: "−40%", label: "Целевое снижение операционных выбросов к 2030 году (к базе 2022 года)." },
      { n: "100%", label: "Новых продуктовых линеек проходят оценку энергоэффективности жизненного цикла." },
      { n: "1,2 ГВт", label: "Возобновляемых мощностей обеспечено оборудованием FERUMS на сегодня." },
    ],
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const t = T[loc];
  return buildMetadata({ locale: loc, path: "/sustainability", title: t.title, description: t.lead });
}

export default async function SustainabilityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = T[locale];

  return (
    <>
      {/* Hero */}
      <section
        className="video-hero hero-onvideo hero-lightswap"
        style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}
      >
        <HeroVideo media="sustainability" />
        <div className="container hero-center">
          <div className="eyebrow reveal" style={{ marginBottom: 24 }}>{t.label}</div>
          <h1 className="h1 reveal" style={{ maxWidth: 1040, margin: "0 auto", fontSize: "clamp(30px,4vw,48px)" }}>{t.title}</h1>
        </div>
      </section>

      {/* Pillars */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }} className="grid-3">
            {t.pillars.map((p, i) => (
              <div key={i} className="reveal card card-hover" style={{ borderRadius: 20, overflow: "hidden", background: "var(--card)", border: "1px solid var(--border)" }}>
                <span style={{ display: "block", aspectRatio: "16/9", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </span>
                <span style={{ display: "block", padding: "32px 36px 40px" }}>
                  <span style={{ display: "block", fontSize: 24, fontWeight: 600, color: "var(--text)" }}>{p.title}</span>
                  <span style={{ display: "block", margin: "12px 0 0", fontSize: 15, lineHeight: 1.7, color: "var(--text-dim)" }}>{p.desc}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="h2 reveal" style={{ margin: "0 0 64px", maxWidth: 700 }}>{t.commitTitle}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }} className="grid-3">
            {t.commitments.map((c, i) => (
              <div key={i} className="reveal" style={{ borderTop: "1px solid var(--border-strong)", paddingTop: 28 }}>
                <span style={{ display: "block", fontSize: 56, fontWeight: 700, letterSpacing: "-.03em", color: "var(--green)" }}>{c.n}</span>
                <span style={{ display: "block", marginTop: 10, fontSize: 16, lineHeight: 1.6, color: "var(--text-dim)" }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
