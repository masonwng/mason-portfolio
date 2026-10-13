import type { Metadata } from "next";
import { AwardsList } from "../components/awards-list";
import { ExperienceList } from "../components/experience-list";
import { awards, experiences, leadership, projects } from "../lib/portfolio";

export const metadata: Metadata = {
  title: "Work",
  description: "Mason Wang's coding instruction, leadership experience, competition awards, and software projects.",
};

export default function WorkPage() {
  return (
    <>
      <header className="page-heading"><h1>Work</h1></header>

      <section className="portfolio-section" aria-labelledby="experience-heading">
        <h2 id="experience-heading">Experience</h2>
        <ExperienceList entries={experiences} />
      </section>

      <section className="portfolio-section" aria-labelledby="leadership-heading">
        <h2 id="leadership-heading">Leadership</h2>
        <ExperienceList entries={leadership} leadership />
      </section>

      <section className="portfolio-section" aria-labelledby="awards-heading">
        <h2 id="awards-heading">Awards</h2>
        <AwardsList awards={awards} />
      </section>

      <section className="portfolio-section" aria-labelledby="projects-heading">
        <h2 id="projects-heading">Projects</h2>
        {projects.length === 0 ? (
          <p className="secondary">More projects coming soon.</p>
        ) : (
          <div className="experience-list">
            {projects.map((project) => (
              <article className="experience" key={project.id}>
                <h3>{project.title}</h3>
                <p className="entry-description">{project.description}</p>
                {(project.href || project.githubUrl) && (
                  <div className="project-links">
                    {project.href && (
                      <a href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title}`}>
                        View project
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} on GitHub`}>
                        GitHub
                      </a>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
