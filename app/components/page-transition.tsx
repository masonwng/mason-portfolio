import { ViewTransition, type ReactNode } from "react";

/**
 * Wraps a page so route changes cross-fade and slide (CSS in globals.css). It has to sit
 * in each page, not the layout: layouts persist across navigations, so they never enter or exit.
 * Browsers without the View Transitions API simply swap pages.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return <ViewTransition enter="page-enter" exit="page-exit" default="none">{children}</ViewTransition>;
}
