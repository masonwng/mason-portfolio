import Link from "next/link";
import type { Metadata } from "next";
import { InteractiveName } from "./components/interactive-name";
import { Reveal } from "./components/reveal";
import { SocialLinks } from "./components/social-links";
import { PiggySlide } from "./components/piggy-slide";
import { OrganizationLogo } from "./components/organization-logo";
import { experiences, leadership, personal } from "./lib/portfolio";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <div className="home-layout">
      <header className="portfolio-header home-introduction">
        <div className="hero-name"><InteractiveName /></div>
        <p className="subtitle hero-subtitle">{personal.subtitle}</p>
        <div className="hero-copy">
          <h2 className="intro-headline">{personal.headline}</h2>
          <p className="intro-copy">{personal.intro}</p>
          <SocialLinks />
        </div>
      </header>
      <aside className="piggy-sidebar" aria-label="Play with the pigs"><PiggySlide /></aside>
      <div className="home-details">
        <Reveal>
          <section className="portfolio-section home-work" aria-labelledby="current-heading">
            <div className="section-heading"><h2 id="current-heading">Learning by doing.</h2><Link className="inline-link" href="/work">My work <span aria-hidden="true">↗</span></Link></div>
            <div className="home-roles">
              {[experiences[0], leadership[0]].map(entry => (
                <Link href="/work" className="home-role" key={entry.id}>
                  <OrganizationLogo logo={entry.logo} badge={entry.badge ?? entry.organization} name={entry.organization} />
                  <div><h3>{entry.organization}</h3><p className="secondary">{entry.role}</p></div>
                  <span className="role-arrow" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
        <Reveal>
          <section className="portfolio-section home-outside" aria-labelledby="outside-heading">
            <p className="eyebrow">Beyond the screen</p>
            <h2 id="outside-heading">A little code.<br />A little everything else.</h2>
            <p className="outside-copy secondary">{personal.interests}</p>
            <Link className="text-link" href="/about">A little more about me <span aria-hidden="true">↗</span></Link>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
