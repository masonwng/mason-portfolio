"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * LazyMotion keeps the animation bundle small (only `m.*` components, no full `motion.*`) and
 * loads the animation features after hydration;
 * and reducedMotion="user" turns transform animations off for prefers-reduced-motion.
 */
const loadFeatures = () => import("./motion-features").then(m => m.default);

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
