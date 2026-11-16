"use client";

import { useEffect, useState } from "react";
import { m, useMotionValue, useSpring } from "motion/react";
import { useFancyPointer } from "../lib/pointer";

const INTERACTIVE = "a, button, summary, select, label[for], [data-cursor]";
const NATIVE = "input, textarea, [contenteditable], [data-cursor='native'], canvas";

type State = { hover: boolean; label: string; hidden: boolean; down: boolean };

/**
 * A dot that sits on the pointer and a ring that trails it. The ring grows over links and
 * buttons and shows a short label (data-cursor-label) over project cards. Mouse/trackpad
 * only; touch devices and reduced motion keep the normal cursor.
 */
export function Cursor() {
  const enabled = useFancyPointer();
  return enabled ? <CursorInner /> : null;
}

function CursorInner() {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 420, damping: 36, mass: .6 });
  const ringY = useSpring(y, { stiffness: 420, damping: 36, mass: .6 });
  const [state, setState] = useState<State>({ hover: false, label: "", hidden: true, down: false });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x.set(event.clientX); y.set(event.clientY);
      const target = event.target as Element | null;
      const native = !!target?.closest(NATIVE);
      const hit = native ? null : target?.closest<HTMLElement>(INTERACTIVE);
      // Over a card the ring shows its label; over a control inside the card it's a plain hover ring.
      const card = hit || native ? null : target?.closest<HTMLElement>("[data-cursor-label]");
      const label = card?.dataset.cursorLabel ?? "";
      const hover = !!hit || !!card;
      setState(s => (s.hidden === native && s.hover === hover && s.label === label) ? s : { ...s, hidden: native, hover, label });
    };
    const leave = () => setState(s => ({ ...s, hidden: true }));
    const down = () => setState(s => ({ ...s, down: true }));
    const up = () => setState(s => ({ ...s, down: false }));
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("blur", leave);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("blur", leave);
    };
  }, [x, y]);

  const scale = state.label ? 2.6 : state.hover ? 1.7 : 1;
  return (
    <div className="cursor" aria-hidden="true" data-hidden={state.hidden} data-hover={state.hover} data-label={!!state.label}>
      <m.div className="cursor-ring-pos" style={{ x: ringX, y: ringY }}>
        <m.span className="cursor-ring" animate={{ scale: state.down ? scale * .85 : scale }} transition={{ type: "spring", stiffness: 380, damping: 26 }} />
        <span className="cursor-label">{state.label}</span>
      </m.div>
      <m.div className="cursor-dot" style={{ x, y }} />
    </div>
  );
}
