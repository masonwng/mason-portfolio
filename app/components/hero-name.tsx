"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const TEXT = "hey, I’m Mason Wang.";

/**
 * The hero heading. Letters rise in one by one on load (pure CSS, so it plays before
 * hydration), then lean toward the cursor while it's nearby. Transforms only.
 */
export function HeroName() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const fancy = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const letters = Array.from(root.querySelectorAll<HTMLElement>(".hero-ch"));
    const state = letters.map(() => ({ lift: 0, rotate: 0 }));
    let bounds: DOMRect[] = [], pointer: { x: number; y: number } | null = null, frame = 0, last = 0;

    const tick = (now: number) => {
      frame = 0;
      const ease = 1 - Math.exp(-Math.min(now - last || 16, 50) / 70);
      last = now;
      let moving = false;
      letters.forEach((letter, i) => {
        const r = bounds[i];
        const dx = pointer && r ? pointer.x - (r.x + r.width / 2) : 0;
        const dy = pointer && r ? pointer.y - (r.y + r.height / 2) : 0;
        const near = pointer ? Math.max(0, 1 - Math.hypot(dx, dy) / 160) ** 2 : 0;
        const goal = { lift: -.14 * near, rotate: near * Math.max(-6, Math.min(6, dx / 14)) };
        const s = state[i];
        s.lift += (goal.lift - s.lift) * ease;
        s.rotate += (goal.rotate - s.rotate) * ease;
        moving ||= Math.abs(goal.lift - s.lift) > .0005 || Math.abs(goal.rotate - s.rotate) > .01;
        letter.style.transform = s.lift || s.rotate ? `translateY(${s.lift}em) rotate(${s.rotate}deg)` : "";
      });
      if (moving) frame = requestAnimationFrame(tick);
    };
    const start = () => { if (!frame) { last = performance.now(); frame = requestAnimationFrame(tick); } };
    const enter = () => { bounds = letters.map(l => l.getBoundingClientRect()); };
    const move = (e: PointerEvent) => { if (fancy.matches && e.pointerType === "mouse") { pointer = { x: e.clientX, y: e.clientY }; start(); } };
    const leave = () => { pointer = null; start(); };
    root.addEventListener("pointerenter", enter);
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", enter, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("pointerenter", enter);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", enter);
    };
  }, []);

  let index = 0;
  return (
    <h1 ref={ref} className="hero-name">
      <span className="sr-only">{TEXT}</span>
      <span aria-hidden="true">
        {TEXT.split(" ").map((word, w) => (
          <span key={w}>
            {w > 0 && " "}
            <span className={`hero-word${w >= 2 ? " hero-word-name" : ""}`}>
              {Array.from(word).map((ch, i) => <span className="hero-ch" key={i} style={{ "--i": index++ } as CSSProperties}>{ch}</span>)}
            </span>
          </span>
        ))}
      </span>
    </h1>
  );
}
