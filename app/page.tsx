import Link from "next/link";
import { ExperienceList } from "./components/experience-list";
import { SocialLinks } from "./components/social-links";
import { PiggySlide } from "./components/piggy-slide";
import { experiences, personal } from "./lib/portfolio";

export default function Home() {
  return (
    <div className="home-layout">
      <header className="portfolio-header home-introduction">
        <h1>{personal.name}</h1>
        <p className="subtitle">{personal.subtitle}</p>
        <h2 className="intro-headline">{personal.headline}</h2>
        <p className="intro-copy">{personal.intro}</p>
        <SocialLinks />
      </header>

      <aside className="piggy-sidebar" aria-label="A little break from work">
        <PiggySlide />
      </aside>

      <div className="home-details">
        <section className="portfolio-section" aria-labelledby="current-heading">
          <h2 id="current-heading">Current work</h2>
          <ExperienceList entries={experiences.map((entry) => ({ ...entry, description: entry.description.slice(0, 1) }))} hideMedia />
          <Link className="text-link" href="/work">More about my work</Link>
        </section>

        <section className="portfolio-section" aria-labelledby="outside-heading">
          <h2 id="outside-heading">Beyond the screen</h2>
          <p className="outside-copy secondary">{personal.interests}</p>
          <Link className="text-link" href="/about">A little more about me</Link>
        </section>
      </div>
    </div>
  );
}
