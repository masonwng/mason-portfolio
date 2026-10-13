"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PlatformIcon } from "./social-links";

export function DiscordCopy({ username }: { username: string }) {
  const [message, setMessage] = useState("");
  const [copying, setCopying] = useState(false);
  const clearMessageRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusId = useId();

  useEffect(() => () => {
    if (clearMessageRef.current) clearTimeout(clearMessageRef.current);
  }, []);

  async function copyUsername() {
    if (copying) return;
    if (clearMessageRef.current) clearTimeout(clearMessageRef.current);
    setMessage("");
    setCopying(true);

    try {
      await navigator.clipboard.writeText(username);
      setMessage("Username copied.");
      clearMessageRef.current = setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Unable to copy. Select the username to copy it manually.");
    } finally {
      setCopying(false);
    }
  }

  return (
    <li className="contact-item">
      <button
        className="contact-method contact-copy"
        type="button"
        aria-label={`Copy Discord username ${username}`}
        aria-describedby={statusId}
        disabled={copying}
        onClick={copyUsername}
      >
        <PlatformIcon id="discord" className="contact-icon" />
        <span className="contact-details">
          <span className="contact-label">Discord</span>
          <span className="contact-username">{username}</span>
        </span>
        <span className="contact-action">{copying ? "Copying…" : "Copy username"}</span>
      </button>
      <p className="copy-status" id={statusId} role="status" aria-live="polite">{message}</p>
    </li>
  );
}
