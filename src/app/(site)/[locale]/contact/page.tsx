import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, pick, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getSite } from "@/lib/site-data";
import { PageHeader } from "@/components/site/ui";
import { ContactForm } from "@/components/site/ContactForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const site = await getSite();
  return buildMetadata({
    locale: loc,
    path: "/contact",
    title: pick(site.contact.title, loc),
    description: pick(site.contact.lead, loc),
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const site = await getSite();
  const c = site.contact;

  return (
    <>
      <PageHeader title={pick(c.title, locale)} lead={pick(c.lead, locale)} />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 44, alignItems: "start" }} className="two-col">
            <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {c.offices.map((o, i) => (
                <div key={i} className="card" style={{ padding: "24px 22px" }}>
                  <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 600 }}>{pick(o.city, locale)}</h3>
                  <p style={{ margin: 0, color: "var(--text-dim)", fontSize: 14, lineHeight: 1.6 }}>{pick(o.address, locale)}</p>
                  {o.phone && (
                    <div className="mono" style={{ marginTop: 12, fontSize: 13, color: "var(--text-dim)" }}>{o.phone}</div>
                  )}
                  {o.email && (
                    <a href={`mailto:${o.email}`} className="mono" style={{ display: "inline-block", marginTop: 6, fontSize: 13, color: "var(--accent)" }}>{o.email}</a>
                  )}
                </div>
              ))}
            </div>
            <div className="reveal">
              <ContactForm locale={locale} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
