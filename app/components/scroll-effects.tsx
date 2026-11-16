"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Marks `[data-reveal]` elements with `.is-in` once they scroll into view; CSS does the
 * fade and slide. Content is only ever hidden under `html.js` with motion allowed, so it
 * stays readable without JavaScript or with reduced motion.
 */
export function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (!("IntersectionObserver" in window)) {
      targets.forEach(el => el.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: .12 });
    targets.forEach(el => observer.observe(el));
    // Keyboard users tabbing into hidden content should see it straight away.
    const reveal = (event: FocusEvent) => (event.target as Element | null)?.closest("[data-reveal]")?.classList.add("is-in");
    document.addEventListener("focusin", reveal);
    return () => { observer.disconnect(); document.removeEventListener("focusin", reveal); };
  }, [pathname]);

  return null;
}
