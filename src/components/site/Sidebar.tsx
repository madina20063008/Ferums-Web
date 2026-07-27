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

function useTheme(): [string, (t: string) => void] {
  const [theme, setThemeState] = useState("dark");
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    setThemeState(current);
  }, []);
  const setTheme = (t: string) => {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("ferums-theme", t); } catch {}
    setThemeState(t);
  };
  return [theme, setTheme];
}

export function Sidebar({ locale, nav }: { locale: Locale; nav: NavData }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<string>("dark");
  const [t, setT] = useTheme();
  useEffect(() => setTheme(t), [t]);

  // Path without the leading /<locale> so we can swap languages in place.
  const rest = pathname.replace(/^\/(en|ru)(?=\/|$)/, "") || "";
  const other: Locale = locale === "en" ? "ru" : "en";

  // White wordmark for dark theme; dark-ink variant (…-dark.png) for light theme.
  // Both are rendered and toggled via CSS so it works before hydration.
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

  const linkStyle = (active: boolean): React.CSSProperties => ({
    display: "block", padding: "12px 14px", borderRadius: 10,
    fontSize: 15, fontWeight: 500,
    color: active ? "var(--accent)" : "var(--text-dim)",
    background: active ? "rgba(28,175,232,.12)" : "transparent",
  });

  const NavLinks = () => (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {nav.main.map((l) => (
          <Link key={l.href} href={localized(locale, l.href)} onClick={() => setOpen(false)} style={linkStyle(isActive(l.href))}>
            {l.label}
          </Link>
        ))}
      </div>
      <div className="eyebrow" style={{ marginTop: 30, padding: "0 14px" }}>{nav.companyLabel}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 10 }}>
        {nav.company.map((l) => (
          <Link key={l.href} href={localized(locale, l.href)} onClick={() => setOpen(false)} style={linkStyle(isActive(l.href))}>
            {l.label}
          </Link>
        ))}
      </div>
    </>
  );

  const Controls = () => (
    <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 16, paddingTop: 28 }}>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ display: "flex", gap: 2, padding: 3, border: "1px solid var(--border-strong)", borderRadius: 10 }}>
          <Link href={localized("en", rest)} scroll={false} className="mono" style={toggleBtn(locale === "en")}>EN</Link>
          <Link href={localized("ru", rest)} scroll={false} className="mono" style={toggleBtn(locale === "ru")}>RU</Link>
        </div>
        <div style={{ display: "flex", gap: 2, padding: 3, border: "1px solid var(--border-strong)", borderRadius: 10 }}>
          <button onClick={() => setT("dark")} title="Dark" style={{ ...toggleBtn(theme === "dark"), fontSize: 13 }}>☾</button>
          <button onClick={() => setT("light")} title="Light" style={{ ...toggleBtn(theme === "light"), fontSize: 13 }}>☀</button>
        </div>
      </div>
      <Link href={localized(locale, "/contact")} onClick={() => setOpen(false)} className="btn btn-primary" style={{ width: "100%" }}>
        {nav.contactCta}
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
        <Link href={localized(locale, "/")} style={{ display: "block", padding: "0 10px", marginBottom: 40 }} aria-label={nav.siteName}>
          {renderLogo(160, 80, 72, true)}
        </Link>
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
