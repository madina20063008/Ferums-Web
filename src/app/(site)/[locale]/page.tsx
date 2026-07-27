import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, pick, field, type Locale } from "@/lib/i18n";
import { localized } from "@/lib/nav";
import { buildMetadata } from "@/lib/seo";
import { getSite, getIndustries, getServices, getProjects, getPartners } from "@/lib/site-data";
import { HeroVideo } from "@/components/site/HeroVideo";

// Faithful port of Home.dc.html. Static section copy is bilingual below; the
// list collections (industries, services, products, projects, news, partners)
// come from the DB so the admin can manage them.
const T = {
  en: {
    kicker: "Engineering Tomorrow's Industrial Infrastructure",
    heroL1: "Powering Energy.", heroL2: "Driving Industry.", heroL3: "Engineering Reliability.",
    heroSub: "FERUMS delivers mission-critical industrial equipment and engineering solutions for energy, oil & gas, petrochemical, mining, manufacturing, utilities and infrastructure projects worldwide.",
    ctaSolutions: "Explore Services", ctaContact: "Contact Us",
    whoLabel: "Engineering intelligence", whoTitle: "Engineering intelligence for critical industries.",
    whoText: "FERUMS combines decades of industrial engineering expertise, advanced manufacturing technologies, digital engineering and international standards to deliver reliable solutions for the world’s most demanding environments. From concept engineering to commissioning, every solution is designed for maximum efficiency, operational reliability and lifecycle performance.",
    whoLink: "About FERUMS",
    indLabel: "Industries", indTitle: "Where FERUMS operates.",
    solLabel: "Services", solTitle: "The complete equipment lifecycle.",
    prodLabel: "Products", prodTitle: "Critical equipment from world-leading OEMs.", prodLink: "All products",
    products: [
      { title: "Mechanical Seals", desc: "API 682 sealing systems for pumps and mixers." },
      { title: "Dry Gas Seals", desc: "Non-contact sealing for turbocompressors." },
      { title: "Industrial Pumps", desc: "API 610 process and utility pumps." },
      { title: "Steam Turbines", desc: "API 611/612 drive turbines." },
      { title: "Process Compressors", desc: "API 618, screw and reciprocating units." },
      { title: "Industrial Valves", desc: "Ball, gate, butterfly, control and safety valves." },
      { title: "Industrial Bearings", desc: "Precision bearings for heavy rotating duty." },
      { title: "Spare Parts & Actuators", desc: "OEM spares and valve automation." },
    ],
    lcLabel: "Engineering lifecycle", lcTitle: "Engineering across the entire asset lifecycle.",
    lcSteps: ["Concept", "Engineering", "Design", "Manufacturing", "Factory testing", "Logistics", "Installation", "Commissioning", "Operation", "Predictive maintenance", "Modernization", "Lifecycle support"],
    stats: [{ n: "18+", label: "Years of engineering" }, { n: "50+", label: "Equipment categories" }, { n: "20+", label: "Industrial sectors" }, { n: "100+", label: "Engineering projects" }, { n: "24/7", label: "Technical support" }],
    certLabel: "Certifications & standards", certTitle: "Certified quality. Verified at every step.",
    certs: [
      { code: "ISO 9001", title: "Quality management", desc: "Certified quality management system covering engineering, procurement and delivery." },
      { code: "ISO 14001", title: "Environmental management", desc: "Environmental management system across all operations and logistics." },
      { code: "ISO 45001", title: "Occupational safety", desc: "Health and safety management for field service and installation work." },
      { code: "API Q1", title: "API quality program", desc: "Quality program for equipment supplied to API 610, 618 and 682 specifications." },
      { code: "FAT / NDT", title: "Testing & inspection", desc: "Factory acceptance tests, non-destructive testing and independent inspection." },
      { code: "MTC 3.1", title: "Material traceability", desc: "EN 10204 3.1 material certificates and full documentation packages." },
    ],
    whyTitle: "Why global industries choose FERUMS.",
    whyItems: ["Engineering expertise", "International standards", "OEM partnerships", "Quality assurance", "Fast project delivery", "Lifecycle support", "Experienced engineers", "Global supply chain", "Precision manufacturing", "Reliable performance"],
    projLabel: "Featured projects", projTitle: "Delivered worldwide.",
    globalLabel: "Global presence", globalTitle: "Operating across 27 countries on 4 continents.",
    offices: ["Astana", "Dubai", "Frankfurt", "Singapore", "Houston"],
    partnersLabel: "Trusted by industry leaders",
    newsTitle: "Latest from FERUMS.", newsLink: "All news",
    news: [
      { title: "FERUMS engineers certified to API 682", tag: "Quality", date: "Jul 2026", img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1600&q=80" },
      { title: "New regional hub opens in Dubai", tag: "Global", date: "Jun 2026", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80" },
      { title: "API 618 compressor package delivered", tag: "Oil & Gas", date: "May 2026", img: "https://images.unsplash.com/photo-1726731782158-fcf6822b6ca4?w=1600&q=80" },
    ],
    ctaTitle: "Core Strength. Future Energy.", ctaBtn1: "Contact FERUMS", ctaBtn2: "Explore Services",
  },
  ru: {
    kicker: "Проектируем промышленную инфраструктуру будущего",
    heroL1: "Энергия для мира.", heroL2: "Движение для промышленности.", heroL3: "Инженерная надёжность.",
    heroSub: "FERUMS поставляет критически важное промышленное оборудование и инжиниринговые решения для энергетики, нефтегазовой, нефтехимической, горнодобывающей отраслей, производства и инфраструктурных проектов по всему миру.",
    ctaSolutions: "Наши услуги", ctaContact: "Связаться с нами",
    whoLabel: "Инженерный интеллект", whoTitle: "Инженерный интеллект для критических отраслей.",
    whoText: "FERUMS объединяет десятилетия промышленной инженерной экспертизы, передовые производственные технологии, цифровой инжиниринг и международные стандарты, чтобы поставлять надёжные решения для самых требовательных условий в мире. От концепт-инжиниринга до пусконаладки каждое решение проектируется для максимальной эффективности, эксплуатационной надёжности и производительности на всём жизненном цикле.",
    whoLink: "О компании FERUMS",
    indLabel: "Отрасли", indTitle: "Где работает FERUMS.",
    solLabel: "Услуги", solTitle: "Полный жизненный цикл оборудования.",
    prodLabel: "Продукция", prodTitle: "Критическое оборудование ведущих мировых производителей.", prodLink: "Вся продукция",
    products: [
      { title: "Торцевые уплотнения", desc: "Уплотнительные системы API 682 для насосов и мешалок." },
      { title: "Сухие газовые уплотнения", desc: "Бесконтактные уплотнения для турбокомпрессоров." },
      { title: "Промышленные насосы", desc: "Технологические и вспомогательные насосы API 610." },
      { title: "Паровые турбины", desc: "Приводные турбины API 611/612." },
      { title: "Технологические компрессоры", desc: "Поршневые API 618, винтовые и специальные." },
      { title: "Промышленная арматура", desc: "Шаровая, задвижки, дисковая, регулирующая и предохранительная." },
      { title: "Промышленные подшипники", desc: "Прецизионные подшипники для тяжёлых режимов." },
      { title: "Запчасти и приводы", desc: "Оригинальные запчасти и автоматизация арматуры." },
    ],
    lcLabel: "Жизненный цикл", lcTitle: "Инжиниринг на всём жизненном цикле актива.",
    lcSteps: ["Концепция", "Инжиниринг", "Проектирование", "Производство", "Заводские испытания", "Логистика", "Монтаж", "Пусконаладка", "Эксплуатация", "Предиктивное обслуживание", "Модернизация", "Сопровождение"],
    stats: [{ n: "18+", label: "Лет инжиниринга" }, { n: "50+", label: "Категорий оборудования" }, { n: "20+", label: "Отраслей" }, { n: "100+", label: "Инженерных проектов" }, { n: "24/7", label: "Техническая поддержка" }],
    certLabel: "Сертификаты и стандарты", certTitle: "Сертифицированное качество. Проверено на каждом этапе.",
    certs: [
      { code: "ISO 9001", title: "Менеджмент качества", desc: "Сертифицированная система менеджмента качества: инжиниринг, закупки и поставка." },
      { code: "ISO 14001", title: "Экологический менеджмент", desc: "Система экологического менеджмента во всех операциях и логистике." },
      { code: "ISO 45001", title: "Охрана труда", desc: "Система охраны труда и промышленной безопасности для сервисных и монтажных работ." },
      { code: "API Q1", title: "Программа качества API", desc: "Программа качества для оборудования по спецификациям API 610, 618 и 682." },
      { code: "FAT / НК", title: "Испытания и инспекция", desc: "Заводские приёмочные испытания, неразрушающий контроль и независимая инспекция." },
      { code: "MTC 3.1", title: "Прослеживаемость материалов", desc: "Сертификаты на материалы EN 10204 3.1 и полные пакеты документации." },
    ],
    whyTitle: "Почему мировые отрасли выбирают FERUMS.",
    whyItems: ["Инженерная экспертиза", "Международные стандарты", "OEM-партнёрства", "Гарантия качества", "Быстрая реализация проектов", "Сопровождение жизненного цикла", "Опытные инженеры", "Глобальная цепочка поставок", "Прецизионное производство", "Надёжная работа"],
    projLabel: "Ключевые проекты", projTitle: "Реализованы по всему миру.",
    globalLabel: "Глобальное присутствие", globalTitle: "Работаем в 27 странах на 4 континентах.",
    offices: ["Астана", "Дубай", "Франкфурт", "Сингапур", "Хьюстон"],
    partnersLabel: "Нам доверяют лидеры отрасли",
    newsTitle: "Новости FERUMS.", newsLink: "Все новости",
    news: [
      { title: "Инженеры FERUMS сертифицированы по API 682", tag: "Качество", date: "Июл 2026", img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1600&q=80" },
      { title: "Открыт региональный хаб в Дубае", tag: "Глобально", date: "Июн 2026", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80" },
      { title: "Поставлен компрессорный пакет API 618", tag: "Нефть и газ", date: "Май 2026", img: "https://images.unsplash.com/photo-1726731782158-fcf6822b6ca4?w=1600&q=80" },
    ],
    ctaTitle: "Core Strength. Future Energy.", ctaBtn1: "Связаться с FERUMS", ctaBtn2: "Наши услуги",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const site = await getSite();
  return buildMetadata({ locale: loc, path: "", title: pick(site.seo.defaultTitle, loc), description: pick(site.seo.defaultDescription, loc), absoluteTitle: true });
}

const label = (text: string, extra?: React.CSSProperties) => <div className="eyebrow reveal" style={{ marginBottom: 24, ...extra }}>{text}</div>;
const arrow = <span style={{ color: "var(--green)", fontSize: 22 }}>→</span>;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = T[locale];
  const [industries, services, projects, partners] = await Promise.all([
    getIndustries(), getServices(), getProjects(), getPartners(),
  ]);
  const marquee = [...partners, ...partners]; // duplicated for a seamless loop
  // The design's home shows these four industries in this order.
  const HOME_INDUSTRIES = ["oil-gas", "power-generation", "petrochemical-chemical", "mining-metallurgy"];
  const picked = HOME_INDUSTRIES.map((s) => industries.find((i) => i.slug === s)).filter(Boolean) as typeof industries;
  const homeIndustries = picked.length === 4 ? picked : industries.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="video-hero hero-onvideo" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <HeroVideo media="home" />
        <div className="container">
          <div className="eyebrow reveal" style={{ marginBottom: 28 }}>{t.kicker}</div>
          <h1 className="h1 reveal" style={{ maxWidth: 1000 }}>
            <span style={{ display: "block" }}>{t.heroL1}</span>
            <span style={{ display: "block" }}>{t.heroL2}</span>
            <span style={{ display: "block" }}>{t.heroL3}</span>
          </h1>
          <p className="reveal" style={{ margin: "32px 0 0", fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,.72)", maxWidth: 520 }}>{t.heroSub}</p>
          <div className="reveal" style={{ display: "flex", gap: 16, marginTop: 48, flexWrap: "wrap" }}>
            <Link href={localized(locale, "/services")} className="btn btn-primary">{t.ctaSolutions}</Link>
            <Link href={localized(locale, "/contact")} className="btn btn-ghost">{t.ctaContact}</Link>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", width: 1, height: 48, background: "linear-gradient(rgba(255,255,255,.7),transparent)", animation: "scrollHint 2.2s ease-in-out infinite" }} />
      </section>

      {/* Who we are */}
      <section className="section">
        <div className="container who-2" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            {label(t.whoLabel)}
            <h2 className="h2 reveal">{t.whoTitle}</h2>
            <p className="reveal" style={{ margin: "28px 0 0", fontSize: 15, lineHeight: 1.75, color: "var(--text-dim)", maxWidth: 520 }}>{t.whoText}</p>
            <Link href={localized(locale, "/about")} className="reveal" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 36, fontSize: 16, fontWeight: 600, color: "var(--green)" }}>{t.whoLink} →</Link>
          </div>
          <div className="reveal" style={{ borderRadius: 24, overflow: "hidden", aspectRatio: "4/3", background: "var(--card)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1600&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="section section-alt">
        <div className="container">
          {label(t.indLabel)}
          <h2 className="h2 reveal" style={{ margin: "0 0 72px", maxWidth: 700 }}>{t.indTitle}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="grid-2">
            {homeIndustries.map((it) => (
              <Link key={it.id} href={localized(locale, "/industries")} className="reveal" style={{ position: "relative", display: "block", borderRadius: 20, overflow: "hidden", aspectRatio: "16/9", background: "var(--card)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.image} alt={field(it, "title", locale)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(9,9,9,0) 30%,rgba(9,9,9,.88) 100%)" }} />
                <span style={{ position: "absolute", left: 32, right: 32, bottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
                  <span>
                    <span style={{ display: "block", fontSize: 26, fontWeight: 600, color: "#fff", letterSpacing: "-.01em" }}>{field(it, "title", locale)}</span>
                    <span style={{ display: "block", marginTop: 6, fontSize: 15, color: "rgba(255,255,255,.6)" }}>{field(it, "desc", locale)}</span>
                  </span>
                  {arrow}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services / Solutions */}
      <section className="section">
        <div className="container">
          {label(t.solLabel)}
          <h2 className="h2 reveal" style={{ margin: "0 0 72px", maxWidth: 700 }}>{t.solTitle}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, borderRadius: 20, overflow: "hidden", border: "1px solid var(--border)" }}>
            {services.map((s) => (
              <Link key={s.id} href={localized(locale, "/services")} className="reveal svc-row" style={{ display: "grid", gridTemplateColumns: "80px 1fr 2fr 60px", gap: 32, alignItems: "center", padding: "40px 48px", background: "var(--surface-alt)" }}>
                <span className="mono" style={{ fontSize: 14, color: "var(--text-faint)" }}>{s.numberTag}</span>
                <span style={{ fontSize: 26, fontWeight: 600, color: "var(--text)", letterSpacing: "-.01em" }}>{field(s, "title", locale)}</span>
                <span style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-dim)" }}>{field(s, "desc", locale)}</span>
                <span style={{ fontSize: 22, color: "var(--green)", textAlign: "right" }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 72, gap: 40 }}>
            <div>
              {label(t.prodLabel)}
              <h2 className="h2 reveal">{t.prodTitle}</h2>
            </div>
            <Link href={localized(locale, "/products")} className="reveal" style={{ flexShrink: 0, fontSize: 16, fontWeight: 600, color: "var(--green)" }}>{t.prodLink} →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }} className="grid-4">
            {t.products.map((p, i) => (
              <Link key={i} href={localized(locale, "/products")} className="reveal card card-hover" style={{ display: "block", padding: "32px 28px", borderRadius: 20, background: "var(--card)" }}>
                <span style={{ display: "block", width: 36, height: 36, border: "1.5px solid var(--green)", borderRadius: 9, marginBottom: 24, position: "relative" }}>
                  <span style={{ position: "absolute", inset: 9, border: "1.5px solid rgba(127,127,127,.4)", borderRadius: 4 }} />
                </span>
                <span style={{ display: "block", fontSize: 19, fontWeight: 600, color: "var(--text)" }}>{p.title}</span>
                <span style={{ display: "block", marginTop: 8, fontSize: 14, lineHeight: 1.55, color: "var(--text-dim)" }}>{p.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lifecycle */}
      <section className="section" style={{ paddingBottom: 40 }}>
        <div className="container">
          {label(t.lcLabel)}
          <h2 className="h2 reveal" style={{ margin: "0 0 64px", maxWidth: 820 }}>{t.lcTitle}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 20 }} className="grid-lc">
            {t.lcSteps.map((name, i) => (
              <div key={i} className="reveal" style={{ borderTop: "1px solid var(--border-strong)", paddingTop: 18 }}>
                <span className="mono" style={{ display: "block", fontSize: 12, color: "var(--green)" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ display: "block", marginTop: 8, fontSize: 16, fontWeight: 600, color: "var(--text)" }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 32 }} className="grid-5">
            {t.stats.map((st, i) => (
              <div key={i} className="reveal" style={{ borderTop: "1px solid var(--border-strong)", paddingTop: 28 }}>
                <span style={{ display: "block", fontSize: 64, fontWeight: 700, letterSpacing: "-.03em", color: "var(--text)" }}>{st.n}</span>
                <span className="mono" style={{ display: "block", marginTop: 8, fontSize: 13, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-faint)" }}>{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {label(t.certLabel)}
          <h2 className="h2 reveal" style={{ margin: "0 0 56px", maxWidth: 760 }}>{t.certTitle}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
            {t.certs.map((c, i) => (
              <div key={i} className="reveal card card-hover" style={{ padding: "32px 28px", borderRadius: 20, background: "var(--surface-alt)" }}>
                <span className="mono" style={{ display: "inline-flex", alignItems: "center", padding: "8px 14px", borderRadius: 8, border: "1.5px solid var(--green)", fontSize: 14, fontWeight: 500, letterSpacing: ".08em", color: "var(--green)", marginBottom: 20 }}>{c.code}</span>
                <span style={{ display: "block", fontSize: 18, fontWeight: 600, color: "var(--text)" }}>{c.title}</span>
                <span style={{ display: "block", marginTop: 8, fontSize: 14, lineHeight: 1.6, color: "var(--text-dim)" }}>{c.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why FERUMS */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 className="h2 reveal" style={{ margin: "0 0 56px", maxWidth: 820 }}>{t.whyTitle}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 20 }} className="grid-5">
            {t.whyItems.map((w, i) => (
              <div key={i} className="reveal" style={{ padding: 24, borderRadius: 16, background: "var(--surface-alt)", border: "1px solid var(--border)" }}>
                <span style={{ display: "block", width: 10, height: 10, borderRadius: 3, background: "var(--green)", marginBottom: 16 }} />
                <span style={{ display: "block", fontSize: 16, fontWeight: 600, lineHeight: 1.35, color: "var(--text)" }}>{w}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="section section-alt">
        <div className="container">
          {label(t.projLabel)}
          <h2 className="h2 reveal" style={{ margin: "0 0 72px" }}>{t.projTitle}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="grid-2">
            {projects.slice(0, 4).map((pr) => (
              <Link key={pr.id} href={localized(locale, `/projects/${pr.slug}`)} className="reveal" style={{ display: "block", borderRadius: 20, overflow: "hidden", background: "var(--card)", border: "1px solid var(--border)" }}>
                <span style={{ display: "block", aspectRatio: "16/9", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pr.image} alt={field(pr, "title", locale)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </span>
                <span style={{ display: "block", padding: "28px 32px 32px" }}>
                  <span className="mono" style={{ fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--green)" }}>{field(pr, "tag", locale)}</span>
                  <span style={{ display: "block", marginTop: 10, fontSize: 24, fontWeight: 600, color: "var(--text)", letterSpacing: "-.01em" }}>{field(pr, "title", locale)}</span>
                  <span style={{ display: "block", marginTop: 8, fontSize: 15, color: "var(--text-dim)" }}>{field(pr, "loc", locale)}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Global presence */}
      <section style={{ position: "relative", overflow: "hidden", borderTop: "1px solid var(--border)", background: "#090909", color: "rgba(255,255,255,.92)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=2400&q=80" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(9,9,9,.9),rgba(9,9,9,.55) 50%,rgba(9,9,9,.95))" }} />
        <div className="container" style={{ position: "relative", paddingTop: 140, paddingBottom: 140, textAlign: "center" }}>
          <div className="eyebrow reveal" style={{ marginBottom: 24 }}>{t.globalLabel}</div>
          <h2 className="h2 reveal" style={{ margin: "0 auto", maxWidth: 760, color: "#fff" }}>{t.globalTitle}</h2>
          <div className="reveal" style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 64, flexWrap: "wrap" }}>
            {t.offices.map((o, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", animation: "pulse 2.6s ease-in-out infinite" }} />
                <span style={{ fontSize: 17, color: "rgba(255,255,255,.8)" }}>{o}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="section" style={{ overflow: "hidden" }}>
        <div className="container">
          <div className="eyebrow reveal" style={{ marginBottom: 48, textAlign: "center", color: "var(--text-faint)" }}>{t.partnersLabel}</div>
        </div>
        <div style={{ display: "flex", gap: 64, width: "max-content", animation: "marquee 40s linear infinite", alignItems: "center" }}>
          {marquee.map((p, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 64, background: "#fff", borderRadius: 12, padding: "0 26px", flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {p.logo ? <img src={p.logo} alt={p.name} style={{ maxHeight: 42, maxWidth: 150, objectFit: "contain" }} /> : <span style={{ fontWeight: 700, color: "#10141C" }}>{p.name}</span>}
            </span>
          ))}
        </div>
      </section>

      {/* News */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 72, gap: 24 }}>
            <h2 className="h2 reveal">{t.newsTitle}</h2>
            <Link href={localized(locale, "/news")} className="reveal" style={{ fontSize: 16, fontWeight: 600, color: "var(--green)", flexShrink: 0 }}>{t.newsLink} →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }} className="grid-3">
            {t.news.map((a, i) => (
              <Link key={i} href={localized(locale, "/news")} className="reveal" style={{ display: "block" }}>
                <span style={{ display: "block", borderRadius: 20, overflow: "hidden", aspectRatio: "3/2", marginBottom: 24 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </span>
                <span className="mono" style={{ fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--green)" }}>{a.tag} · {a.date}</span>
                <span style={{ display: "block", marginTop: 12, fontSize: 22, fontWeight: 600, lineHeight: 1.3, color: "var(--text)", letterSpacing: "-.01em" }}>{a.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: "relative", overflow: "hidden", borderTop: "1px solid var(--border)", background: "radial-gradient(ellipse 60% 80% at 50% 120%,rgba(28,175,232,.18),transparent), var(--bg)" }}>
        <div className="container" style={{ paddingTop: 180, paddingBottom: 180, textAlign: "center" }}>
          <h2 className="reveal" style={{ margin: "0 auto", fontSize: "clamp(44px,5.5vw,80px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.05, maxWidth: 900 }}>{t.ctaTitle}</h2>
          <div className="reveal" style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 56, flexWrap: "wrap" }}>
            <Link href={localized(locale, "/contact")} className="btn btn-primary">{t.ctaBtn1}</Link>
            <Link href={localized(locale, "/services")} className="btn btn-ghost">{t.ctaBtn2}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
