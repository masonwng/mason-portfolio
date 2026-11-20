import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import { HiArrowRight, HiArrowUpRight, HiOutlineEnvelope } from "react-icons/hi2";
import { CountUp } from "./components/count-up";
import { EmailCopy } from "./components/email-copy";
import { HeroName } from "./components/hero-name";
import { HeroStage } from "./components/hero-stage";
import { Magnetic } from "./components/magnetic";
import { OrganizationLogo } from "./components/organization-logo";
import { PageTransition } from "./components/page-transition";
import { ProjectPreviews } from "./components/project-previews";
import { ScrollLink } from "./components/scroll-link";
import { Scoreboard } from "./components/scoreboard";
import { SectionHeading } from "./components/section-heading";
import { Timeline } from "./components/timeline";
import { WaveText } from "./components/wave-text";
import { awards, experiences, leadership, personal, projects } from "./lib/portfolio";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const byId = (id: string) => [...experiences, ...leadership].find(e => e.id === id)!;
const now = [
  { entry: { ...byId("roboedu"), role: "Coding Instructor & Frontend Developer" }, blurb: "I teach coding and robotics to kids, and now work on RoboEDU’s frontend too." },
  { entry: byId("cus-fyc"), blurb: "VP External on the Commerce Undergraduate Society’s First Year Committee." },
  { entry: byId("cjd"), blurb: "Helping run mentorship at CJD." },
  { entry: byId("yac"), blurb: "I help organize events, workshops, fundraising, and social posts." },
];

const highlights = [
  { value: "50+", label: "students taught to code" },
  { value: String(awards.length), label: "competition awards" },
  { value: String(projects.length + 1), label: "things built for fun" },
  { value: "’29", label: "UBC BUCS class" },
];

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

export default function Home() {
  return (
    <PageTransition>
      <div className="home">
        <HeroStage
          copy={<>
            <p className="status-pill hero-in" style={delay(0)}><span className="status-dot" aria-hidden="true" />First-year BUCS at UBC</p>
            <HeroName />
            <p className="hero-lede hero-in" style={delay(520)}>{personal.subtitle} {personal.intro}</p>
            <div className="hero-actions hero-in" style={delay(640)}>
              <Magnetic><ScrollLink className="btn btn-primary" id="projects">See what I’ve made <HiArrowRight aria-hidden="true" /></ScrollLink></Magnetic>
              <Magnetic><Link className="btn btn-ghost" href="/resume">Resume</Link></Magnetic>
            </div>
            <div className="hero-social hero-in" style={delay(760)} aria-label="Elsewhere">
              <Magnetic strength={.45}><a href="https://github.com/masonwng" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><SiGithub aria-hidden="true" /></a></Magnetic>
              <Magnetic strength={.45}><a href="https://www.linkedin.com/in/mason-wang-926026353/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><FaLinkedinIn aria-hidden="true" /></a></Magnetic>
              <Magnetic strength={.45}><EmailCopy email={personal.email}><HiOutlineEnvelope aria-hidden="true" /></EmailCopy></Magnetic>
            </div>
          </>}
          portrait={<>
            <div className="hero-portrait-frame">
              <Image src="/media/mason-portrait.jpg" alt="Mason at a restaurant, giving two thumbs up over dinner" width={1242} height={2208} sizes="(max-width:700px) 72vw, 360px" preload />
            </div>
            <figcaption>hey, that’s me 👋</figcaption>
          </>}
        />

        <ul className="highlights" aria-label="Highlights">
          {highlights.map((h, i) => (
            <li key={h.label} data-reveal="" style={delay(i * 70)}><strong><CountUp value={h.value} /></strong><span>{h.label}</span></li>
          ))}
        </ul>

        <section id="projects" className="home-section" aria-labelledby="projects-heading">
          <SectionHeading num="01" label="projects" title="things I made" id="projects-heading"
            action={<a className="inline-link" href="https://github.com/masonwng" target="_blank" rel="noopener noreferrer">all on GitHub <HiArrowUpRight aria-hidden="true" /></a>} />
          <ProjectPreviews />
          <Scoreboard />
        </section>

        <section id="experience" className="home-section" aria-labelledby="experience-heading">
          <SectionHeading num="02" label="now" title="what I’m up to" id="experience-heading"
            action={<Link href="/work" className="inline-link">all experience <HiArrowRight aria-hidden="true" /></Link>} />
          <Timeline className="now-list">
            {now.map(({ entry, blurb }, i) => (
              <Link href="/work" className="now-item tl-item" key={entry.id} data-reveal="" style={delay(i * 60)}>
                <span className="tl-dot" aria-hidden="true" />
                <OrganizationLogo logo={entry.logo} badge={entry.badge ?? entry.organization.slice(0, 3)} name={entry.organization} />
                <div className="now-copy">
                  <h3>{entry.organization}</h3>
                  <p className="now-role">{entry.role}</p>
                  <p className="secondary">{blurb}</p>
                </div>
                <p className="date">{entry.startLabel} – {entry.endLabel.toLowerCase()}</p>
              </Link>
            ))}
          </Timeline>
        </section>

        <section className="home-section bento" aria-label="More about me">
          <article className="bento-card bento-about" data-reveal="">
            <div className="bento-about-copy">
              <div className="section-heading section-heading-compact">
                <span className="section-num" aria-hidden="true">03</span>
                <div className="section-heading-copy">
                  <p className="eyebrow">03 / outside school</p>
                  <h2 className="wave-trigger"><WaveText text="off the screen" /></h2>
                </div>
              </div>
              <p className="secondary">{personal.interests}</p>
              <Link href="/about" className="inline-link">more about me <HiArrowRight aria-hidden="true" /></Link>
            </div>
            <figure>
              <Image src="/media/hobbies/steak.jpg" alt="Steak and potatoes Mason cooked, served on a black plate" width={600} height={450} sizes="(max-width:700px) 100vw, 300px" />
              <figcaption>made this</figcaption>
            </figure>
          </article>
          <article id="contact" className="bento-card bento-contact" data-reveal="" style={delay(90)}>
            <span className="section-num" aria-hidden="true">04</span>
            <p className="eyebrow">04 / contact</p>
            <h2 className="wave-trigger"><WaveText text="say hi." /></h2>
            <p>Questions, ideas, or just want to chat? My inbox is open.</p>
            <Magnetic><EmailCopy email={personal.email} className="btn btn-invert">Copy my email</EmailCopy></Magnetic>
            <Link href="/contact" className="bento-contact-link">other places to find me <HiArrowRight aria-hidden="true" /></Link>
          </article>
        </section>
      </div>
    </PageTransition>
  );
}
