import { SiGithub } from "react-icons/si";
import { HiArrowRight } from "react-icons/hi2";
import { ItemdleMini } from "./itemdle-mini";
import { MathMini } from "./math-mini";
import { PiggyBreak } from "./piggy-break";
import { projects } from "../lib/portfolio";


const tags: Record<string, string[]> = {
  itemle: ["daily puzzle", "Builddle", "hard mode"],
  math: ["14 stages", "Time Attack", "K → Uni"],
};

// The latest update to each project, shown on its card. Keep these short and current.
const news: Record<string, string> = {
  itemle: "stats panel, hard mode, and a daily countdown",
  math: "60-second Time Attack and a mountain climb map",
  farm: "8 hidden achievements and real day/night lighting",
};

function News({ text }: { text: string }) {
  return <p className="concept-news"><span>new</span>{text}</p>;
}

export function ProjectPreviews() {
  return (
    <div className="concept-grid">
      {projects.map((project) => (
        <article className="concept-project" key={project.id}>
          <div className={`concept-preview preview-${project.preview}`}>
            {project.preview === "itemle" ? <ItemdleMini /> : <MathMini />}
          </div>
          <div className="concept-body">
            <div className="concept-title">
              <h3>{project.title}</h3>
              <span className="concept-status"><span className="status-dot" aria-hidden="true" />live</span>
            </div>
            <p className="secondary">{project.description}</p>
            <News text={news[project.preview]} />
            <ul className="concept-tags" aria-label="Features">{tags[project.preview].map(t => <li key={t}>{t}</li>)}</ul>
            <div className="project-actions">
              <a className="btn btn-primary btn-sm" href={project.href} aria-label={`Play ${project.title}`}>Play <HiArrowRight aria-hidden="true" /></a>
              <a className="btn btn-ghost btn-sm" href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} on GitHub`}><SiGithub aria-hidden="true" /> Source</a>
            </div>
          </div>
        </article>
      ))}
      <article className="concept-project farm-project" id="farm" aria-labelledby="farm-project-title">
        <div className="concept-body farm-body">
          <div className="concept-title"><h3 id="farm-project-title">Farm</h3><span className="concept-status">3D · playable</span></div>
          <p className="secondary">3D modelling, just for fun. Click the pigs, pick the carrots, drag things around.</p>
          <News text={news.farm} />
        </div>
        <PiggyBreak />
      </article>
    </div>
  );
}
