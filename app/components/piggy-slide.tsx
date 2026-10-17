"use client";

import dynamic from "next/dynamic";
import type { PigCount, PiggySlideSceneProps } from "./piggy-slide-scene";
import {
  Component, useCallback, useEffect, useId, useRef, useState,
  useSyncExternalStore, type ReactNode,
} from "react";

const Scene = dynamic(() => import("./piggy-slide-scene"), {
  ssr: false,
  loading: () => <p className="piggy-loading" role="status">Preparing the little world…</p>,
});

function useMediaQuery(query: string) {
  const subscribe = useCallback((notify: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener("change", notify);
    return () => media.removeEventListener("change", notify);
  }, [query]);
  const snapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, snapshot, () => false);
}

function subscribeVisibility(notify: () => void) {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
}

let webGLAvailable: boolean | null = null;
function getWebGLSupport() {
  if (webGLAvailable !== null) return webGLAvailable;
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2");
    webGLAvailable = Boolean(context);
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webGLAvailable = false;
  }
  return webGLAvailable;
}
const subscribeNothing = () => () => {};

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <p className="piggy-fallback">3D is unavailable in this browser.</p>
      : this.props.children;
  }
}

function GameViewport(props: PiggySlideSceneProps) {
  const supported = useSyncExternalStore(subscribeNothing, getWebGLSupport, () => null);
  if (supported === null) return <p className="piggy-loading">Preparing the little world…</p>;
  if (!supported) return <p className="piggy-fallback">3D is unavailable in this browser.</p>;
  return <SceneBoundary><Scene {...props} /></SceneBoundary>;
}

export function PiggySlide() {
  const widgetRef = useRef<HTMLElement>(null);
  const wideScreen = useMediaQuery("(min-width: 1200px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const documentVisible = useSyncExternalStore(
    subscribeVisibility, () => document.visibilityState === "visible", () => true,
  );
  const [expanded, setExpanded] = useState(false);
  const [inView, setInView] = useState(false);
  const [seen, setSeen] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [pigCount, setPigCount] = useState<PigCount>(3);
  const [status, setStatus] = useState("");
  const panelId = useId();
  const selectId = useId();
  const open = wideScreen || expanded;
  const active = open && inView && documentVisible;
  const supportSnapshot = useCallback(() => open ? getWebGLSupport() : null, [open]);
  const supported = useSyncExternalStore(subscribeNothing, supportSnapshot, () => null);

  useEffect(() => {
    const widget = widgetRef.current;
    if (!widget) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) setSeen(true);
    }, { threshold: 0.05 });
    observer.observe(widget);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="piggy-widget" ref={widgetRef} aria-labelledby={`${panelId}-title`} data-piggy-active={active}>
      <div className="piggy-heading">
        <div>
          <h2 id={`${panelId}-title`}>PIGGY SLIDE</h2>
          <p>A little break from work.</p>
        </div>
        <button
          className="piggy-expand" type="button" aria-expanded={open}
          aria-controls={panelId} onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Close game" : "Play"}
        </button>
      </div>
      <div className="piggy-content" id={panelId} hidden={!open}>
        <div className="piggy-canvas" role="group" aria-label="Interactive miniature pig slide">
          {open && seen ? (
            <GameViewport active={active} reducedMotion={reducedMotion} resetToken={resetToken} pigCount={pigCount} onStatus={setStatus} />
          ) : <p className="piggy-loading">A tiny world, ready when you are.</p>}
        </div>
        <div className="piggy-controls">
          <label htmlFor={selectId}>Pigs</label>
          <select id={selectId} value={pigCount} disabled={supported === false} onChange={(event) => { setPigCount(Number(event.target.value) as PigCount); setStatus(""); }}>
            <option value={1}>1 pig</option><option value={2}>2 pigs</option><option value={3}>3 pigs</option>
          </select>
          <button className="piggy-reset" type="button" disabled={supported === false} onClick={() => setResetToken((value) => value + 1)}>Reset</button>
        </div>
        <p className="piggy-instructions">Drag pigs to slide. Drag the ground to rotate.</p>
        <p className="piggy-status" role="status" aria-live="polite">{supported === false ? "Use a browser with WebGL support to play." : status}</p>
      </div>
    </section>
  );
}
