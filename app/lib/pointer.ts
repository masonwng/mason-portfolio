"use client";

import { useSyncExternalStore } from "react";

/** A mouse or trackpad, and the visitor hasn't asked for reduced motion. */
const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribe(notify: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}

/** True only where cursor-driven effects make sense. Always false during server rendering. */
export function useFancyPointer() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}
