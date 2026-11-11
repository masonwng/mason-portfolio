"use client";
import { useRef, useState, type FormEvent } from "react";

type Q = { text: string; answer: number; level: string };
const LEVELS = ["Kindergarten", ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`), "University Year 1"];
const r = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));

/** Small questions that get harder as the mini climb goes on (a taste of the real game). */
function question(step: number): Q {
  const level = LEVELS[Math.min(step * 2, 12)];
  if (step === 0) { const a = r(2, 9), b = r(2, 9); return { text: `${a} + ${b}`, answer: a + b, level }; }
  if (step === 1) { const a = r(3, 9), b = r(3, 9); return { text: `${a} × ${b}`, answer: a * b, level }; }
  if (step === 2) { const b = r(3, 9), a = b * r(3, 9); return { text: `${a} ÷ ${b}`, answer: a / b, level }; }
  if (step === 3) { const x = r(2, 9), a = r(2, 6), b = r(1, 9); return { text: `${a}x + ${b} = ${a * x + b}, x = ?`, answer: x, level }; }
  if (step === 4) { const n = r(4, 15); return { text: `x² = ${n * n}, x > 0, x = ?`, answer: n, level }; }
  const a = r(2, 5), n = r(2, 4); return { text: `d/dx ${a}x^${n} at x = 1`, answer: a * n, level: LEVELS[13] };
}
const FIRST: Q = { text: "3 + 4", answer: 7, level: LEVELS[0] };
const STEPS = 6;

export function MathMini() {
  const [step, setStep] = useState(0);
  const [q, setQ] = useState(FIRST);
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<"" | "right" | "wrong">("");
  const input = useRef<HTMLInputElement>(null);
  const done = step >= STEPS;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!value.trim() || done) return;
    if (Number(value.replace(",", ".")) === q.answer) {
      const next = step + 1;
      setStep(next); setFeedback("right"); setValue("");
      if (next < STEPS) setQ(question(next));
    } else {
      setFeedback("wrong");
      input.current?.select();
    }
  }
  function restart() { setStep(0); setQ(question(0)); setFeedback(""); setValue(""); }

  return (
    <div className="math-preview mini" data-feedback={feedback}>
      {!done ? (
        <form onSubmit={submit} className="mini-math-form">
          <span className="mini-level">{q.level}</span>
          <label htmlFor="math-mini-input" className="mini-math-q">{q.text}</label>
          <span className="mini-math-row">
            <input id="math-mini-input" ref={input} inputMode="decimal" autoComplete="off" value={value} placeholder="?" aria-describedby="math-mini-status"
              onChange={e => { setValue(e.target.value); if (feedback === "wrong") setFeedback(""); }} />
            <button type="submit" aria-label="Check answer">↵</button>
          </span>
          <span id="math-mini-status" className="mini-math-status" role="status">{feedback === "right" ? "nice, level up ↑" : feedback === "wrong" ? "not quite, try again" : "type an answer, hit enter"}</span>
        </form>
      ) : (
        <div className="mini-math-done" role="status">
          <strong>You climbed {STEPS} levels 🏔️</strong>
          <span><a href="/projects/math-ascension/index.html">try the full 14-stage climb →</a><button type="button" onClick={restart}>again ↻</button></span>
        </div>
      )}
      <div className="math-preview-track" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} className={i < Math.round(step / STEPS * 14) ? "on" : ""} />)}</div>
      <p>Kindergarten <span>→</span> University Year 1</p>
    </div>
  );
}
