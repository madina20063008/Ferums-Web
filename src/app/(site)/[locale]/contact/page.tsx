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
      { city: "Astana", detail: "Headquarters · Placeholder address, Kazakhstan · +7 (000) 000-00-00" },
      { city: "Dubai", detail: "Middle East hub · Placeholder address, UAE" },
      { city: "Frankfurt", detail: "European hub · Placeholder address, Germany" },
    ],
  },
  ru: {
    label: "Контакты",
    title: "Обсудим ваш проект.",
    intro:
      "Расскажите, что вы строите. Ответит инженер — не колл-центр — в течение одного рабочего дня.",
    offices: [
      { city: "Астана", detail: "Штаб-квартира · Адрес-заполнитель, Казахстан · +7 (000) 000-00-00" },
      { city: "Дубай", detail: "Ближневосточный хаб · Адрес-заполнитель, ОАЭ" },
      { city: "Франкфурт", detail: "Европейский хаб · Адрес-заполнитель, Германия" },
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
          <h1 className="h1 reveal">{t.title}</h1>
          <p className="reveal" style={{ margin: "28px 0 0", fontSize: 15, lineHeight: 1.7, color: "var(--text-dim)", maxWidth: 460 }}>{t.intro}</p>
          <div className="reveal" style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 28 }}>
            {t.offices.map((o, i) => (
              <div
                key={i}
                className="stack-sm"
                style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 24, borderTop: "1px solid var(--border)", paddingTop: 24 }}
              >
                <span className="mono" style={{ fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--green)" }}>{o.city}</span>
                <span style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-dim)" }}>{o.detail}</span>
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
