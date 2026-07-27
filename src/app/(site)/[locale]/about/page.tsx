import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { HeroVideo } from "@/components/site/HeroVideo";

// Faithful port of About.dc.html. The About page is fully static, so all copy
// is hardcoded bilingual below (verbatim from the design's `const T`).
const T = {
  en: {
    label: "About FERUMS",
    title: "Built on engineering. Driven by reliability.",
    lead: "Our mission is to keep the world’s critical industries running — through engineering excellence, reliable equipment and long-term partnership at every stage of the asset lifecycle.",
    body: "FERUMS is an international industrial engineering company supplying rotating equipment, sealing systems, valves and compressors to the energy, oil & gas and process industries. We combine OEM partnerships, certified engineering and global logistics to deliver to one standard everywhere we operate — API, ISO and IEC. Our vision: to be the partner national oil companies, EPC contractors and industrial holdings trust with their most critical equipment.",
    valuesTitle: "What we stand for.",
    values: [
      { num: "01", title: "Engineering excellence", desc: "Every decision starts with a technical answer. Our teams are engineers before they are salespeople." },
      { num: "02", title: "Reliability", desc: "We specify, test and support equipment for decades of continuous operation — not warranty periods." },
      { num: "03", title: "Safety", desc: "Safe operation is a design input, not an afterthought — from SIL-rated valves to zero-emission sealing." },
      { num: "04", title: "Integrity", desc: "Realistic commitments, transparent documentation and full material traceability on every delivery." },
      { num: "05", title: "Innovation", desc: "We bring the newest proven OEM technologies to our customers — from dry gas seals to digital monitoring." },
      { num: "06", title: "Long-term partnership", desc: "One quality standard across every market we serve, backed by API, ISO and IEC certified processes." },
    ],
    teamLabel: "Our team",
    teamTitle: "The people behind FERUMS.",
    teamIntro: "Engineers, project managers and service specialists — the team that keeps critical equipment running across four continents.",
    team: [
      { name: "Arman Seitkali", role: "Chief Executive Officer", src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=75" },
      { name: "Daniyar Omarov", role: "Chief Technical Officer", src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=75" },
      { name: "Elena Vasilenko", role: "Head of Engineering", src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=75" },
      { name: "Marat Zhaksylyk", role: "Head of Service", src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=75" },
    ],
    timelineTitle: "Milestones.",
    timeline: [
      { year: "2008", title: "FERUMS founded", desc: "Started as a specialist supplier of mechanical seals and rotating equipment components." },
      { year: "2014", title: "Rotating equipment division", desc: "Expanded into API 610 pumps, steam turbines and process compressors with first turnkey package delivery." },
      { year: "2019", title: "International expansion", desc: "Regional hubs opened in Dubai and Frankfurt; project footprint reaches 20 countries." },
      { year: "2024", title: "Lifecycle services & OEM programs", desc: "Launched maintenance, inspection and OEM partnership programs across five regional hubs." },
    ],
  },
  ru: {
    label: "О компании FERUMS",
    title: "Инженерная основа. Движимы надёжностью.",
    lead: "Наша миссия — обеспечивать непрерывную работу критических отраслей мира: через инженерное совершенство, надёжное оборудование и долгосрочное партнёрство на каждом этапе жизненного цикла активов.",
    body: "FERUMS — международная промышленно-инжиниринговая компания, поставляющая вращающееся оборудование, уплотнительные системы, арматуру и компрессоры для энергетики, нефтегазовой и перерабатывающей промышленности. Мы объединяем партнёрства с OEM-производителями, сертифицированный инжиниринг и глобальную логистику, работая по единому стандарту — API, ISO и IEC. Наша цель: быть партнёром, которому национальные нефтяные компании, EPC-подрядчики и промышленные холдинги доверяют.",
    valuesTitle: "Наши принципы.",
    values: [
      { num: "01", title: "Инженерное совершенство", desc: "Каждое решение начинается с технического ответа. Наши команды — сначала инженеры, а потом продавцы." },
      { num: "02", title: "Надёжность", desc: "Мы подбираем, испытываем и сопровождаем оборудование для десятилетий непрерывной работы, а не гарантийных сроков." },
      { num: "03", title: "Безопасность", desc: "Безопасная эксплуатация — исходное требование проекта: от арматуры с уровнем SIL до уплотнений без утечек." },
      { num: "04", title: "Честность", desc: "Реалистичные обязательства, прозрачная документация и полная прослеживаемость материалов в каждой поставке." },
      { num: "05", title: "Инновации", desc: "Мы приносим заказчикам новейшие проверенные технологии OEM — от сухих газовых уплотнений до цифрового мониторинга." },
      { num: "06", title: "Долгосрочное партнёрство", desc: "Единый стандарт качества на всех рынках, подтверждённый сертифицированными процессами API, ISO и IEC." },
    ],
    teamLabel: "Наша команда",
    teamTitle: "Люди, которые стоят за FERUMS.",
    teamIntro: "Инженеры, руководители проектов и сервисные специалисты — команда, которая обеспечивает работу критического оборудования на четырёх континентах.",
    team: [
      { name: "Арман Сейткали", role: "Генеральный директор", src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=75" },
      { name: "Данияр Омаров", role: "Технический директор", src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=75" },
      { name: "Елена Василенко", role: "Руководитель инжиниринга", src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=75" },
      { name: "Марат Жаксылык", role: "Руководитель сервиса", src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=75" },
    ],
    timelineTitle: "Ключевые вехи.",
    timeline: [
      { year: "2008", title: "Основание FERUMS", desc: "Начали как специализированный поставщик торцевых уплотнений и компонентов вращающегося оборудования." },
      { year: "2014", title: "Дивизион вращающегося оборудования", desc: "Вышли в сегмент насосов API 610, паровых турбин и технологических компрессоров; первая комплектная поставка." },
      { year: "2019", title: "Международная экспансия", desc: "Открыты региональные хабы в Дубае и Франкфурте; география проектов — 20 стран." },
      { year: "2024", title: "Сервис жизненного цикла и OEM-программы", desc: "Запущены программы обслуживания, инспекции и OEM-партнёрства в пяти региональных хабах." },
    ],
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const t = T[loc];
  return buildMetadata({ locale: loc, path: "/about", title: t.title, description: t.lead });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = T[locale];

  return (
    <>
      {/* Hero */}
      <section
        className="video-hero hero-onvideo"
        style={{ position: "relative", minHeight: "88vh", display: "flex", alignItems: "center", overflow: "hidden" }}
      >
        <HeroVideo media="about" />
        <div className="container">
          <div className="eyebrow reveal" style={{ marginBottom: 24 }}>{t.label}</div>
          <h1 className="h1 reveal" style={{ maxWidth: 1000 }}>{t.title}</h1>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container who-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div className="reveal" style={{ borderRadius: 24, overflow: "hidden", aspectRatio: "4/3", background: "var(--card)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=80" alt="Engineer at work" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <p className="reveal" style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "var(--text)" }}>{t.lead}</p>
            <p className="reveal" style={{ margin: "28px 0 0", fontSize: 15, lineHeight: 1.8, color: "var(--text-dim)" }}>{t.body}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="h2 reveal" style={{ margin: "0 0 64px" }}>{t.valuesTitle}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }} className="grid-3">
            {t.values.map((v) => (
              <div key={v.num} className="reveal card" style={{ padding: 40, borderRadius: 20, background: "var(--card)", border: "1px solid var(--border)" }}>
                <span className="mono" style={{ fontSize: 13, color: "var(--green)" }}>{v.num}</span>
                <h3 style={{ margin: "16px 0 0", fontSize: 24, fontWeight: 600, color: "var(--text)" }}>{v.title}</h3>
                <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.7, color: "var(--text-dim)" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="eyebrow reveal" style={{ marginBottom: 24 }}>{t.teamLabel}</div>
          <h2 className="h2 reveal" style={{ margin: 0, maxWidth: 820 }}>{t.teamTitle}</h2>
          <p className="reveal" style={{ margin: "24px 0 64px", fontSize: 15, lineHeight: 1.7, color: "var(--text-dim)", maxWidth: 620 }}>{t.teamIntro}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 28 }} className="grid-4">
            {t.team.map((m) => (
              <div key={m.name} className="reveal" style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ display: "block", borderRadius: 20, overflow: "hidden", aspectRatio: "3/4", background: "var(--card)", border: "1px solid var(--border)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.src} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </span>
                <span style={{ display: "block", marginTop: 18, fontSize: 19, fontWeight: 600, color: "var(--text)" }}>{m.name}</span>
                <span className="mono" style={{ display: "block", marginTop: 6, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--green)" }}>{m.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <h2 className="h2 reveal" style={{ margin: "0 0 64px" }}>{t.timelineTitle}</h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {t.timeline.map((it) => (
              <div key={it.year} className="reveal stack-sm" style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 48, padding: "36px 0", borderTop: "1px solid var(--border)" }}>
                <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-.02em", color: "var(--green)" }}>{it.year}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "var(--text)" }}>{it.title}</h3>
                  <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.65, color: "var(--text-dim)", maxWidth: 640 }}>{it.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
