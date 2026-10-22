import Image from "next/image";
import { projects } from "../lib/portfolio";

const recipe = [
  { id: "1038", name: "B. F. Sword" },
  { id: "1037", name: "Pickaxe" },
  { id: "1018", name: "Cloak of Agility" },
];

export function ProjectPreviews() {
  return (
    <div className="concept-grid">
      {projects.map((project) => (
        <article className="concept-project" key={project.id}>
          <div className={`concept-preview preview-${project.preview}`}>
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
              <div className="math-preview" aria-label="Math Ascension: fourteen stages from Kindergarten to university">
                <div className="math-preview-path"><span>1 + 1</span><span>x²</span><span>∫</span></div>
                <strong>one answer. one level up.</strong>
                <div className="math-preview-track" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} />)}</div>
                <p>Kindergarten <span>→</span> University Year 1</p>
              </div>
            )}
            <span className="sample-label">{project.preview === "math" ? "14 stages · 2 modes" : "daily + practice"}</span>
          </div>
          <div className="concept-title"><h3>{project.title}</h3></div>
          <p className="secondary">{project.description}</p>
          <div className="project-actions">
            <a href={project.href} aria-label={`Play ${project.title}`}>Play Now ↗</a>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} on GitHub`}>GitHub ↗</a>
          </div>
        </article>
      ))}
    </div>
  );
}
