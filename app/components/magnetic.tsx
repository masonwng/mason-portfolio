"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { m, useMotionValue, useSpring } from "motion/react";
import { useFancyPointer } from "../lib/pointer";

/** Pulls its child a little toward the cursor while hovered, then springs back. */
export function Magnetic({ children, strength = .3, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const enabled = useFancyPointer();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: .5 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: .5 });

  function move(event: PointerEvent<HTMLSpanElement>) {
    if (!enabled || event.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((event.clientX - r.left - r.width / 2) * strength);
    y.set((event.clientY - r.top - r.height / 2) * strength);
  }
  function reset() { x.set(0); y.set(0); }

  return (
    <m.span ref={ref} className={`magnetic ${className}`.trim()} style={enabled ? { x, y } : undefined} onPointerMove={move} onPointerLeave={reset}>
      {children}
    </m.span>
  );
}
