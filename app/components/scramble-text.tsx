"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz#%&*+=<>/";
const DURATION = 420;

/**
 * Text that scrambles and decodes itself when its link or button is hovered or focused.
 * The real text stays in place (and in the accessibility tree) to hold the width, so
 * neighbouring items never shift; the scrambled copy is drawn on top of it.
 */
export function ScrambleText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [fx, setFx] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    const trigger = el?.closest<HTMLElement>("a, button") ?? el;
    if (!el || !trigger) return;
    const allowed = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let frame = 0, start = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const settled = Math.floor(t * text.length);
      setFx(t >= 1 ? null : Array.from(text, (ch, i) =>
        i < settled || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join(""));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    const run = () => {
      if (!allowed.matches) return;
      cancelAnimationFrame(frame);
      start = performance.now();
      frame = requestAnimationFrame(tick);
    };
    trigger.addEventListener("pointerenter", run);
    trigger.addEventListener("focus", run);
    return () => {
      cancelAnimationFrame(frame);
      trigger.removeEventListener("pointerenter", run);
      trigger.removeEventListener("focus", run);
    };
  }, [text]);

  return (
    <span ref={ref} className="scramble" data-active={fx !== null}>
      <span className="scramble-base">{text}</span>
      {fx !== null && <span className="scramble-fx" aria-hidden="true">{fx}</span>}
    </span>
  );
}
