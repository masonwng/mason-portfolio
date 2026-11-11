"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

/**
 * Link to a section on the home page. Next's <Link> skips scrolling when the
 * hash is already in the URL, so on the home page we scroll ourselves every time.
 */
export function ScrollLink({ id, className, children, ...rest }: { id: string; className?: string; children: ReactNode; "aria-current"?: "page" }) {
  const pathname = usePathname();
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (pathname !== "/" || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(history.state, "", `#${id}`);
  }
  return <Link href={`/#${id}`} className={className} onClick={onClick} {...rest}>{children}</Link>;
}
