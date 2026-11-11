import Image from "next/image";
import { SiGithub } from "react-icons/si";
import { HiArrowRight } from "react-icons/hi2";
import { PiggyBreak } from "./piggy-break";
import { projects } from "../lib/portfolio";

const recipe = [
  { id: "1038", name: "B. F. Sword" },
  { id: "1037", name: "Pickaxe" },
  { id: "1018", name: "Cloak of Agility" },
];

const tags: Record<string, string[]> = {
  itemle: ["daily puzzle", "Builddle", "League"],
  math: ["14 stages", "2 modes", "K → Uni"],
};

export function ProjectPreviews() {
  return (
    <div className="concept-grid">
      {projects.map((project) => (
        <article className="concept-project" key={project.id}>
          <a className={`concept-preview preview-${project.preview}`} href={project.href} tabIndex={-1} aria-hidden="true">
            {project.preview === "itemle" ? (
              <div className="itemle-preview">
                <p>what does this build into?</p>
                <div className="itemle-recipe">
                  {recipe.map((item) => (
                    <figure key={item.id}>
                      <Image src={`/projects/itemle/assets/items/${item.id}.png`} alt={item.name} width={48} height={48} unoptimized />
                      <figcaption>{item.name}</figcaption>
                    </figure>
                  ))}
                </div>
                <span>unlimited guesses. what’s your rank?</span>
              </div>
            ) : (
              <div className="math-preview">
                <div className="math-preview-path"><span>1 + 1</span><span>x²</span><span>∫</span></div>
                <strong>one answer. one level up.</strong>
                <div className="math-preview-track">{Array.from({ length: 14 }, (_, i) => <i key={i} />)}</div>
                <p>Kindergarten <span>→</span> University Year 1</p>
              </div>
            )}
          </a>
          <div className="concept-body">
            <div className="concept-title">
              <h3>{project.title}</h3>
              <span className="concept-status"><span className="status-dot" aria-hidden="true" />live</span>
            </div>
            <p className="secondary">{project.description}</p>
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
        </div>
        <PiggyBreak />
      </article>
    </div>
  );
}
