"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { localized } from "@/lib/nav";

export interface NavData {
  logo: string;
  siteName: string;
  main: { label: string; href: string }[];
  company: { label: string; href: string }[];
  companyLabel: string;
  contactCta: string;
}

// ── Nav icons, keyed by the path they belong to ─────────────────────────────
const IP = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const NAV_ICONS: { match: string; icon: React.ReactNode }[] = [
  { match: "/industries", icon: <svg viewBox="0 0 24 24" width="20" height="20" {...IP}><path d="M3 21h18M4 21V10l5 3.2V10l5 3.2V6l5 3.2V21" /></svg> },
  { match: "/services", icon: <svg viewBox="0 0 24 24" width="20" height="20" {...IP}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></svg> },
  { match: "/products", icon: <svg viewBox="0 0 24 24" width="20" height="20" {...IP}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><path d="M4 7.5l8 4.5 8-4.5M12 12v9" /></svg> },
  { match: "/projects", icon: <svg viewBox="0 0 24 24" width="20" height="20" {...IP}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg> },
  { match: "/ferums-digital", icon: <svg viewBox="0 0 24 24" width="20" height="20" {...IP}><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9" y="9" width="6" height="6" rx="1" /><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" /></svg> },
  { match: "/about", icon: <svg viewBox="0 0 24 24" width="20" height="20" {...IP}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg> },
  { match: "/partners", icon: <svg viewBox="0 0 24 24" width="20" height="20" {...IP}><circle cx="8" cy="8" r="3" /><path d="M2 20v-1a5 5 0 0 1 5-5h1" /><circle cx="16" cy="8" r="3" /><path d="M22 20v-1a5 5 0 0 0-5-5h-1" /></svg> },
  { match: "/sustainability", icon: <svg viewBox="0 0 24 24" width="20" height="20" {...IP}><path d="M11 20A7 7 0 0 1 4 13C4 7 12 4 19 4c0 8-4 12-8 12z" /><path d="M5 20c2.5-4 6-6.5 10-8" /></svg> },
  { match: "/news", icon: <svg viewBox="0 0 24 24" width="20" height="20" {...IP}><rect x="3" y="5" width="15" height="15" rx="1.5" /><path d="M18 8h3v9a2 2 0 0 1-2 2M6 9h9M6 13h9M6 17h5" /></svg> },
  { match: "/careers", icon: <svg viewBox="0 0 24 24" width="20" height="20" {...IP}><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></svg> },
];
function iconFor(href: string): React.ReactNode {
  const hit = NAV_ICONS.find((n) => href.includes(n.match));
  return hit ? hit.icon : <svg viewBox="0 0 24 24" width="20" height="20" {...IP}><circle cx="12" cy="12" r="3" /></svg>;
}
const MailIcon = <svg viewBox="0 0 24 24" width="20" height="20" {...IP}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>;

