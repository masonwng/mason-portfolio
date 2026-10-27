"use client";

import dynamic from "next/dynamic";
import type { PigCount, PiggySlideSceneProps } from "./piggy-slide-scene";
import {
  Component, useCallback, useEffect, useId, useRef, useState,
  useSyncExternalStore, type ReactNode,
} from "react";

const Scene = dynamic(() => import("./piggy-slide-scene"), {
  ssr: false,
  loading: () => <p className="piggy-loading" role="status">Loading…</p>,
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
  if (supported === null) return <p className="piggy-loading">Loading…</p>;
  if (!supported) return <p className="piggy-fallback">3D is unavailable in this browser.</p>;
  return <SceneBoundary><Scene {...props} /></SceneBoundary>;
}

export function PiggySlide() {
  const widgetRef = useRef<HTMLElement>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const documentVisible = useSyncExternalStore(
    subscribeVisibility, () => document.visibilityState === "visible", () => true,
  );
  const [inView, setInView] = useState(false);
  const [seen, setSeen] = useState(false);
  const [pushToken, setPushToken] = useState(0);
  const [resetToken, setResetToken] = useState(0);
  const [pigCount, setPigCount] = useState<PigCount>(3);
  const [status, setStatus] = useState("");
  const selectId = useId();
  const active = inView && documentVisible;
  const supportSnapshot = useCallback(() => seen ? getWebGLSupport() : null, [seen]);
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
    <section className="piggy-widget" ref={widgetRef} aria-label="Interactive pig slide" data-piggy-active={active}>
      <div className="piggy-content">
        <div className="piggy-canvas" role="group" aria-label="Interactive miniature pig slide">
          {seen ? (
            <GameViewport active={active} reducedMotion={reducedMotion} resetToken={resetToken} pushToken={pushToken} pigCount={pigCount} onStatus={setStatus} />
          ) : <p className="piggy-loading">Loading…</p>}
        </div>
        <div className="piggy-controls">
          <label htmlFor={selectId}>Pigs</label>
          <select id={selectId} value={pigCount} disabled={supported === false} onChange={(event) => { setPigCount(Number(event.target.value) as PigCount); setStatus(""); }}>
            <option value={1}>1 pig</option><option value={2}>2 pigs</option><option value={3}>3 pigs</option>
          </select>
          <button type="button" disabled={supported === false || !active} onClick={() => setPushToken(value => value + 1)}>Push a pig</button>
          <button className="piggy-reset" type="button" disabled={supported === false} onClick={() => { setResetToken(value => value + 1); setStatus("Back at the top. Give a pig a push."); }}>Reset</button>
        </div>
        <p className="piggy-instructions">Tap a pig to give it a push. Tap again for more speed.</p>
        <p className="piggy-status" role="status" aria-live="polite">{supported === false ? "Use a browser with WebGL support to play." : status}</p>
      </div>
    </section>
  );
}
