"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, m } from "motion/react";
import { HiCheck } from "react-icons/hi2";

/**
 * Copies the email address. On success a small "copied!" tag pops up from the button
 * (announced to screen readers through the status region); on failure the address is
 * shown so it can be copied by hand.
 */
export function EmailCopy({ email, children = "Email", className = "", wrapperClassName = "" }: {
  email: string;
  children?: ReactNode;
  className?: string;
  wrapperClassName?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const [copying, setCopying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusId = useId();

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copyEmail() {
    if (copying) return;
    if (timer.current) clearTimeout(timer.current);
    setState("idle");
    setCopying(true);
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
      timer.current = setTimeout(() => setState("idle"), 2200);
    } catch {
      setState("failed");
      timer.current = setTimeout(() => setState("idle"), 8000);
    } finally {
      setCopying(false);
    }
  }

  return (
    <span className={`email-copy ${wrapperClassName}`.trim()} data-state={state}>
      <button
        type="button"
        className={`email-button ${className}`.trim()}
        aria-label={`Email: copy ${email} to clipboard`}
        aria-describedby={statusId}
        disabled={copying}
        onClick={copyEmail}
      >
        {children}
      </button>
      <AnimatePresence>
        {state === "copied" && (
          <m.span key="copied" className="copied-tag" aria-hidden="true"
            initial={{ opacity: 0, y: 8, scale: .6, rotate: -8 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: -4 }}
            exit={{ opacity: 0, y: -6, scale: .9 }}
            transition={{ type: "spring", stiffness: 520, damping: 22 }}>
            <HiCheck /> copied!
          </m.span>
        )}
      </AnimatePresence>
      <span className={state === "failed" ? "email-copy-notice" : "sr-only"} id={statusId} role="status" aria-live="polite" aria-atomic="true">
        {state === "copied" ? "Email copied to clipboard." : state === "failed" ? `Unable to copy. Copy this email manually: ${email}` : ""}
      </span>
    </span>
  );
}
