"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Progressive scroll-reveal: adds `.in` to every `.reveal` as it enters view.
// Re-runs on every route change (App Router keeps this component mounted across
// client-side navigations, so without the `pathname` dependency the new page's
// `.reveal` elements would never be observed and would stay invisible until a
// full refresh). No-op for users who prefer reduced motion (CSS shows them).
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.in)"));
    if (els.length === 0) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
