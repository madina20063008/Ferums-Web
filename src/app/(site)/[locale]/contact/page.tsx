import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/site/ContactForm";

// Faithful port of Contact.dc.html. All copy is static bilingual below; the form
// is the ContactForm client component, which submits to /api/contact-submissions.
const T = {
  en: {
    label: "Contact",
    title: "Let's discuss your project.",
    intro:
      "Tell us what you're building. An engineer — not a call center — will respond within one business day.",
    offices: [
      { city: "Guangzhou", name: "FERUMS Group Company — Manufacture Plant", address: "No. 12, Yunkai Road, Huangpu District, Guangzhou, China", email: "Email: office@ferums.com", phone: "Phone: 86-1890366789371" },
      { city: "Tashkent", name: "FERUMS Sales Office", address: "Amir Temur street, Bld 107A, Tashkent city, Uzbekistan", email: "Email: office@ferums.com", phone: "Phone: +99890 312 0100" },
      { city: "Kuala Lumpur", name: "FERUMS Sales Office", address: "Business Center Berjaya Central, Kuala Lumpur, Malaysia", email: "Email: office@ferums.com", phone: "Phone: +60 1139029480" },
    ],
  },
  ru: {
    label: "Контакты",
    title: "Обсудим ваш проект.",
    intro:
      "Расскажите, что вы строите. Ответит инженер — не колл-центр — в течение одного рабочего дня.",
    offices: [
      { city: "Гуанчжоу", name: "Группа компаний FERUMS — Производственный комплекс", address: "№ 12, ул. Юнькай, район Хуанпу, г. Гуанчжоу, Китай", email: "Электронная почта: office@ferums.com", phone: "Телефон: +86 189 0366 789371" },
      { city: "Ташкент", name: "Офис продаж FERUMS", address: "Республика Узбекистан, г. Ташкент, ул. Амира Темура, 107А", email: "Электронная почта: office@ferums.com", phone: "Телефон: +998 90 312 0100" },
      { city: "Куала-Лумпур", name: "Офис продаж FERUMS", address: "Бизнес-центр Berjaya Central, г. Куала-Лумпур, Малайзия", email: "Электронная почта: office@ferums.com", phone: "Телефон: +60 11 3902 9480" },
    ],
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const t = T[loc];
  return buildMetadata({ locale: loc, path: "/contact", title: t.title, description: t.intro });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = T[locale];

  return (
    <section className="section">
      <div
        className="container contact-2 split-2"
        style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 100, alignItems: "start" }}
      >
        {/* Left: intro + offices */}
        <div>
          <div className="eyebrow reveal" style={{ marginBottom: 24 }}>{t.label}</div>
          <h1 className="h1 reveal" style={{ fontSize: "clamp(30px,4vw,48px)" }}>{t.title}</h1>
          <p className="reveal" style={{ margin: "28px 0 0", fontSize: 15, lineHeight: 1.7, color: "var(--text-dim)", maxWidth: 460 }}>{t.intro}</p>
          <div className="reveal" style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 28 }}>
            {t.offices.map((o, i) => (
              <div
                key={i}
                className="stack-sm"
                style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 24, borderTop: "1px solid var(--border)", paddingTop: 24 }}
              >
                <span className="mono" style={{ fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--green)" }}>{o.city}</span>
                <span style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 15, lineHeight: 1.55, color: "var(--text-dim)" }}>
                  <span style={{ color: "var(--text)", fontWeight: 600 }}>{o.name}</span>
                  <span>{o.address}</span>
                  <span>{o.email}</span>
                  <span>{o.phone}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form card */}
        <div className="reveal card" style={{ padding: 56, borderRadius: 24, height: "fit-content" }}>
          <ContactForm locale={locale} />
        </div>
      </div>
    </section>
  );
}
