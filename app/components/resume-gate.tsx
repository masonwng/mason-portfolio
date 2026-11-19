"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";

// Must match scripts/encrypt-resume.mjs.
const ITERATIONS = 600_000;

async function decrypt(password: string): Promise<Blob> {
  const response = await fetch("/resume.enc", { cache: "no-store" });
  if (!response.ok) throw new Error("missing");
  const data = new Uint8Array(await response.arrayBuffer());
  const salt = data.slice(0, 16), iv = data.slice(16, 28), body = data.slice(28);
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" }, material, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
  // AES-GCM rejects a wrong key, so a bad password throws here instead of producing garbage.
  const pdf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, body);
  return new Blob([pdf], { type: "application/pdf" });
}

/** Password prompt that decrypts the résumé in the browser. The plain PDF is never served. */
export function ResumeGate() {
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"locked" | "checking" | "wrong" | "error">("locked");
  const [url, setUrl] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  async function unlock(event: FormEvent) {
    event.preventDefault();
    if (!password || state === "checking") return;
    setState("checking");
    try {
      setUrl(URL.createObjectURL(await decrypt(password)));
    } catch (error) {
      setState(error instanceof Error && error.message === "missing" ? "error" : "wrong");
      input.current?.select();
    }
  }

  if (url) {
    return (
      <div className="resume-unlocked">
        <div className="resume-actions">
          <a className="btn btn-primary" href={url} download="Mason-Wang-Resume.pdf">Download PDF</a>
          <a className="btn btn-ghost" href={url} target="_blank" rel="noopener noreferrer">Open in a new tab ↗</a>
        </div>
        <iframe className="resume-frame" src={url} title="Mason Wang’s résumé" />
      </div>
    );
  }

  return (
    <form className="resume-lock" onSubmit={unlock} data-state={state}>
      <span className="resume-lock-icon" aria-hidden="true">🔒</span>
      <h2>This résumé is password protected.</h2>
      <p className="secondary">Enter the password to view or download it. Don’t have it? <a href="/contact">Ask me</a>.</p>
      <label htmlFor="resume-password" className="sr-only">Password</label>
      <div className="resume-lock-row">
        <input id="resume-password" ref={input} type="password" autoComplete="current-password" value={password} placeholder="Password"
          aria-invalid={state === "wrong"} aria-describedby="resume-lock-status" autoFocus
          onChange={e => { setPassword(e.target.value); if (state === "wrong") setState("locked"); }} />
        <button className="btn btn-primary" type="submit" disabled={state === "checking"}>{state === "checking" ? "Unlocking…" : "Unlock"}</button>
      </div>
      <p id="resume-lock-status" className="resume-lock-status" role="status">
        {state === "wrong" ? "That password isn’t right. Try again." : state === "error" ? "The résumé couldn’t be loaded. Refresh and try again." : ""}
      </p>
    </form>
  );
}
