import type { CSSProperties, ReactNode } from "react";

/** Fades and slides its children in when they scroll into view (see ScrollEffects). */
export function Reveal({ children, className = "", delay = 0, as: Tag = "div" }: {
  children: ReactNode; className?: string; delay?: number; as?: "div" | "section" | "li" | "article";
}) {
  return <Tag className={className || undefined} data-reveal="" style={delay ? { "--reveal-delay": `${delay}ms` } as CSSProperties : undefined}>{children}</Tag>;
}
