import type { Metadata } from "next";
import { AwardsList } from "../components/awards-list";
import { OrganizationLogo } from "../components/organization-logo";
import { Reveal } from "../components/reveal";
import { awards, education, experiences, leadership, personal, skills } from "../lib/portfolio";
import { getResumePath } from "../lib/resume";

export const metadata: Metadata = {
  title: "Resume", alternates: { canonical: "/resume" },
  description: "Mason Wang's education, coding instruction, community leadership, awards, and skills.",
};

export default async function ResumePage() {
  const pdf = await getResumePath();
  return (
    <>
      <div className="resume-print-heading"><p className="print-name">{personal.name}</p><p>Vancouver, BC · <a href={`mailto:${personal.email}`}>{personal.email}</a> · <a href="https://www.linkedin.com/in/mason-wang-926026353/">LinkedIn</a></p></div>
      <header className="page-heading"><p className="eyebrow">What I&apos;ve learned along the way</p><h1>Resume.</h1><p className="page-intro">A closer look at my education, experience, and the things I&apos;m learning.</p>{pdf && <a className="text-link" href={pdf} download>Download PDF ↗</a>}</header>
      <div className="resume-layout">
        <div>
          <section className="portfolio-section" aria-labelledby="resume-education"><h2 id="resume-education">Education</h2><div className="organization-entry"><OrganizationLogo logo={education.logo} badge="UBC" name={education.institution} /><div><h3>{education.institution}</h3><p className="entry-role">{education.degree}</p><p className="entry-description">{education.major}</p><p className="date">Vancouver, BC · Expected May 2031</p></div></div></section>
          <Reveal><section className="portfolio-section" aria-labelledby="resume-experience"><h2 id="resume-experience">Experience & leadership</h2><div className="resume-entries">
            {[...experiences, ...leadership].map(entry => <article className="resume-entry" key={entry.id}><p className="eyebrow">{entry.organization}</p><h3>{entry.role}</h3><p className="date">{entry.startLabel} – {entry.endLabel} · {entry.id === "roboedu" ? "Richmond" : "Vancouver"}, BC</p><ul>{entry.description.map(text => <li key={text}>{text}</li>)}</ul></article>)}
          </div></section></Reveal>
        </div>
        <aside className="resume-aside" aria-label="Awards, skills, and contact">
          <Reveal><section className="portfolio-section" aria-labelledby="resume-awards"><h2 id="resume-awards">Awards</h2><AwardsList awards={awards} /></section></Reveal>
          <Reveal><section className="portfolio-section" aria-labelledby="resume-skills"><h2 id="resume-skills">Skills</h2><div className="skill-groups">{Object.entries(skills).map(([group, items]) => <div key={group}><h3>{group}</h3><p className="secondary">{items.join(" · ")}</p></div>)}</div></section></Reveal>
          <section className="portfolio-section resume-contact"><h2>Say hello.</h2><a href={`mailto:${personal.email}`}>{personal.email}</a><a href="https://www.linkedin.com/in/mason-wang-926026353/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></section>
        </aside>
      </div>
    </>
  );
}
