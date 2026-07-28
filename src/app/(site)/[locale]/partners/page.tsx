import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, pick, field, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getSite, getPartners } from "@/lib/site-data";
import { PageHeader } from "@/components/site/ui";

const TITLE = { en: "Partners", ru: "Партнёры" };
const LEAD = {
  en: "FERUMS represents and works with leading global manufacturers of valves, instrumentation, rotating equipment and bearings.",
  ru: "FERUMS представляет и сотрудничает с ведущими мировыми производителями арматуры, КИП, вращающегося оборудования и подшипников.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  return buildMetadata({ locale: loc, path: "/partners", title: pick(TITLE, loc), description: pick(LEAD, loc) });
}

export default async function PartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [site, partners] = await Promise.all([getSite(), getPartners()]);
  void site;

  return (
    <>
      <PageHeader eyebrow={pick({ en: "Global network", ru: "Глобальная сеть" }, locale)} title={pick(TITLE, locale)} lead={pick(LEAD, locale)} video="partners" />

      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
            {partners.map((p) => {
              const country = field(p, "country", locale);
              const card = (
                <>
                  <div style={{ background: "#fff", borderRadius: 12, height: 120, display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}>
                    {p.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.logo} alt={p.name} loading="lazy" style={{ maxHeight: 84, maxWidth: "100%", objectFit: "contain" }} />
                    ) : (
                      <span style={{ fontWeight: 700, fontSize: 20, color: "#10141C" }}>{p.name}</span>
                    )}
                  </div>
                  <div style={{ padding: "16px 18px" }}>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{p.name}</div>
                    {country && <div className="mono" style={{ marginTop: 4, fontSize: 12, color: "var(--text-faint)" }}>{country}</div>}
                  </div>
                </>
              );
              return p.url ? (
                <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className="card card-hover reveal" style={{ overflow: "hidden" }}>
                  {card}
                </a>
              ) : (
                <div key={p.id} className="card card-hover reveal" style={{ overflow: "hidden" }}>
                  {card}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
