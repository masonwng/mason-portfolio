"use client";

import { m, useReducedMotion, useScroll, useSpring } from "motion/react";

/** Thin reading-progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const smooth = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: .001 });
  return <m.div className="scroll-progress" aria-hidden="true" style={{ scaleX: reduce ? scrollYProgress : smooth }} />;
}
