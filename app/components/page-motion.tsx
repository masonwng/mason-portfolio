"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Progressive enhancement: content stays readable if JavaScript or motion is off. */
export function PageMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const seen = new WeakSet<Element>();
    let observer: IntersectionObserver | undefined;
    let frame = 0;

    const cancel = () => {
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
    const reveal = (element: Element, delay = 0, returning = false) => {
      if (preference.matches || element.contains(document.activeElement)) return;
      const animation = element.animate(
        [{ opacity: returning ? .65 : 0, transform: `translateY(${returning ? 0 : 8}px)` },
          { opacity: 1, transform: "translateY(0)" }],
        { duration: returning ? 280 : 520, delay, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" },
      );
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    };
    const targets = () => Array.from(document.querySelectorAll(
      ".site-nav, main h1, main h2, main h3, main p, main figcaption, main li, main a, main summary, .site-footer",
    )).filter(element => !element.closest(".hero-pig, dialog") &&
      !element.parentElement?.closest("h1, h2, h3, p, li, summary"));
    const visible = (element: Element) => {
      const rect = element.getBoundingClientRect();
      return rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
    };
    const enter = () => {
      if (preference.matches) return;
      observer = new IntersectionObserver(entries => {
        let index = 0;
        entries.forEach(entry => {
          if (!entry.isIntersecting || seen.has(entry.target)) return;
          seen.add(entry.target);
          reveal(entry.target, Math.min(index++ * 35, 140));
          observer?.unobserve(entry.target);
        });
      }, { threshold: .08 });
      let index = 0;
      targets().forEach(element => {
        if (visible(element)) {
          seen.add(element);
          reveal(element, Math.min(index++ * 35, 210));
        } else observer?.observe(element);
      });
    };
    const visibility = () => {
      cancel();
      if (document.visibilityState === "visible") {
        targets().filter(visible).forEach(element => reveal(element, 0, true));
      }
    };
    const preferenceChanged = () => { cancel(); observer?.disconnect(); };
    // Wait for Next's route content to commit, including restored cached pages.
    frame = requestAnimationFrame(enter);
    document.addEventListener("visibilitychange", visibility);
    preference.addEventListener("change", preferenceChanged);
    return () => {
      cancelAnimationFrame(frame);
      cancel();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      preference.removeEventListener("change", preferenceChanged);
    };
  }, [pathname]);

  return null;
}
