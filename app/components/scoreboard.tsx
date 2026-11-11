"use client";
import { useSyncExternalStore } from "react";
import { dailyStats } from "../../public/projects/itemle/stats.js";
import { ACHIEVEMENTS } from "../lib/farm-achievements.mjs";

const KEYS = ["itemle:history", "math-ascension:v1:best", "math-ascension:v1:timeattack", "farm:achievements:v1"];
const read = (key: string) => { try { return JSON.parse(localStorage.getItem(key) ?? "null"); } catch { return null; } };

// Snapshot as a string so React can compare it cheaply; it changes when any game saves.
const snapshot = () => { try { return KEYS.map(k => localStorage.getItem(k) ?? "").join("\u0000"); } catch { return ""; } };
const subscribe = (notify: () => void) => {
  window.addEventListener("storage", notify); window.addEventListener("focus", notify); window.addEventListener("mw:scores", notify);
  return () => { window.removeEventListener("storage", notify); window.removeEventListener("focus", notify); window.removeEventListener("mw:scores", notify); };
};

/** "Your scoreboard": personal bests from each game, read from this browser. */
export function Scoreboard() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  if (raw === null) return null;
  const today = new Date().toISOString().slice(0, 10);
  const itemle = dailyStats(read("itemle:history") ?? {}, today);
  const best = read("math-ascension:v1:best") ?? {};
  const climb = Math.max(best?.standard?.correct ?? 0, best?.challenge?.correct ?? 0);
  const attack = Number(read("math-ascension:v1:timeattack")) || 0;
  const farm = (read("farm:achievements:v1")?.unlocked ?? []).length;
  const rows = [
    { icon: "🔥", value: itemle.best ? `${itemle.current} day${itemle.current === 1 ? "" : "s"}` : "–", label: "Itemdle streak", note: itemle.best ? `best ${itemle.best}` : "play today’s daily", href: "/projects/itemle/index.html" },
    { icon: "🏔️", value: climb ? `${climb}/14` : "–", label: "Math Ascension climb", note: climb === 14 ? "summit reached" : climb ? "stages cleared" : "start the climb", href: "/projects/math-ascension/index.html" },
    { icon: "⏱️", value: attack ? String(attack) : "–", label: "Time Attack best", note: attack ? "points in 60s" : "try 60 seconds", href: "/projects/math-ascension/index.html" },
    { icon: "🏆", value: `${farm}/${ACHIEVEMENTS.length}`, label: "Farm badges", note: farm ? "achievements found" : "explore the farm", href: "/#farm" },
  ];
  const played = itemle.wins + climb + attack + farm > 0;
  return (
    <section className="scoreboard" aria-labelledby="scoreboard-title">
      <div className="scoreboard-head"><h3 id="scoreboard-title">your scoreboard</h3><span>{played ? "saved on this device" : "play anything above and your scores show up here"}</span></div>
      <ul>{rows.map(r => <li key={r.label}><a href={r.href}><span className="score-icon" aria-hidden="true">{r.icon}</span><span><strong>{r.value}</strong><span className="score-label">{r.label}</span><small>{r.note}</small></span></a></li>)}</ul>
    </section>
  );
}
