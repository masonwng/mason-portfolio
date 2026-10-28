import { EmailCopy } from "./components/email-copy";
import Link from "next/link";
import { InteractiveName } from "./components/interactive-name";
import Image from "next/image";
import type { Metadata } from "next";
import { ProjectPreviews } from "./components/project-previews";
import { DesktopFarm } from "./components/desktop-farm";
import { PiggyBreak } from "./components/piggy-break";
import { personal, experiences, leadership } from "./lib/portfolio";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return <div className="editorial-home">
    <div className="hero-with-game"><DesktopFarm/><header className="simple-intro"><InteractiveName /><p>{personal.subtitle}</p><p>{personal.intro}</p><div className="intro-links"><a href="https://github.com/masonwng" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://www.linkedin.com/in/mason-wang-926026353/" target="_blank" rel="noopener noreferrer">LinkedIn</a><EmailCopy email={personal.email} /><Link href="/resume">Resume</Link></div></header><figure className="hero-portrait"><Image src="/media/mason-portrait.jpg" alt="Mason at a restaurant, giving two thumbs up over dinner" width={1242} height={2208} sizes="(max-width:700px) 90vw, 300px" preload /><figcaption>hey, that’s me.</figcaption></figure></div>
    <section id="projects" className="editorial-section"><div className="section-heading"><h2>a couple things I made</h2></div><ProjectPreviews/></section>
    <section className="editorial-section piggy-break-section" aria-labelledby="piggy-break-heading"><div className="piggy-break-copy"><h2 id="piggy-break-heading">take a break.</h2><p className="secondary">Give a pig a little push. See you at the bottom.</p><span className="piggy-break-note">drag the background to look around</span></div><PiggyBreak/></section>
    <section id="experience" className="editorial-section"><div className="section-heading"><h2>what I’m up to</h2><Link href="/work" className="inline-link">more experience</Link></div><div className="selected-experience">{[experiences[0],leadership[0]].map((e,i)=><article key={e.id}><div><h3>{e.organization}</h3><p className="selected-role">{e.role}</p><p className="secondary">{i===0?'I teach coding and robotics to kids at RoboEDU.':'I help organize events, workshops, fundraising, and social posts.'}</p></div><p className="date">{e.startLabel} – {e.endLabel.toLowerCase()}</p></article>)}</div></section>
    <section id="about" className="editorial-section personal-section"><div><h2>outside school</h2><p className="secondary">{personal.interests}</p><Link href="/about" className="text-link">more about me</Link></div><figure><Image src="/media/hobbies/steak.jpg" alt="Steak and potatoes Mason cooked, served on a black plate" width={600} height={450} sizes="(max-width:700px) 100vw, 340px"/><figcaption>made this</figcaption></figure></section>
    <section id="contact" className="editorial-section home-contact"><h2>say hi.</h2><EmailCopy email={personal.email} className="home-email">Email</EmailCopy><p><a href="https://github.com/masonwng" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://www.linkedin.com/in/mason-wang-926026353/" target="_blank" rel="noopener noreferrer">LinkedIn</a><Link href="/contact">other places to find me</Link></p></section>
  </div>;
}
