"use client";

import { useEffect } from "react";

// Applies the saved theme ("ferums-theme" in localStorage, else OS preference)
// on mount. Done in a client effect instead of an inline <script> so React
// never renders a <script> element in the tree (which warns on re-render).
export function ThemeScript() {
  useEffect(() => {
    try {
      // Light theme temporarily disabled — force dark for everyone until it's
      // finalized. (Restore `localStorage.getItem("ferums-theme") || "dark"` later.)
      document.documentElement.setAttribute("data-theme", "dark");
    } catch {}
  }, []);
  return null;
}
