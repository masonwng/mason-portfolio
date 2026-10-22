"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export function EmailCopy({ email, children = "Email", className = "", wrapperClassName = "" }: {
  email: string;
  children?: ReactNode;
  className?: string;
  wrapperClassName?: string;
}) {
  const [message, setMessage] = useState("");
  const [copying, setCopying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusId = useId();

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copyEmail() {
    if (copying) return;
    if (timer.current) clearTimeout(timer.current);
    setMessage("");
    setCopying(true);

    try {
      await navigator.clipboard.writeText(email);
      setMessage("Email copied to clipboard.");
      timer.current = setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage(`Unable to copy. Copy this email manually: ${email}`);
    } finally {
      setCopying(false);
    }
  }

  return (
    <span className={`email-copy ${wrapperClassName}`.trim()}>
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
      <span className="email-copy-notice" id={statusId} role="status" aria-live="polite" aria-atomic="true">
        {message}
      </span>
    </span>
  );
}
