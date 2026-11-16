import type { Metadata } from "next";
import { PageTransition } from "../components/page-transition";
import { AwardsList } from "../components/awards-list";
import { ExperienceList } from "../components/experience-list";
import { awards, experiences, leadership } from "../lib/portfolio";
import { ProjectPreviews } from "../components/project-previews";
import { Reveal } from "../components/reveal";
import { WaveText } from "../components/wave-text";

export const metadata: Metadata = {
  title: "Work",
  alternates: { canonical: "/work" },
  description: "Mason Wang's coding instruction, leadership experience, competition awards, and software projects.",
};

export default function WorkPage() {
  return (
    <PageTransition>
      <header className="page-heading"><p className="eyebrow">work / experience</p><h1>What I’ve been doing.</h1><p className="page-intro">Work, school events, and a few competitions.</p></header>

      <section className="portfolio-section" aria-labelledby="experience-heading">
        <h2 id="experience-heading" className="wave-trigger"><WaveText text="Experience" /></h2>
        <ExperienceList entries={experiences} />
      </section>

      <section className="portfolio-section" aria-labelledby="leadership-heading">
        <h2 id="leadership-heading" className="wave-trigger"><WaveText text="Leadership" /></h2>
        <ExperienceList entries={leadership} />
      </section>

      <Reveal><section className="portfolio-section awards-section" aria-labelledby="awards-heading">
        <h2 id="awards-heading" className="wave-trigger"><WaveText text="Awards" /></h2>
        <AwardsList awards={awards} />
      </section></Reveal>

      <section className="portfolio-section" aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="wave-trigger"><WaveText text="projects" /></h2>
        <ProjectPreviews />
      </section>
    </PageTransition>
  );
}
