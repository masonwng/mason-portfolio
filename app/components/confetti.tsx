"use client";
import { useEffect, useRef, useState } from "react";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const COLORS = ["#2f62e0", "#f59e0b", "#1f9d55", "#e11d48", "#8b5cf6", "#06b6d4"];

/** Fire with `window.dispatchEvent(new Event("mw:confetti"))`. */
export function celebrate() { window.dispatchEvent(new Event("mw:confetti")); }

/** Site-wide easter egg: the Konami code (or 10 clicks on the name) throws confetti. */
export function Confetti() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let frame = 0, keys: string[] = [], timer: ReturnType<typeof setTimeout>;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    function burst() {
      setMessage("🎉 you found the secret!");
      clearTimeout(timer); timer = setTimeout(() => setMessage(""), 2600);
      const el = canvas.current, ctx = el?.getContext("2d");
      if (!el || !ctx || motion.matches) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = innerWidth * dpr; el.height = innerHeight * dpr; ctx.scale(dpr, dpr);
      const pieces = Array.from({ length: 160 }, (_, i) => ({
        x: innerWidth / 2 + (Math.random() - .5) * 120, y: innerHeight * .35,
        vx: (Math.random() - .5) * 16, vy: -Math.random() * 15 - 5, r: Math.random() * Math.PI, vr: (Math.random() - .5) * .4,
        w: 6 + Math.random() * 6, h: 8 + Math.random() * 8, color: COLORS[i % COLORS.length],
      }));
      const start = performance.now();
      cancelAnimationFrame(frame);
      const step = (now: number) => {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        const t = (now - start) / 1000;
        for (const p of pieces) {
          p.vy += .45; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
          ctx.save(); ctx.globalAlpha = Math.max(0, 1 - Math.max(0, t - 1.8)); ctx.translate(p.x, p.y); ctx.rotate(p.r);
          ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2))); ctx.restore();
        }
        if (t < 2.8) frame = requestAnimationFrame(step); else ctx.clearRect(0, 0, innerWidth, innerHeight);
      };
      frame = requestAnimationFrame(step);
    }
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable]")) return;
      keys = [...keys, event.key.length === 1 ? event.key.toLowerCase() : event.key].slice(-KONAMI.length);
      if (keys.join() === KONAMI.join()) { keys = []; burst(); }
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("mw:confetti", burst);
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); window.removeEventListener("keydown", onKey); window.removeEventListener("mw:confetti", burst); };
  }, []);

  return (
    <>
      <canvas ref={canvas} className="confetti" aria-hidden="true" />
      <p className="confetti-message" role="status" aria-live="polite">{message}</p>
    </>
  );
}
