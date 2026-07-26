"use client";

import { useState } from "react";
import { UI, type Locale } from "@/lib/i18n";

export function ContactForm({ locale }: { locale: Locale }) {
  const t = UI[locale].form;
  const [state, setState] = useState({ name: "", email: "", company: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  const set = (k: keyof typeof state) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setState((s) => ({ ...s, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      setState({ name: "", email: "", company: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="card" style={{ padding: 28, borderColor: "rgba(28,175,232,.4)" }}>
        <p style={{ margin: 0, fontSize: 16 }}>{t.success}</p>
      </div>
    );
  }

  const input: React.CSSProperties = {
    width: "100%", padding: "13px 14px", borderRadius: 12,
    background: "var(--surface)", border: "1px solid var(--border-strong)",
    color: "var(--text)", fontSize: 15, fontFamily: "inherit", outline: "none",
  };

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="form-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <input required placeholder={t.name} value={state.name} onChange={set("name")} style={input} />
        <input required type="email" placeholder={t.email} value={state.email} onChange={set("email")} style={input} />
        <input placeholder={t.company} value={state.company} onChange={set("company")} style={input} />
        <input placeholder={t.phone} value={state.phone} onChange={set("phone")} style={input} />
      </div>
      <textarea required placeholder={t.message} value={state.message} onChange={set("message")} rows={5} style={{ ...input, resize: "vertical" }} />
      {status === "error" && <span style={{ color: "#ff6b6b", fontSize: 14 }}>{t.error}</span>}
      <button type="submit" disabled={status === "sending"} className="btn btn-primary" style={{ alignSelf: "flex-start", opacity: status === "sending" ? 0.6 : 1 }}>
        {status === "sending" ? t.sending : t.send}
      </button>
    </form>
  );
}
