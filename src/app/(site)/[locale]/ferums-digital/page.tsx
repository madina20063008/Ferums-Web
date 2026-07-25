import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, pick, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getSite } from "@/lib/site-data";
import { PageHeader, SectionTitle } from "@/components/site/ui";

type Bi = { en: string; ru: string };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const site = await getSite();
  return buildMetadata({
    locale: loc,
    path: "/ferums-digital",
    title: pick(site.ferumsDigital.title, loc),
    description: pick(site.ferumsDigital.lead, loc),
  });
}

function ChipGroup({ title, items, locale }: { title: string; items: Bi[]; locale: Locale }) {
  if (items.length === 0) return null;
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <SectionTitle title={title} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {items.map((it, i) => <span key={i} className="chip">{pick(it, locale)}</span>)}
        </div>
      </div>
    </section>
  );
}

export default async function FerumsDigitalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const site = await getSite();
  const d = site.ferumsDigital;

  return (
    <>
      <PageHeader title={pick(d.title, locale)} lead={pick(d.lead, locale)} />

      <ChipGroup title={pick({ en: "AI applications", ru: "ИИ-приложения" }, locale)} items={d.aiApps} locale={locale} />
      <ChipGroup title={pick({ en: "Platforms", ru: "Платформы" }, locale)} items={d.platforms} locale={locale} />
      <ChipGroup title={pick({ en: "Equipment AI", ru: "ИИ для оборудования" }, locale)} items={d.equipmentAi} locale={locale} />
      <ChipGroup title={pick({ en: "Engineering areas", ru: "Инженерные направления" }, locale)} items={d.engineeringAreas} locale={locale} />

      {d.customDev.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <SectionTitle title={pick({ en: "Custom development", ru: "Индивидуальная разработка" }, locale)} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {d.customDev.map((c, i) => <span key={i} className="chip">{c}</span>)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
