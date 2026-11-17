import type { ReactNode } from "react";
import { WaveText } from "./wave-text";

/** Numbered home-page section heading: an oversized outlined numeral plus the label and title. */
export function SectionHeading({ num, label, title, id, action }: {
  num: string; label: string; title: string; id?: string; action?: ReactNode;
}) {
  return (
    <div className="section-heading" data-reveal="">
      <span className="section-num" aria-hidden="true">{num}</span>
      <div className="section-heading-copy">
        <p className="eyebrow">{num} / {label}</p>
        <h2 id={id} className="wave-trigger"><WaveText text={title} /></h2>
      </div>
      {action && <div className="section-heading-action">{action}</div>}
    </div>
  );
}
