"use client";

import { useEffect } from "react";

// Injects a JSON-LD structured-data block into <head> on mount. Done via the DOM
// (not a rendered <script> element) so React never reconciles a <script> tag —
// which triggers a "script inside a component" warning on re-render (e.g. when
// switching locale). Search engines execute JS and read injected JSON-LD.
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const json = JSON.stringify(data);
  useEffect(() => {
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.text = json;
    document.head.appendChild(el);
    return () => { el.remove(); };
  }, [json]);
  return null;
}
