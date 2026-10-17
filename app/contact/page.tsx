import type { Metadata } from "next";
import { DiscordCopy } from "../components/discord-copy";
import { PlatformIcon } from "../components/social-links";
import { personal, socialProfiles } from "../lib/portfolio";
import { getResumePath } from "../lib/resume";

export const metadata: Metadata = {
  title: "Contact",
  alternates: { canonical: "/contact" },
  description: "Connect with Mason Wang about software, interesting ideas, and more.",
};

export default async function ContactPage() {
  const resume = await getResumePath();

  return (
    <>
      <header className="page-heading">
        <p className="eyebrow">Good things start with a conversation</p>
        <h1>{personal.contactHeading}</h1>
        <p className="page-intro">{personal.contactIntroduction}</p>
      </header>

      <section className="portfolio-section" aria-label="Contact methods">
        <ul className="contact-list">
          {socialProfiles.map((profile) => {
            if (profile.id === "discord") {
              return <DiscordCopy key={profile.id} username={profile.username} />;
            }
            if (!profile.href) return null;

            return (
              <li className="contact-item" key={profile.id}>
                <a
                  className="contact-method"
                  href={profile.href}
                  target={profile.external ? "_blank" : undefined}
                  rel={profile.external ? "noopener noreferrer" : undefined}
                  aria-label={`${profile.label}: ${profile.username}${profile.external ? " (opens in a new tab)" : ""}`}
                >
                  <PlatformIcon id={profile.id} className="contact-icon" />
                  <span className="contact-details">
                    <span className="contact-label">{profile.label}</span>
                    <span className="contact-username">{profile.id === "email" ? personal.email : profile.username}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
        {resume && <a className="resume-link" href={resume} download>Download Resume</a>}
      </section>
    </>
  );
}
