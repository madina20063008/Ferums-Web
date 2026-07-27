"use client";

import { useCallback, useEffect, useState } from "react";

// Opening animation ported from the design (#frm-intro): a logo "forge" with a
// glowing dot, pulse ring, drifting particles, grid and slogan, then a zoom-out.
// Shows once per browser session (sessionStorage) — add ?intro=1 to force it.
export function IntroOverlay() {
  const [show, setShow] = useState(false);
  const [particles, setParticles] = useState<React.CSSProperties[]>([]);

  const dismiss = useCallback(() => {
    setShow(false);
    document.body.style.overflow = "";
    try { sessionStorage.setItem("ferums-intro-seen", "1"); } catch {}
  }, []);

  useEffect(() => {
    let seen = false;
    try { seen = !!sessionStorage.getItem("ferums-intro-seen"); } catch {}
    const force = location.search.includes("intro=1");
    if (seen && !force) return;

    const ps: React.CSSProperties[] = [];
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 120 + Math.random() * 340;
      ps.push({
        position: "absolute", left: "50%", top: "50%",
        width: 2 + Math.random() * 3, height: 2 + Math.random() * 3, borderRadius: "50%",
        background: Math.random() > 0.5 ? "rgba(94,160,255,.9)" : "rgba(255,255,255,.8)",
        opacity: 0,
        ["--dx" as string]: `${Math.round(Math.cos(a) * r)}px`,
        ["--dy" as string]: `${Math.round(Math.sin(a) * r)}px`,
        animation: `introDrift ${(2.2 + Math.random() * 2).toFixed(2)}s ease-out ${(0.4 + Math.random() * 1.6).toFixed(2)}s forwards`,
      } as React.CSSProperties);
    }
    setParticles(ps);
    setShow(true);
    document.body.style.overflow = "hidden";
  }, []);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(dismiss, 5800); // safety net past the ~5.5s zoom-out
    return () => { window.removeEventListener("keydown", onKey); clearTimeout(t); };
  }, [show, dismiss]);

  if (!show) return null;

  return (
    <div id="frm-intro" onClick={dismiss}
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#050506", overflow: "hidden", cursor: "pointer", color: "rgba(255,255,255,.92)" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0, backgroundImage: "linear-gradient(rgba(94,160,255,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(94,160,255,.25) 1px,transparent 1px)", backgroundSize: "80px 80px", animation: "introGrid 1.2s ease 3.6s forwards" }} />
      <div style={{ position: "absolute", inset: 0 }}>
        {particles.map((st, i) => <span key={i} style={st} />)}
      </div>
      <div
        onAnimationEnd={(e) => { if (e.animationName === "introZoom") dismiss(); }}
        style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36, animation: "introZoom 1s cubic-bezier(.7,0,.84,0) 4.5s forwards" }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 12, height: 12, margin: "-6px 0 0 -6px", borderRadius: "50%", background: "#fff", boxShadow: "0 0 60px 30px rgba(94,160,255,.55),0 0 24px 10px rgba(255,255,255,.9)", animation: "introDot 1.4s ease-out forwards" }} />
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 340, height: 340, border: "1px solid rgba(94,160,255,.55)", borderRadius: "50%", opacity: 0, animation: "introPulse 1.4s ease-out 3.8s forwards" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/uploads/1.png" alt="FERUMS" style={{ width: "min(420px,60vw)", opacity: 0, animation: "introForge 2.4s cubic-bezier(.16,1,.3,1) 1s forwards" }} />
        <div className="mono" style={{ fontSize: 15, letterSpacing: ".42em", textTransform: "uppercase", color: "rgba(255,255,255,.75)", opacity: 0, animation: "introSlogan 1s cubic-bezier(.16,1,.3,1) 3.3s forwards", textAlign: "center" }}>
          Core Strength.&nbsp;&nbsp;Future Energy.
        </div>
      </div>
    </div>
  );
}
