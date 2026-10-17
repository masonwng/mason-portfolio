"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Content stays visible without JavaScript; only offscreen sections are armed.
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    element.classList.add("reveal-waiting");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { element.classList.remove("reveal-waiting"); observer.disconnect(); }
    }, { rootMargin: "0px 0px 40px 0px", threshold: 0 });
    observer.observe(element);
    return () => { observer.disconnect(); element.classList.remove("reveal-waiting"); };
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}
