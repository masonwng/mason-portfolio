"use client";
import Image from "next/image";
import { useState } from "react";

type Part = { id: string; name: string };
type Item = { id: string; name: string; components: Part[] };
type Round = { answer: Item; options: string[] };

// The first round is fixed so the server render matches; later rounds come from Itemdle's real data.
const FIRST: Round = {
  answer: { id: "3031", name: "Infinity Edge", components: [{ id: "1038", name: "B. F. Sword" }, { id: "1037", name: "Pickaxe" }, { id: "1018", name: "Cloak of Agility" }] },
  options: ["Bloodthirster", "Infinity Edge", "Navori Flickerblade", "Essence Reaver"],
};
let itemsPromise: Promise<Item[]> | null = null;
const loadItems = () => (itemsPromise ??= fetch("/projects/itemle/data.json").then(r => r.json()).then(d => d.items as Item[]));
const shuffle = <T,>(list: T[]) => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/** A one-guess Itemdle round that plays right on the home page card. */
export function ItemdleMini() {
  const [round, setRound] = useState(FIRST);
  const [picked, setPicked] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const correct = picked === round.answer.name;

  function choose(name: string) {
    if (picked) return;
    setPicked(name);
    setStreak(s => (name === round.answer.name ? s + 1 : 0));
  }
  async function next() {
    setLoading(true);
    try {
      const items = await loadItems();
      const pool = items.filter(i => i.id !== round.answer.id);
      const answer = pool[Math.floor(Math.random() * pool.length)];
      // Decoys share a component when possible, so the round isn't trivially easy.
      const parts = new Set(answer.components.map(c => c.id));
      const near = shuffle(items.filter(i => i.id !== answer.id && i.components.some(c => parts.has(c.id))));
      const far = shuffle(items.filter(i => i.id !== answer.id && !near.includes(i)));
      setRound({ answer, options: shuffle([answer.name, ...[...near, ...far].slice(0, 3).map(i => i.name)]) });
      setPicked(null);
    } finally { setLoading(false); }
  }

  return (
    <div className="itemle-preview mini" data-state={picked ? (correct ? "won" : "lost") : "playing"}>
      <p className="mini-q">what does this build into?{streak > 1 && <span className="mini-streak">🔥 {streak}</span>}</p>
      <div className="itemle-recipe">
        {round.answer.components.map((item, i) => (
          <figure key={`${item.id}-${i}`} style={{ "--i": i, "--n": round.answer.components.length } as React.CSSProperties}>
            <Image src={`/projects/itemle/assets/items/${item.id}.png`} alt={item.name} width={48} height={48} unoptimized />
            <figcaption>{item.name}</figcaption>
          </figure>
        ))}
        {picked && (
          <figure className="mini-answer">
            <Image src={`/projects/itemle/assets/items/${round.answer.id}.png`} alt={round.answer.name} width={48} height={48} unoptimized />
            <figcaption>{round.answer.name}</figcaption>
          </figure>
        )}
      </div>
      {!picked ? (
        <div className="mini-options" role="group" aria-label="Pick the finished item">
          {round.options.map(name => <button key={name} type="button" onClick={() => choose(name)}>{name}</button>)}
        </div>
      ) : (
        <div className="mini-result" role="status">
          <strong>{correct ? "Correct! 🎉" : `It was ${round.answer.name}.`}</strong>
          <span>
            <button type="button" onClick={next} disabled={loading}>{loading ? "loading…" : "another one ↻"}</button>
            <a href="/projects/itemle/index.html">play the daily →</a>
          </span>
        </div>
      )}
    </div>
  );
}
