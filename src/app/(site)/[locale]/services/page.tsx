import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, pick, field, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getServices } from "@/lib/site-data";

// Faithful port of Solutions.dc.html. Static hero copy is bilingual below; the
// services list comes from the DB so the admin can manage it.
const T = {
  en: {
    label: "Services",
    title: "From selection to lifecycle support.",
    intro:
      "Six service lines, one engineering standard. Every FERUMS delivery is specified, inspected and supported through its full lifecycle.",
  },
  ru: {
    label: "Услуги",
    title: "От подбора оборудования до сопровождения всего жизненного цикла",
    intro:
      "Шесть сервисных направлений — единый инженерный стандарт. Каждая поставка FERUMS проходит этапы технического подбора, инспекции и сопровождения на всех стадиях жизненного цикла оборудования.",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const t = T[loc];
  return buildMetadata({ locale: loc, path: "/services", title: t.title, description: t.intro });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = T[locale];
  const services = await getServices();

  return (
    <>
      {/* Hero */}
      <header className="section">
        <div className="container">
          <div className="eyebrow reveal">{t.label}</div>
          <h1 className="h1 reveal">{t.title}</h1>
          <p
            className="reveal"
            style={{ marginTop: 22, fontSize: 16, lineHeight: 1.6, color: "var(--text)", opacity: 0.82, maxWidth: 640 }}
          >
            {t.intro}
          </p>
        </div>
      </header>

      {/* Service list */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {services.map((s) => {
            const items = (s.items as unknown as { en: string; ru: string }[]) || [];
            return (
              <div
                key={s.id}
                className="reveal card card-hover split-2"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.2fr",
                  borderRadius: 20,
                  overflow: "hidden",
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="svc-img" style={{ overflow: "hidden", minHeight: 320 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.image}
                    alt={field(s, "title", locale)}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className="svc-content" style={{ padding: "48px 56px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h2 style={{ margin: 0, fontSize: "clamp(20px,4.2vw,32px)", fontWeight: 600, letterSpacing: "-.01em", color: "var(--text)" }}>
                    {field(s, "title", locale)}
                  </h2>
                  <p style={{ margin: "16px 0 0", fontSize: 15, lineHeight: 1.75, color: "var(--text)", opacity: 0.82 }}>
                    {field(s, "desc", locale)}
                  </p>
                  {items.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 }}>
                      {items.map((item, i) => (
                        <span
                          key={i}
                          className="mono"
                          style={{ padding: "7px 14px", borderRadius: 99, border: "1px solid var(--border-strong)", fontSize: 12, color: "var(--text)" }}
                        >
                          {pick(item, locale)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
