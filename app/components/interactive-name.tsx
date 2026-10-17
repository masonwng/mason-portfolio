"use client";

import { useEffect, useRef } from "react";

/** DOM transforms keep pointer animation out of React's render cycle. */
export function InteractiveName() {
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = button.current;
    if (!root) return;
    const letters = Array.from(root.querySelectorAll<HTMLElement>(".name-letter"));
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const positions = letters.map(() => ({ lift: 0, scale: 1, rotate: 0 }));
    let bounds: DOMRect[] = [];
    let pointer: { x: number; y: number } | null = null;
    let wave: { start: number; index: number } | null = null;
    let frame = 0;
    let lastTime = 0;
    const measure = () => { bounds = letters.map(letter => letter.getBoundingClientRect()); };
    const tick = (now: number) => {
      frame = 0;
      if (motion.matches) return;
      const ease = 1 - Math.exp(-Math.min(now - lastTime || 16, 50) / 65);
      lastTime = now;
      let moving = false;
      letters.forEach((letter, index) => {
        const rect = bounds[index];
        const dx = pointer && rect ? pointer.x - rect.x - rect.width / 2 : 0;
        const dy = pointer && rect ? pointer.y - rect.y - rect.height / 2 : 0;
        const proximity = pointer ? Math.max(0, 1 - Math.hypot(dx, dy) / 145) ** 2 : 0;
        const elapsed = wave ? now - wave.start - Math.abs(index - wave.index) * 48 : -1;
        const ripple = elapsed > 0 && elapsed < 440 ? Math.sin(elapsed / 440 * Math.PI) : 0;
        const target = { lift: -11 * proximity - 13 * ripple, scale: 1 + .11 * proximity + .045 * ripple, rotate: proximity * Math.max(-3, Math.min(3, dx / 18)) };
        const current = positions[index];
        current.lift += (target.lift - current.lift) * ease;
        current.scale += (target.scale - current.scale) * ease;
        current.rotate += (target.rotate - current.rotate) * ease;
        moving ||= Math.abs(current.lift - target.lift) > .02 || Math.abs(current.scale - target.scale) > .001;
        letter.style.transform = `translateY(${current.lift}px) rotate(${current.rotate}deg) scale(${current.scale})`;
      });
      if (wave && now - wave.start > 950) wave = null;
      if (pointer || wave || moving) frame = requestAnimationFrame(tick);
    };
    const start = () => { if (!frame && !motion.matches) { lastTime = performance.now(); frame = requestAnimationFrame(tick); } };
    const enter = () => { measure(); };
    const move = (event: PointerEvent) => { if (fine.matches) { pointer = { x: event.clientX, y: event.clientY }; start(); } };
    const leave = () => { pointer = null; start(); };
    const click = (event: MouseEvent) => {
      measure();
      const index = event.detail === 0 ? 0 : bounds.reduce((best, rect, i) => Math.abs(rect.x + rect.width / 2 - event.clientX) < Math.abs(bounds[best].x + bounds[best].width / 2 - event.clientX) ? i : best, 0);
      wave = { start: performance.now(), index };
      start();
    };
    const reset = () => { cancelAnimationFrame(frame); frame = 0; pointer = null; wave = null; letters.forEach((letter, i) => { letter.style.transform = ""; positions[i] = { lift: 0, scale: 1, rotate: 0 }; }); };
    root.addEventListener("pointerenter", enter);
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerleave", leave);
    root.addEventListener("click", click);
    motion.addEventListener("change", reset);
    return () => {
      reset();
      root.removeEventListener("pointerenter", enter);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", leave);
      root.removeEventListener("click", click);
      motion.removeEventListener("change", reset);
    };
  }, []);

  return (
    <h1 className="interactive-name" aria-label="Mason Wang">
      <button ref={button} className="name-button" type="button" aria-label="Animate Mason Wang">
        <span aria-hidden="true">{"Mason Wang".split("").map((letter, index) => letter === " "
          ? <span className="name-space" key={index}> </span>
          : <span className="name-letter" key={index}>{letter}</span>)}</span>
      </button>
    </h1>
  );
}
