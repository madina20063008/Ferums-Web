"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
const HeadsetIcon = <svg viewBox="0 0 24 24" width="20" height="20" {...IP}><path d="M4 13a8 8 0 0 1 16 0" /><rect x="3" y="13" width="4" height="6" rx="1.4" /><rect x="17" y="13" width="4" height="6" rx="1.4" /><path d="M20 19a3 3 0 0 1-3 3h-3" /></svg>;
const SearchIcon = <svg viewBox="0 0 24 24" width="18" height="18" {...IP}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>;
const MenuIcon = <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
const CloseIcon = <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>;

// Live-filter search over the menu items; suggestions navigate on click.
function SearchBox({
  items, placeholder, onGo, inputRef,
}: {
  items: { label: string; href: string }[];
  placeholder: string;
  onGo: (href: string) => void;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  const [q, setQ] = useState("");
  const ql = q.trim().toLowerCase();
  const results = ql ? items.filter((i) => i.label.toLowerCase().includes(ql)).slice(0, 6) : [];
  return (
    <div className="side-search">
      <div className="side-search-field">
        <span className="side-search-ico">{SearchIcon}</span>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && results[0]) { setQ(""); onGo(results[0].href); } }}
          placeholder={placeholder}
          aria-label={placeholder}
        />
      </div>
      {results.length > 0 && (
        <ul className="side-search-list">
          {results.map((r) => (
            <li key={r.href}>
              <button type="button" onClick={() => { setQ(""); onGo(r.href); }}>{r.label}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Sidebar({ locale, nav }: { locale: Locale; nav: NavData }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);      // mobile drawer
  const searchRef = useRef<HTMLInputElement>(null);
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

  // Desktop: clicking anywhere outside the sidebar collapses the expanded panel.
  useEffect(() => {
    if (collapsed) return;
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches) return;
    const onDown = (e: MouseEvent) => {
      const nav = document.querySelector(".site-sidebar");
      if (nav && !nav.contains(e.target as Node)) setCollapsed(true);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
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

  // Clicking a menu entry gently closes the rail (the width transition animates
  // it shut) and closes the mobile drawer.
  const closeAfterNav = () => { setOpen(false); setCollapsed(true); };
  const goTo = (href: string) => { closeAfterNav(); router.push(localized(locale, href)); };
  // Expand from the collapsed rail's search icon, then focus the field.
  const expandAndSearch = () => {
    setCollapsed(false);
    setTimeout(() => searchRef.current?.focus(), 80);
  };

  // Everything searchable from the menu.
  const searchItems = [...nav.main, ...nav.company, { label: nav.contactCta, href: "/contact" }];

  const isActive = (href: string) => {
    const full = localized(locale, href);
    return pathname === full || pathname.startsWith(full + "/");
  };

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={localized(locale, href)}
      onClick={closeAfterNav}
      title={label}
      className={`side-link${isActive(href) ? " active" : ""}`}
    >
      <span className="side-ico">{iconFor(href)}</span>
      <span className="side-label">{label}</span>
    </Link>
  );

  return (
    <>
      {/* Persistent brand mark over the hero — shown on every page (desktop),
          hidden while the panel is expanded (the panel carries its own logo). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <Link className="site-brandmark" href={localized(locale, "/")} aria-label={nav.siteName}><img src="/uploads/1.png" alt={nav.siteName} /></Link>

      {/* Mobile top bar */}
      <div className="site-topbar">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Link href={localized(locale, "/")} aria-label={nav.siteName}><img src={nav.logo} alt={nav.siteName} style={{ height: 34, width: "auto" }} /></Link>
        <button onClick={() => setOpen(true)} aria-label="Menu" className="site-topbar-menu">{MenuIcon}</button>
      </div>

      {open && <div onClick={() => setOpen(false)} className="site-scrim" />}

      <nav className={`site-sidebar${open ? " open" : ""}`} aria-label="Primary">
        {/* ── Persistent icon rail: search (top) · toggle ☰/✕ (middle) · contact (bottom) ── */}
        <div className="side-rail">
          <button className="rail-btn" onClick={expandAndSearch} aria-label="Search" title="Search">{SearchIcon}</button>
          <button
            className="rail-btn rail-toggle"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Open menu" : "Close menu"}
            title={collapsed ? "Menu" : "Close"}
          >
            {collapsed ? MenuIcon : CloseIcon}
          </button>
          <Link className="rail-btn rail-contact" href={localized(locale, "/contact")} onClick={closeAfterNav} aria-label={nav.contactCta} title={nav.contactCta}>{HeadsetIcon}</Link>
        </div>

        {/* ── Expanded panel: FERUMS logo + full navigation ── */}
        <div className="side-panel">
          <div className="side-panel-head">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Link className="side-brand" href={localized(locale, "/")} onClick={closeAfterNav} aria-label={nav.siteName}><img src="/uploads/1.png" alt={nav.siteName} /></Link>
            <button className="side-panel-close" onClick={() => setOpen(false)} aria-label="Close menu" title="Close">{CloseIcon}</button>
          </div>

          <SearchBox items={searchItems} placeholder={locale === "ru" ? "Поиск" : "Search"} onGo={goTo} inputRef={searchRef} />

          <div className="side-group side-group-first">
            {nav.main.map((l) => <NavLink key={l.href} href={l.href} label={l.label} />)}
          </div>

          <div className="side-section">{nav.companyLabel}</div>
          <div className="side-group">
            {nav.company.map((l) => <NavLink key={l.href} href={l.href} label={l.label} />)}
          </div>

          <div className="side-controls">
            <div className="side-langs">
              <Link href={localized("en", rest)} scroll={false} onClick={keepOpenAcrossNav} className="mono" style={toggleBtn(locale === "en")}>EN</Link>
              <Link href={localized("ru", rest)} scroll={false} onClick={keepOpenAcrossNav} className="mono" style={toggleBtn(locale === "ru")}>RU</Link>
            </div>
            <Link href={localized(locale, "/contact")} onClick={closeAfterNav} title={nav.contactCta} className="btn btn-primary side-contact">
              <span className="side-ico">{HeadsetIcon}</span>
              <span className="side-label">{nav.contactCta}</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

function toggleBtn(active: boolean): React.CSSProperties {
  return {
    border: "none", cursor: "pointer",
    padding: "6px 12px", borderRadius: 8, fontSize: 12,
    background: active ? "var(--accent)" : "transparent",
    color: active ? "#fff" : "rgba(255,255,255,0.6)",
  };
}
