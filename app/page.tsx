import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ProjectPreviews } from "./components/project-previews";
import { PiggyBreak } from "./components/piggy-break";
import { personal, experiences, leadership } from "./lib/portfolio";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return <div className="editorial-home">
    <div className="hero-with-game"><header className="simple-intro"><h1>hey, I’m Mason.</h1><p>{personal.subtitle}</p><p>{personal.intro}</p><div className="intro-links"><a href="https://github.com/masonwng" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/mason-wang-926026353/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href={`mailto:${personal.email}`}>email ↗</a><Link href="/resume">resume ↗</Link></div></header><PiggyBreak/></div>
    <section id="projects" className="editorial-section"><div className="section-heading"><h2>a couple things I made</h2></div><ProjectPreviews/></section>
    <section id="experience" className="editorial-section"><div className="section-heading"><h2>what I’m up to</h2><Link href="/work" className="inline-link">more experience ↗</Link></div><div className="selected-experience">{[experiences[0],leadership[0]].map((e,i)=><article key={e.id}><div><h3>{e.organization}</h3><p className="selected-role">{e.role}</p><p className="secondary">{i===0?'I teach coding and robotics to kids at RoboEDU.':'I help organize events, workshops, fundraising, and social posts.'}</p></div><p className="date">{e.startLabel} – {e.endLabel.toLowerCase()}</p></article>)}</div></section>
    <section id="about" className="editorial-section personal-section"><div><h2>outside school</h2><p className="secondary">{personal.interests}</p><Link href="/about" className="text-link">more about me ↗</Link></div><figure><Image src="/media/hobbies/steak.jpg" alt="Steak and potatoes Mason cooked, served on a black plate" width={600} height={450} sizes="(max-width:700px) 100vw, 340px"/><figcaption>made this</figcaption></figure></section>
    <section id="contact" className="editorial-section home-contact"><h2>say hi.</h2><a className="home-email" href={`mailto:${personal.email}`}>{personal.email} ↗</a><p><a href="https://github.com/masonwng" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/mason-wang-926026353/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><Link href="/contact">other places to find me ↗</Link></p></section>
  </div>;
}
