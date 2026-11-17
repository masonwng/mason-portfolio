import type { CSSProperties } from "react";

/**
 * Splits a heading into letters so CSS can run a wave across them on hover.
 * Screen readers get the plain text; the letter spans are hidden from them.
 */
export function WaveText({ text }: { text: string }) {
  let index = 0;
  return (
    <span className="wave">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, w) => (
          <span key={w}>
            {w > 0 && " "}
            <span className="wave-word">
              {Array.from(word).map((ch, i) => <span className="wave-ch" key={i} style={{ "--i": index++ } as CSSProperties}>{ch}</span>)}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
