"use client";

import { useEffect } from "react";

// Applies the saved theme ("ferums-theme" in localStorage, else OS preference)
// on mount. Done in a client effect instead of an inline <script> so React
// never renders a <script> element in the tree (which warns on re-render).
export function ThemeScript() {
  useEffect(() => {
    try {
      let t = localStorage.getItem("ferums-theme");
      if (!t) t = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", t);
    } catch {}
  }, []);
  return null;
}
