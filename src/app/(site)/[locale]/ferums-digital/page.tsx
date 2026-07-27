import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { localized } from "@/lib/nav";
import { buildMetadata } from "@/lib/seo";
import { HeroVideo } from "@/components/site/HeroVideo";

// Faithful port of FerumsDigital.dc.html — the "Industrial AI Revolution" page.
// Fully static; all content is hardcoded bilingual below, verbatim from the
// design's T dictionary.
const T = {
  en: {
    kicker: "Industrial AI Revolution",
    title: "Where mechanical engineering meets artificial intelligence.",
    intro:
      "FERUMS DIGITAL is the technology organization inside FERUMS. It develops proprietary software platforms, enterprise applications and industrial AI — entirely in-house — so customers receive machines and intelligence from one engineering ecosystem.",
    divTitle: "One company. Hardware and software.",
    divText1:
      "Unlike traditional industrial suppliers, FERUMS combines mechanical engineering, industrial equipment, software engineering, data analytics and cloud technologies under one roof. Clients no longer buy equipment from one company and digital systems from another — they receive one integrated engineering ecosystem with a single point of responsibility.",
    divText2:
      "Everything starts with engineering: engineering creates infrastructure, infrastructure creates industry, industry creates economies. FERUMS DIGITAL exists to make that infrastructure intelligent.",
    engLabel: "Software engineering",
    engTitle: "An elite in-house software team.",
    engText:
      "Approximately 25 software engineers work across the full technology stack — from embedded systems on the equipment itself to cloud platforms and AI models. The team builds software used by industrial companies worldwide and works side by side with FERUMS mechanical engineers, so every line of code is grounded in real equipment behavior.",
    engAreas: ["Artificial Intelligence", "Machine Learning", "Computer Vision", "Backend", "Frontend", "Cloud Engineering", "Data Engineering", "Embedded Systems", "Industrial IoT", "Mobile Apps", "DevOps", "Cybersecurity", "API Integration", "Enterprise Systems", "UI/UX Design", "Software Architecture"],
    aiLabel: "FERUMS AI Lab",
    aiTitle: "Industrial intelligence for critical infrastructure.",
    aiText:
      "FERUMS operates its own AI research and engineering laboratory dedicated to industrial applications. Unlike consumer AI, FERUMS AI is purpose-built for engineering: every model solves a specific industrial problem, is trained on equipment physics and validated against real plant data.",
    aiApps: [
      { num: "01", title: "Predictive Maintenance", desc: "Forecasts equipment failures weeks in advance so reliability teams plan repairs during scheduled stops instead of reacting to breakdowns." },
      { num: "02", title: "Failure & Root Cause Analysis", desc: "Correlates vibration, process and maintenance data to identify why equipment failed — and prevent the same failure across the fleet." },
      { num: "03", title: "Computer Vision Inspection", desc: "Automated visual inspection of components, welds and assemblies for quality teams — faster and more consistent than manual checks." },
      { num: "04", title: "Engineering Copilot", desc: "An AI assistant for engineers: sizing calculations, standards lookup (API, ISO) and equipment selection support directly in the workflow." },
      { num: "05", title: "Document Intelligence", desc: "Search and question-answering across thousands of datasheets, manuals and P&IDs — engineers find answers in seconds, not hours." },
      { num: "06", title: "Energy Optimization", desc: "Analyzes pump and compressor operating points to recommend setpoints that cut energy consumption without sacrificing throughput." },
      { num: "07", title: "Intelligent Procurement", desc: "Matches spare-part requests to OEM catalogs and stock data, reducing sourcing time for maintenance and procurement teams." },
      { num: "08", title: "Report Generation", desc: "Automatically drafts inspection, commissioning and maintenance reports from field data — engineers review instead of retyping." },
    ],
    prodLabel: "Proprietary platforms",
    prodTitle: "The FERUMS software ecosystem.",
    products: [
      { name: "FERUMS Pulse", tag: "Asset performance monitoring", desc: "Real-time health monitoring for rotating equipment: vibration, temperature and process KPIs on one dashboard, with alerts tied to engineering thresholds — not generic limits.", users: "Used by reliability engineers and plant operations in oil & gas, power and mining. Integrates with existing DCS/SCADA and historians." },
      { name: "FERUMS Predict", tag: "Predictive maintenance AI", desc: "Failure-mode models estimate remaining useful life of pumps, compressors and seals, turning unplanned downtime into planned interventions and cutting maintenance costs.", users: "Used by maintenance planners and asset managers. Deployed on-premise or in the FERUMS Industrial Cloud." },
      { name: "FERUMS Vision", tag: "Computer vision inspection", desc: "Camera-based inspection of components, assemblies and production lines: defect detection, dimensional checks and automated quality documentation.", users: "Used by QA/QC teams in manufacturing and metallurgy. Works with standard industrial cameras and edge hardware." },
      { name: "FERUMS Atlas", tag: "Engineering knowledge platform", desc: "A knowledge graph of equipment documentation, standards and maintenance history with AI-powered search — institutional knowledge that survives staff turnover.", users: "Used by engineering departments and EPC contractors managing large documentation sets." },
      { name: "FERUMS Guardian", tag: "Industrial cybersecurity", desc: "Monitoring of industrial networks and connected equipment for anomalies and unauthorized access — security designed for OT environments, not adapted from IT.", users: "Used by plant IT/OT teams operating critical infrastructure under regulatory requirements." },
      { name: "FERUMS Plant OS", tag: "Digital twin & operations", desc: "A living digital twin of the plant: equipment models, live data and simulation in one environment for operations planning, modernization studies and operator training.", users: "Used by plant management and engineering consultants on modernization and expansion projects." },
    ],
    cdLabel: "Custom development",
    cdTitle: "Enterprise software built to your requirements.",
    cdText:
      "Off-the-shelf systems rarely match real industrial workflows. FERUMS develops custom enterprise software — from MES and asset management to customer portals and API platforms — designed around your processes, integrated with your equipment and supported through its lifecycle. One partner is responsible for both the machines and the software that runs them.",
    cdItems: ["ERP", "CRM", "SCADA Integration", "MES", "WMS", "Industrial Dashboards", "Asset Management", "Digital Twin", "Inspection Systems", "Monitoring Systems", "AI Platforms", "IoT Platforms", "Mobile Applications", "Customer Portals", "B2B Platforms", "Knowledge Management", "API Platforms", "Engineering Databases"],
    eaTitle: "How AI works with real equipment.",
    eaItems: [
      { title: "AI monitors equipment health", desc: "Continuous analysis of vibration, temperature and process signals builds a live health profile for every critical machine." },
      { title: "AI predicts failures", desc: "Degradation models trained on equipment physics forecast failures weeks ahead — converting emergencies into scheduled work." },
      { title: "AI analyzes vibration", desc: "Spectral analysis identifies bearing wear, misalignment, imbalance and cavitation earlier than threshold alarms." },
      { title: "AI recommends maintenance", desc: "Condition-based recommendations replace fixed calendars: service what needs servicing, when it needs it." },
      { title: "AI optimizes energy", desc: "Operating-point analysis of pumps and compressors finds setpoints that reduce power consumption at the same output." },
      { title: "AI assists engineers", desc: "Copilot tools handle documentation search, standard calculations and report drafting — engineers focus on decisions." },
    ],
    ctaTitle: "One ecosystem: machines and intelligence.",
    ctaBtn: "Talk to FERUMS DIGITAL",
  },
  ru: {
    kicker: "Промышленная AI-революция",
    title: "Там, где машиностроение встречается с искусственным интеллектом.",
    intro:
      "FERUMS DIGITAL — технологическая организация внутри FERUMS. Она полностью собственными силами разрабатывает программные платформы, корпоративные приложения и промышленный ИИ, чтобы заказчики получали машины и интеллект из одной инженерной экосистемы.",
    divTitle: "Одна компания. Оборудование и софт.",
    divText1:
      "В отличие от традиционных промышленных поставщиков, FERUMS объединяет машиностроение, промышленное оборудование, разработку ПО, аналитику данных и облачные технологии под одной крышей. Клиенты больше не покупают оборудование у одной компании, а цифровые системы у другой — они получают единую инженерную экосистему с одной точкой ответственности.",
    divText2:
      "Всё начинается с инженерии: инженерия создаёт инфраструктуру, инфраструктура — промышленность, промышленность — экономику. FERUMS DIGITAL существует, чтобы сделать эту инфраструктуру интеллектуальной.",
    engLabel: "Разработка ПО",
    engTitle: "Собственная команда инженеров-разработчиков.",
    engText:
      "Около 25 инженеров-программистов работают по всему технологическому стеку — от встраиваемых систем на самом оборудовании до облачных платформ и моделей ИИ. Команда создаёт ПО, которым пользуются промышленные компании по всему миру, и работает бок о бок с инженерами-механиками FERUMS — каждая строка кода опирается на реальное поведение оборудования.",
    engAreas: ["Искусственный интеллект", "Машинное обучение", "Компьютерное зрение", "Backend", "Frontend", "Облачная инженерия", "Инженерия данных", "Встраиваемые системы", "Промышленный IoT", "Мобильные приложения", "DevOps", "Кибербезопасность", "API-интеграции", "Корпоративные системы", "UI/UX-дизайн", "Архитектура ПО"],
    aiLabel: "FERUMS AI Lab",
    aiTitle: "Промышленный интеллект для критической инфраструктуры.",
    aiText:
      "FERUMS располагает собственной лабораторией исследований и разработки ИИ для промышленных применений. В отличие от потребительского ИИ, ИИ FERUMS создан для инженерии: каждая модель решает конкретную промышленную задачу, обучена на физике оборудования и проверена на реальных заводских данных.",
    aiApps: [
      { num: "01", title: "Предиктивное обслуживание", desc: "Прогнозирует отказы оборудования за недели, чтобы службы надёжности планировали ремонты в плановые остановы, а не реагировали на поломки." },
      { num: "02", title: "Анализ отказов и первопричин", desc: "Сопоставляет данные вибрации, процесса и обслуживания, чтобы понять, почему отказало оборудование, — и не допустить повторения по всему парку." },
      { num: "03", title: "Инспекция компьютерным зрением", desc: "Автоматический визуальный контроль деталей, сварных швов и узлов для служб качества — быстрее и стабильнее ручных проверок." },
      { num: "04", title: "Инженерный копилот", desc: "ИИ-ассистент инженера: расчёты, поиск по стандартам (API, ISO) и поддержка подбора оборудования прямо в рабочем процессе." },
      { num: "05", title: "Интеллект документации", desc: "Поиск и ответы на вопросы по тысячам паспортов, инструкций и схем P&ID — инженеры находят ответы за секунды, а не часы." },
      { num: "06", title: "Оптимизация энергопотребления", desc: "Анализирует рабочие точки насосов и компрессоров и рекомендует уставки, снижающие энергопотребление без потери производительности." },
      { num: "07", title: "Интеллектуальные закупки", desc: "Сопоставляет заявки на запчасти с каталогами OEM и складскими данными, сокращая время подбора для служб ТОиР и закупок." },
      { num: "08", title: "Генерация отчётов", desc: "Автоматически формирует черновики отчётов по инспекциям, пусконаладке и обслуживанию из полевых данных — инженеры проверяют, а не перепечатывают." },
    ],
    prodLabel: "Собственные платформы",
    prodTitle: "Программная экосистема FERUMS.",
    products: [
      { name: "FERUMS Pulse", tag: "Мониторинг состояния активов", desc: "Мониторинг вращающегося оборудования в реальном времени: вибрация, температура и технологические KPI на одном дашборде, с оповещениями по инженерным порогам, а не общим лимитам.", users: "Используют инженеры по надёжности и службы эксплуатации в нефтегазе, энергетике и горной добыче. Интегрируется с АСУ ТП/SCADA и архивами данных." },
      { name: "FERUMS Predict", tag: "ИИ предиктивного обслуживания", desc: "Модели отказов оценивают остаточный ресурс насосов, компрессоров и уплотнений, превращая внеплановые простои в плановые вмешательства и снижая затраты на обслуживание.", users: "Используют планировщики ТОиР и управляющие активами. Разворачивается on-premise или в промышленном облаке FERUMS." },
      { name: "FERUMS Vision", tag: "Инспекция компьютерным зрением", desc: "Камерная инспекция деталей, узлов и производственных линий: обнаружение дефектов, размерный контроль и автоматическая документация качества.", users: "Используют службы ОТК в производстве и металлургии. Работает со стандартными промышленными камерами и edge-оборудованием." },
      { name: "FERUMS Atlas", tag: "Платформа инженерных знаний", desc: "Граф знаний из документации оборудования, стандартов и истории обслуживания с ИИ-поиском — институциональные знания, которые не уходят вместе с сотрудниками.", users: "Используют инженерные департаменты и EPC-подрядчики с большими массивами документации." },
      { name: "FERUMS Guardian", tag: "Промышленная кибербезопасность", desc: "Мониторинг промышленных сетей и подключённого оборудования на аномалии и несанкционированный доступ — безопасность, спроектированная для OT-сред, а не адаптированная из IT.", users: "Используют службы IT/OT предприятий критической инфраструктуры с регуляторными требованиями." },
      { name: "FERUMS Plant OS", tag: "Цифровой двойник и операции", desc: "Живой цифровой двойник предприятия: модели оборудования, живые данные и симуляция в одной среде — для планирования эксплуатации, проработки модернизаций и обучения операторов.", users: "Используют руководство предприятий и инженерные консультанты в проектах модернизации и расширения." },
    ],
    cdLabel: "Заказная разработка",
    cdTitle: "Корпоративное ПО под ваши требования.",
    cdText:
      "Готовые системы редко совпадают с реальными промышленными процессами. FERUMS разрабатывает заказное корпоративное ПО — от MES и управления активами до клиентских порталов и API-платформ — спроектированное под ваши процессы, интегрированное с вашим оборудованием и сопровождаемое на всём жизненном цикле. Один партнёр отвечает и за машины, и за софт, который ими управляет.",
    cdItems: ["ERP", "CRM", "Интеграция SCADA", "MES", "WMS", "Промышленные дашборды", "Управление активами", "Цифровой двойник", "Системы инспекции", "Системы мониторинга", "ИИ-платформы", "IoT-платформы", "Мобильные приложения", "Клиентские порталы", "B2B-платформы", "Управление знаниями", "API-платформы", "Инженерные базы данных"],
    eaTitle: "Как ИИ работает с реальным оборудованием.",
    eaItems: [
      { title: "ИИ следит за состоянием оборудования", desc: "Непрерывный анализ вибрации, температуры и технологических сигналов формирует живой профиль состояния каждой критической машины." },
      { title: "ИИ прогнозирует отказы", desc: "Модели деградации, обученные на физике оборудования, предсказывают отказы за недели — превращая аварии в плановые работы." },
      { title: "ИИ анализирует вибрацию", desc: "Спектральный анализ выявляет износ подшипников, расцентровку, дисбаланс и кавитацию раньше пороговых сигнализаций." },
      { title: "ИИ рекомендует обслуживание", desc: "Рекомендации по фактическому состоянию заменяют жёсткие календари: обслуживается то, что нужно, и тогда, когда нужно." },
      { title: "ИИ оптимизирует энергию", desc: "Анализ рабочих точек насосов и компрессоров находит уставки, снижающие энергопотребление при той же производительности." },
      { title: "ИИ помогает инженерам", desc: "Инструменты-копилоты берут на себя поиск документации, типовые расчёты и подготовку отчётов — инженеры сосредоточены на решениях." },
    ],
    ctaTitle: "Одна экосистема: машины и интеллект.",
    ctaBtn: "Связаться с FERUMS DIGITAL",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const t = T[loc];
  return buildMetadata({ locale: loc, path: "/ferums-digital", title: t.title, description: t.intro });
}

export default async function FerumsDigitalPage({ params }: { params: Promise<{ locale: string }> }) {
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
        <HeroVideo media="ferumsDigital" />
        <div className="container">
          <div className="eyebrow reveal" style={{ marginBottom: 24 }}>{t.kicker}</div>
          <h1 className="h1 reveal" style={{ maxWidth: 1000 }}>{t.title}</h1>
          <p className="reveal" style={{ margin: "32px 0 0", fontSize: 16, lineHeight: 1.65, color: "rgba(255,255,255,.75)", maxWidth: 660 }}>{t.intro}</p>
        </div>
      </section>

      {/* Division */}
      <section className="section">
        <div className="container split-2" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <h2 className="h2 reveal">{t.divTitle}</h2>
            <p className="reveal" style={{ margin: "26px 0 0", fontSize: 15, lineHeight: 1.8, color: "var(--text-dim)" }}>{t.divText1}</p>
            <p className="reveal" style={{ margin: "20px 0 0", fontSize: 15, lineHeight: 1.8, color: "var(--text-dim)" }}>{t.divText2}</p>
          </div>
          <div className="reveal" style={{ borderRadius: 24, overflow: "hidden", aspectRatio: "4/3", background: "var(--card)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1400&q=70" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </section>

      {/* Software engineering */}
      <section className="section section-alt">
        <div className="container split-2" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 80, alignItems: "center" }}>
          <div>
            <div className="eyebrow reveal" style={{ marginBottom: 24 }}>{t.engLabel}</div>
            <h2 className="h2 reveal">{t.engTitle}</h2>
            <p className="reveal" style={{ margin: "26px 0 0", fontSize: 15, lineHeight: 1.8, color: "var(--text-dim)" }}>{t.engText}</p>
          </div>
          <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: 10, alignContent: "center" }}>
            {t.engAreas.map((a, i) => (
              <span key={i} className="mono chip" style={{ padding: "10px 18px", borderRadius: 99, border: "1px solid var(--border)", fontSize: 13, color: "var(--text-dim)" }}>{a}</span>
            ))}
          </div>
        </div>
      </section>

      {/* AI Lab */}
      <section className="section">
        <div className="container">
          <div className="eyebrow reveal" style={{ marginBottom: 24 }}>{t.aiLabel}</div>
          <h2 className="h2 reveal" style={{ maxWidth: 820 }}>{t.aiTitle}</h2>
          <p className="reveal" style={{ margin: "26px 0 64px", fontSize: 15, lineHeight: 1.8, color: "var(--text-dim)", maxWidth: 720 }}>{t.aiText}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
            {t.aiApps.map((c, i) => (
              <div key={i} className="reveal card card-hover" style={{ padding: 32, borderRadius: 20, background: "var(--card)", border: "1px solid var(--border)" }}>
                <span className="mono" style={{ display: "block", fontSize: 12, color: "var(--green)" }}>{c.num}</span>
                <h3 style={{ margin: "14px 0 0", fontSize: 20, fontWeight: 600, color: "var(--text)" }}>{c.title}</h3>
                <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.7, color: "var(--text-dim)" }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proprietary platforms */}
      <section className="section section-alt">
        <div className="container">
          <div className="eyebrow reveal" style={{ marginBottom: 24 }}>{t.prodLabel}</div>
          <h2 className="h2 reveal" style={{ margin: "0 0 64px", maxWidth: 820 }}>{t.prodTitle}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {t.products.map((p, i) => (
              <div key={i} className="reveal card card-hover stack-sm" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48, padding: "44px 48px", borderRadius: 20, background: "var(--surface-alt)", border: "1px solid var(--border)" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: "-.01em", color: "var(--text)" }}>{p.name}</h3>
                  <span className="mono" style={{ display: "block", marginTop: 10, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--green)" }}>{p.tag}</span>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: "var(--text-dim)" }}>{p.desc}</p>
                  <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.7, color: "var(--text-faint)" }}>{p.users}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom development */}
      <section className="section">
        <div className="container split-2" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 80, alignItems: "center" }}>
          <div>
            <div className="eyebrow reveal" style={{ marginBottom: 24 }}>{t.cdLabel}</div>
            <h2 className="h2 reveal">{t.cdTitle}</h2>
            <p className="reveal" style={{ margin: "26px 0 0", fontSize: 15, lineHeight: 1.8, color: "var(--text-dim)" }}>{t.cdText}</p>
          </div>
          <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: 10, alignContent: "center" }}>
            {t.cdItems.map((it, idx) => (
              <span key={idx} className="chip" style={{ padding: "10px 18px", borderRadius: 99, background: "var(--card)", border: "1px solid var(--border)", fontSize: 14, fontWeight: 500, color: "var(--text-dim)" }}>{it}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering + AI */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="h2 reveal" style={{ margin: "0 0 64px", maxWidth: 820 }}>{t.eaTitle}</h2>
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, borderRadius: 20, overflow: "hidden", border: "1px solid var(--border)" }}>
            {t.eaItems.map((e, i) => (
              <div key={i} className="reveal" style={{ padding: "36px 40px", background: "var(--surface-alt)" }}>
                <h3 style={{ margin: 0, fontSize: 19, fontWeight: 600, color: "var(--green)" }}>{e.title}</h3>
                <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.7, color: "var(--text-dim)" }}>{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: "relative", overflow: "hidden", borderTop: "1px solid var(--border)", background: "radial-gradient(ellipse 60% 80% at 50% 120%,rgba(28,175,232,.18),transparent), var(--bg)" }}>
        <div className="container" style={{ paddingTop: 160, paddingBottom: 160, textAlign: "center" }}>
          <h2 className="reveal" style={{ margin: "0 auto", fontSize: "clamp(40px,4.5vw,64px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.05, maxWidth: 860 }}>{t.ctaTitle}</h2>
          <div className="reveal" style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 48 }}>
            <Link href={localized(locale, "/contact")} className="btn btn-primary">{t.ctaBtn}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
