"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { m, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { useFancyPointer } from "../lib/pointer";

const SPRING = { stiffness: 220, damping: 22, mass: .6 };

/**
 * Card that tilts toward the cursor with a moving glare and a small lift. Tilting pauses
 * while focus is inside (for example typing into a mini game) so the card holds still.
 */
export function TiltCard({ children, className = "", label, max = 7, ...rest }: {
  children: ReactNode; className?: string; label?: string; max?: number; id?: string; "aria-labelledby"?: string;
}) {
  const enabled = useFancyPointer();
  const ref = useRef<HTMLElement>(null);
  const px = useMotionValue(.5), py = useMotionValue(.5), hover = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, v => (.5 - v) * max), SPRING);
  const rotateY = useSpring(useTransform(px, v => (v - .5) * max * 1.25), SPRING);
  const lift = useSpring(useTransform(hover, v => v * -6), SPRING);
  const glareX = useTransform(px, v => `${(v - .5) * 100}%`);
  const glareY = useTransform(py, v => `${(v - .5) * 100}%`);
  const glareOpacity = useSpring(hover, SPRING);
  const glare = useMotionTemplate`translate3d(${glareX}, ${glareY}, 0)`;

  function move(event: PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!enabled || event.pointerType !== "mouse" || !el) return;
    if (el.contains(document.activeElement) && document.activeElement !== el) { settle(); return; }
    const r = el.getBoundingClientRect();
    px.set((event.clientX - r.left) / r.width);
    py.set((event.clientY - r.top) / r.height);
    hover.set(1);
  }
  function settle() { px.set(.5); py.set(.5); hover.set(0); }

  return (
    <m.article ref={ref} {...rest} className={`tilt-card ${className}`.trim()} data-cursor-label={label}
      onPointerMove={move} onPointerLeave={settle} onFocus={settle}
      style={enabled ? { rotateX, rotateY, y: lift, transformPerspective: 1100 } : undefined}>
      {children}
      {enabled && <m.span className="tilt-glare" aria-hidden="true" style={{ transform: glare, opacity: glareOpacity }} />}
    </m.article>
  );
}