export function Sidebar({ locale, nav }: { locale: Locale; nav: NavData }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);      // mobile drawer
  // Desktop icon rail: collapsed by default. A language switch remounts this
  // layout; the lazy initializer reads a one-shot flag (set on the EN/RU click)
  // so it mounts ALREADY expanded — no collapse→expand flash. On the initial SSR
  // render window is undefined, so a fresh visit/reload always starts collapsed.
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      if (typeof window !== "undefined" && sessionStorage.getItem("ferums-sidebar-keepopen") === "1") {
        sessionStorage.removeItem("ferums-sidebar-keepopen");
        return false;
      }
    } catch {}
    return true;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-sidebar", collapsed ? "collapsed" : "expanded");
  }, [collapsed]);
  const keepOpenAcrossNav = () => {
    // Read the live attribute (source of truth) rather than the React closure,
    // so it can't be stale if the click follows an expand very quickly.
    try {
      if (document.documentElement.getAttribute("data-sidebar") === "expanded") {
        sessionStorage.setItem("ferums-sidebar-keepopen", "1");
      }
    } catch {}
  };

  const rest = pathname.replace(/^\/(en|ru)(?=\/|$)/, "") || "";

  const logoDark = nav.logo;
  const logoLight = nav.logo.replace(/(\.[a-z0-9]+)$/i, "-dark$1");
  const renderLogo = (w: number, h: number, hpx: number, priority = false) => (
    <>
      <Image className="logo-on-dark" src={logoDark} alt={nav.siteName} width={w} height={h} priority={priority} style={{ height: hpx, width: "auto" }} />
      <Image className="logo-on-light" src={logoLight} alt={nav.siteName} width={w} height={h} priority={priority} style={{ height: hpx, width: "auto" }} />
    </>
  );

  const isActive = (href: string) => {
    const full = localized(locale, href);
    return pathname === full || pathname.startsWith(full + "/");
  };

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={localized(locale, href)}
      onClick={() => setOpen(false)}
      title={label}
      className={`side-link${isActive(href) ? " active" : ""}`}
    >
      <span className="side-ico">{iconFor(href)}</span>
      <span className="side-label">{label}</span>
    </Link>
  );

  const NavLinks = () => (
    <>
      <div className="side-group">
        {nav.main.map((l) => <NavLink key={l.href} href={l.href} label={l.label} />)}
      </div>
      <div className="eyebrow side-section" style={{ marginTop: 26, padding: "0 14px" }}>{nav.companyLabel}</div>
      <div className="side-group" style={{ marginTop: 8 }}>
        {nav.company.map((l) => <NavLink key={l.href} href={l.href} label={l.label} />)}
      </div>
    </>
  );

  const Controls = () => (
    <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 14, paddingTop: 24 }}>
      <div className="side-langs" style={{ gap: 2, padding: 3, border: "1px solid var(--border-strong)", borderRadius: 10, alignSelf: "flex-start" }}>
        <Link href={localized("en", rest)} scroll={false} onClick={keepOpenAcrossNav} className="mono" style={toggleBtn(locale === "en")}>EN</Link>
        <Link href={localized("ru", rest)} scroll={false} onClick={keepOpenAcrossNav} className="mono" style={toggleBtn(locale === "ru")}>RU</Link>
      </div>
      <Link href={localized(locale, "/contact")} onClick={() => setOpen(false)} title={nav.contactCta} className="btn btn-primary side-contact">
        <span className="side-ico">{MailIcon}</span>
        <span className="side-label">{nav.contactCta}</span>
      </Link>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="site-topbar">
        <Link href={localized(locale, "/")} aria-label={nav.siteName}>
          {renderLogo(120, 40, 40)}
        </Link>
        <button onClick={() => setOpen(true)} aria-label="Menu" style={{ background: "none", border: "none", color: "var(--text)", fontSize: 26, cursor: "pointer" }}>☰</button>
      </div>

      {open && <div onClick={() => setOpen(false)} className="site-scrim" />}

      <nav className={`site-sidebar${open ? " open" : ""}`} aria-label="Primary">
        {/* Logo / collapse toggle */}
        <div className="side-logo-row">
          {/* Collapsed: the "F" mark — click to expand */}
          <button className="side-logo-mark" onClick={() => setCollapsed(false)} aria-label="Expand menu" title="Expand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/uploads/f-mark.png" alt="FERUMS" style={{ height: 28, width: "auto" }} />
          </button>
          {/* Expanded (and mobile): full wordmark + collapse chevron */}
          <Link href={localized(locale, "/")} className="side-logo-full" aria-label={nav.siteName}>
            {renderLogo(160, 80, 64, true)}
          </Link>
          <button className="side-collapse" onClick={() => setCollapsed(true)} aria-label="Collapse menu" title="Collapse">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 17l-5-5 5-5M11 17l-5-5 5-5" /></svg>
          </button>
          {/* Collapsed: expand chevron under the F mark */}
          <button className="side-expand" onClick={() => setCollapsed(false)} aria-label="Expand menu" title="Expand">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 17l5-5-5-5M13 17l5-5-5-5" /></svg>
          </button>
        </div>

        <NavLinks />
        <Controls />
      </nav>
    </>
  );
}

function toggleBtn(active: boolean): React.CSSProperties {
  return {
    border: "none", cursor: "pointer",
    padding: "6px 12px", borderRadius: 8, fontSize: 12,
    background: active ? "var(--accent)" : "transparent",
    color: active ? "#fff" : "var(--text-dim)",
  };
}
