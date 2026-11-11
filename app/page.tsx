import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import { HiArrowRight, HiArrowUpRight, HiOutlineEnvelope } from "react-icons/hi2";
import { EmailCopy } from "./components/email-copy";
import { InteractiveName } from "./components/interactive-name";
import { OrganizationLogo } from "./components/organization-logo";
import { ProjectPreviews } from "./components/project-previews";
import { awards, education, experiences, leadership, personal, projects } from "./lib/portfolio";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const now = [
  { entry: experiences[0], blurb: "I teach coding and robotics to kids at RoboEDU." },
  { entry: leadership[0], blurb: "I help organize events, workshops, fundraising, and social posts." },
];

const highlights = [
  { value: "50+", label: "students taught to code" },
  { value: String(awards.length), label: "competition awards" },
  { value: String(projects.length + 1), label: "things built for fun" },
  { value: `’${education.graduation.slice(-2)}`, label: "UBC BUCS class" },
];

export default function Home() {
  return (
    <div className="home">
      <section className="hero" aria-label="Introduction">
        <div className="hero-copy">
          <p className="status-pill"><span className="status-dot" aria-hidden="true" />First-year BUCS at UBC</p>
          <InteractiveName />
          <p className="hero-lede">{personal.subtitle} {personal.intro}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/#projects">See what I’ve made <HiArrowRight aria-hidden="true" /></Link>
            <Link className="btn btn-ghost" href="/resume">Resume</Link>
          </div>
          <div className="hero-social" aria-label="Elsewhere">
            <a href="https://github.com/masonwng" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><SiGithub aria-hidden="true" /></a>
            <a href="https://www.linkedin.com/in/mason-wang-926026353/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><FaLinkedinIn aria-hidden="true" /></a>
            <EmailCopy email={personal.email}><HiOutlineEnvelope aria-hidden="true" /></EmailCopy>
          </div>
        </div>
        <figure className="hero-portrait">
          <div className="hero-portrait-frame">
            <Image src="/media/mason-portrait.jpg" alt="Mason at a restaurant, giving two thumbs up over dinner" width={1242} height={2208} sizes="(max-width:700px) 80vw, 340px" preload />
          </div>
          <figcaption>hey, that’s me 👋</figcaption>
        </figure>
      </section>

      <ul className="highlights" aria-label="Highlights">
        {highlights.map(h => <li key={h.label}><strong>{h.value}</strong><span>{h.label}</span></li>)}
      </ul>

      <section id="projects" className="home-section" aria-labelledby="projects-heading">
        <div className="section-heading">
          <div><p className="eyebrow">01 / projects</p><h2 id="projects-heading">things I made</h2></div>
          <a className="inline-link" href="https://github.com/masonwng" target="_blank" rel="noopener noreferrer">all on GitHub <HiArrowUpRight aria-hidden="true" /></a>
        </div>
        <ProjectPreviews />
      </section>

      <section id="experience" className="home-section" aria-labelledby="experience-heading">
        <div className="section-heading">
          <div><p className="eyebrow">02 / now</p><h2 id="experience-heading">what I’m up to</h2></div>
          <Link href="/work" className="inline-link">all experience <HiArrowRight aria-hidden="true" /></Link>
        </div>
        <div className="now-list">
          {now.map(({ entry, blurb }) => (
            <Link href="/work" className="now-item" key={entry.id}>
              <OrganizationLogo logo={entry.logo} badge={entry.badge ?? entry.organization.slice(0, 3)} name={entry.organization} />
              <div className="now-copy">
                <h3>{entry.organization}</h3>
                <p className="now-role">{entry.role}</p>
                <p className="secondary">{blurb}</p>
              </div>
              <p className="date">{entry.startLabel} – {entry.endLabel.toLowerCase()}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section bento" aria-label="More about me">
        <article className="bento-card bento-about">
          <div className="bento-about-copy">
            <p className="eyebrow">03 / outside school</p>
            <h2>off the screen</h2>
            <p className="secondary">{personal.interests}</p>
            <Link href="/about" className="inline-link">more about me <HiArrowRight aria-hidden="true" /></Link>
          </div>
          <figure>
            <Image src="/media/hobbies/steak.jpg" alt="Steak and potatoes Mason cooked, served on a black plate" width={600} height={450} sizes="(max-width:700px) 100vw, 300px" />
            <figcaption>made this</figcaption>
          </figure>
        </article>
        <article id="contact" className="bento-card bento-contact">
          <p className="eyebrow">04 / contact</p>
          <h2>say hi.</h2>
          <p>Questions, ideas, or just want to chat? My inbox is open.</p>
          <EmailCopy email={personal.email} className="btn btn-invert">Copy my email</EmailCopy>
          <Link href="/contact" className="bento-contact-link">other places to find me <HiArrowRight aria-hidden="true" /></Link>
        </article>
      </section>
    </div>
  );
}
