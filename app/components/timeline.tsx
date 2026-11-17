"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { m, useReducedMotion, useScroll, useSpring } from "motion/react";

/**
 * A vertical rail that fills as you scroll through the list. Each `.tl-item` lights up
 * (data-lit) once its top passes the middle of the viewport, and dims again above it.
 */
export function Timeline({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 50%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: .001 });

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".tl-item"));
    const update = () => {
      const line = window.innerHeight * .55;
      for (const item of items) item.dataset.lit = String(item.getBoundingClientRect().top < line);
    };
    let frame = 0;
    const schedule = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; update(); }); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);

  return (
    <div ref={ref} className={`timeline ${className}`.trim()}>
      <span className="timeline-rail" aria-hidden="true"><m.span className="timeline-fill" style={{ scaleY: reduce ? scrollYProgress : fill }} /></span>
      {children}
    </div>
  );
}
