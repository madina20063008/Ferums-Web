import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localized } from "@/lib/nav";

// Page hero: mono eyebrow + big H1 + optional lead. Reused across every page.
export function PageHeader({ eyebrow, title, lead }: { eyebrow?: string; title: string; lead?: string }) {
  return (
    <header className="section" style={{ paddingBottom: 40 }}>
      <div className="container">
        {eyebrow && <div className="eyebrow reveal" style={{ marginBottom: 18 }}>{eyebrow}</div>}
        <h1 className="h1 reveal">{title}</h1>
        {lead && <p className="lead reveal" style={{ marginTop: 22, maxWidth: 720 }}>{lead}</p>}
      </div>
    </header>
  );
}

export function Section({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section className="section" style={style}>
      <div className="container">{children}</div>
    </section>
  );
}

export function SectionTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="reveal" style={{ marginBottom: 40, maxWidth: 760 }}>
      {eyebrow && <div className="eyebrow" style={{ marginBottom: 14 }}>{eyebrow}</div>}
      <h2 className="h2">{title}</h2>
      {subtitle && <p className="lead" style={{ marginTop: 16 }}>{subtitle}</p>}
    </div>
  );
}

// Lazy content image with a consistent frame.
export function Media({ src, alt, ratio = "16 / 10", radius = 16 }: { src: string; alt: string; ratio?: string; radius?: number }) {
  return (
    <div style={{ aspectRatio: ratio, borderRadius: radius, overflow: "hidden", background: "var(--surface-2)" }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : null}
    </div>
  );
}

export function TextLink({ locale, href, children }: { locale: Locale; href: string; children: React.ReactNode }) {
  return (
    <Link href={localized(locale, href)} className="mono" style={{ color: "var(--accent)", fontSize: 13, letterSpacing: "0.04em" }}>
      {children} →
    </Link>
  );
}
