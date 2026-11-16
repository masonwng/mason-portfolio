"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { m, useMotionValue, useSpring, useTransform } from "motion/react";
import { useFancyPointer } from "../lib/pointer";

const SPRING = { stiffness: 120, damping: 20, mass: .8 };

/**
 * The hero section: a soft accent spotlight follows the cursor across it, and the
 * portrait drifts a few pixels against the pointer for a little depth.
 */
export function HeroStage({ copy, portrait }: { copy: ReactNode; portrait: ReactNode }) {
  const enabled = useFancyPointer();
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0), y = useMotionValue(0), nx = useMotionValue(0), ny = useMotionValue(0);
  const sx = useSpring(x, SPRING), sy = useSpring(y, SPRING);
  const px = useSpring(useTransform(nx, v => v * -14), SPRING);
  const py = useSpring(useTransform(ny, v => v * -10), SPRING);
  const rotate = useSpring(useTransform(nx, v => 3 + v * 3), SPRING);

  function move(event: PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!enabled || event.pointerType !== "mouse" || !el) return;
    const r = el.getBoundingClientRect();
    x.set(event.clientX - r.left); y.set(event.clientY - r.top);
    nx.set((event.clientX - r.left) / r.width - .5); ny.set((event.clientY - r.top) / r.height - .5);
  }
  function leave() { nx.set(0); ny.set(0); }

  return (
    <section ref={ref} className="hero" aria-label="Introduction" onPointerMove={move} onPointerLeave={leave}>
      {enabled && <m.span className="hero-spotlight" aria-hidden="true" style={{ x: sx, y: sy }} />}
      <div className="hero-copy">{copy}</div>
      <m.figure className="hero-portrait" style={enabled ? { x: px, y: py, rotate } : undefined}>{portrait}</m.figure>
    </section>
  );
}
