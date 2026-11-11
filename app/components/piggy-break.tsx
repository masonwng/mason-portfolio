"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Game = dynamic(() => import("./farm-game").then(m => m.FarmGame), { ssr: false, loading: () => <p className="piggy-loading">Loading the farm…</p> });

type WindowState = "open" | "minimized" | "closed";

/** The farm lives in a small macOS-style window: close, minimize, and maximize all work. */
export function PiggyBreak() {
  const [expanded, setExpanded] = useState(false);
  const [state, setState] = useState<WindowState>("open");
  const windowRef = useRef<HTMLDialogElement>(null);
  const greenRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [expanded]);

  function setMaximized(next: boolean) {
    const panel = windowRef.current;
    if (!panel || next === expanded) return;
    panel.close();
    if (next) panel.showModal(); else panel.show();
    setExpanded(next);
    greenRef.current?.focus();
  }
  function close() { setMaximized(false); setState(s => s === "closed" ? "open" : "closed"); }
  function minimize() { if (expanded) setMaximized(false); else setState(s => s === "minimized" ? "open" : "minimized"); }
  function maximize() { setState("open"); setMaximized(!expanded); }

  const title = state === "closed" ? "farm — closed" : state === "minimized" ? "farm — minimized" : "farm";
  return (
    <aside className="hero-pig" aria-label="Farm game" data-state={state}>
      <dialog ref={windowRef} open className="pig-window" data-expanded={expanded} aria-labelledby="pig-window-title"
        onCancel={e => { e.preventDefault(); if (expanded) setMaximized(false); }}>
        <div className="pig-window-bar">
          <div className="traffic-lights">
            <button type="button" className="dot dot-close" onClick={close} aria-label={state === "closed" ? "Reopen farm" : "Close farm"} title={state === "closed" ? "Reopen" : "Close"}><span aria-hidden="true">×</span></button>
            <button type="button" className="dot dot-min" onClick={minimize} aria-label={expanded ? "Exit full screen" : state === "minimized" ? "Restore farm" : "Minimize farm"} title={expanded ? "Exit full screen" : state === "minimized" ? "Restore" : "Minimize"}><span aria-hidden="true">−</span></button>
            <button type="button" ref={greenRef} className="dot dot-max" onClick={maximize} aria-label={expanded ? "Restore farm size" : "Maximize farm"} title={expanded ? "Restore" : "Maximize"}><span aria-hidden="true">{expanded ? "↙" : "↗"}</span></button>
          </div>
          <span id="pig-window-title">{title}</span>
        </div>
        {state === "closed" ? (
          <button type="button" className="pig-window-reopen" onClick={close}>The farm is closed. <span>Reopen it ↺</span></button>
        ) : (
          <div className="pig-window-game" hidden={state === "minimized"}><Game /></div>
        )}
      </dialog>
    </aside>
  );
}
