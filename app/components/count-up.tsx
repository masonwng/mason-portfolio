"use client";

import { useEffect, useRef } from "react";
import { useInView } from "motion/react";

/**
 * Counts the number inside a stat (e.g. "50+", "’31") up from zero the first time it
 * scrolls into view. The finished value is server-rendered, so it reads correctly
 * without JavaScript and with reduced motion.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: .6 });
  const match = /^(\D*)(\d+)(\D*)$/.exec(value);

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el || !match) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    const [, prefix, digits, suffix] = match;
    const target = Number(digits);
    const pad = digits.length;
    const duration = Math.min(1600, 700 + target * 16);
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4); // ease-out quart
      el.textContent = `${prefix}${String(Math.round(eased * target)).padStart(pad, "0")}${suffix}`;
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); el.textContent = value; };
    // `match` is derived from `value`; re-running on value change is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value]);

  return <span ref={ref} className="count-up">{value}</span>;
}
