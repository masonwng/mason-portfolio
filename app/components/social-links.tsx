"use client";

import { useState } from "react";
import type { IconType } from "react-icons";
import { SiDiscord, SiGithub, SiInstagram } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { socialProfiles } from "../lib/portfolio";
import { EmailCopy } from "./email-copy";

export type PlatformId = "github" | "linkedin" | "instagram" | "discord" | "email";

const icons: Record<PlatformId, IconType> = {
  github: SiGithub,
  linkedin: FaLinkedinIn,
  instagram: SiInstagram,
  discord: SiDiscord,
  email: HiOutlineEnvelope,
};

export function PlatformIcon({ id, className }: { id: PlatformId; className?: string }) {
  const Icon = icons[id];
  return <Icon className={className} aria-hidden="true" focusable="false" />;
}

export function SocialLinks({ className }: { className?: string } = {}) {
  const [status, setStatus] = useState("");

  async function copyDiscord(username: string) {
    setStatus("");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(username);
      setStatus("Discord username copied.");
    } catch {
      setStatus(`Copy unavailable. Discord username: ${username}`);
    }
  }

  return (
    <div className={["social-links", className].filter(Boolean).join(" ")}>
      {socialProfiles.map((profile) => {
        const title = `${profile.label}: ${profile.username}`;

        if (profile.id === "email") {
          return (
            <EmailCopy key={profile.id} email={profile.username} className="social-icon social-email">
              <PlatformIcon id="email" />
              <span>Email</span>
            </EmailCopy>
          );
        }

        if (profile.id === "discord") {
          return (
            <button
              className="social-icon"
              type="button"
              key={profile.id}
              aria-label={`Copy Discord username ${profile.username}`}
              title={title}
              onClick={() => void copyDiscord(profile.username)}
            >
              <PlatformIcon id={profile.id} />
            </button>
          );
        }

        if (!profile.href) return null;

        return (
          <a
            className="social-icon"
            key={profile.id}
            href={profile.href}
            aria-label={profile.label}
            title={title}
            target={profile.external ? "_blank" : undefined}
            rel={profile.external ? "noopener noreferrer" : undefined}
          >
            <PlatformIcon id={profile.id} />
          </a>
        );
      })}
      <span className="copy-status" role="status" aria-live="polite" aria-atomic="true">
        {status}
      </span>
    </div>
  );
}
