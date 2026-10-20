import Image from "next/image";
import { projects } from "../lib/portfolio";
export function ProjectPreviews() {
  return <div className="concept-grid">{projects.map(project=><article className="concept-project" key={project.id}>
    <div className={`concept-preview preview-${project.preview}`}>
      {project.preview==='itemle'?<div className="itemle-preview"><p>what does this build into?</p><div className="itemle-recipe">{[{id:'1038',name:'B. F. Sword'},{id:'1037',name:'Pickaxe'},{id:'1018',name:'Cloak of Agility'}].map(item=><figure key={item.id}><Image src={`/projects/itemle/assets/items/${item.id}.png`} alt={item.name} width={48} height={48} unoptimized/><figcaption>{item.name}</figcaption></figure>)}</div><span>unlimited guesses. what’s your rank?</span></div>:<div className="lane-entry"><div className="lane-entry-top"><span>top lane</span><span>sample data</span></div><strong>Garen <span>vs.</span> Darius</strong><div className="lane-stats"><p><b>62</b>CS @ 10</p><p><b>94</b>CS @ 15</p><p><b>1</b>death before 15</p></div><p className="lane-note">next game: let the wave come to me before trading.</p></div>}
      <span className="sample-label">{project.preview==='lane'?'sample entry':'recipe preview'}</span>
    </div>
    <div className="concept-title"><h3>{project.title}</h3></div>
    <p className="secondary">{project.description}</p><div className="project-actions"><a href={project.href}>{project.id==='itemle'?'play ↗':'open journal ↗'}</a><a href={project.githubUrl} target="_blank" rel="noopener noreferrer">GitHub ↗</a></div>
  </article>)}</div>;
}
