import type { Metadata } from "next";
import { HobbySection } from "../components/hobby-section";
import { OrganizationLogo } from "../components/organization-logo";
import { PhotoGallery } from "../components/photo-gallery";
import { Reveal } from "../components/reveal";
import { education, personal } from "../lib/portfolio";
import { getPhotos } from "../lib/photos";

export const metadata: Metadata = {
  title: "About", alternates: { canonical: "/about" },
  description: "A little about Mason Wang, a Business and Computer Science student at UBC.",
};

export default async function AboutPage() {
  const photos = await getPhotos();
  return (
    <>
      <header className="about-introduction portfolio-header">
        <div className="about-introduction-copy"><p className="eyebrow">The person behind the screen</p><h1>A little<br />about me.</h1><div className="about-copy">{personal.about.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></div>
        {photos.length > 0 && <div className="about-portrait"><PhotoGallery photos={[photos[0]]} className="photo-grid-single" showCaptions sizes="(max-width: 700px) calc(100vw - 40px), 45vw" /></div>}
      </header>
      <Reveal><section className="portfolio-section education-section" aria-labelledby="education-heading">
        <h2 id="education-heading">Currently at UBC.</h2>
        <article className="organization-entry"><OrganizationLogo logo={education.logo} badge={education.badge} name={education.institution} /><div><h3>{education.institution}</h3><p>{education.degree}</p><p className="secondary">{education.major}</p><p className="date">First year · Expected graduation {education.graduation}</p></div></article>
      </section></Reveal>
      <section className="portfolio-section" aria-labelledby="hobbies-heading"><p className="eyebrow">A change of pace</p><h2 className="section-title" id="hobbies-heading">Outside the terminal.</h2><HobbySection /></section>
      {photos.length > 1 && <Reveal><section className="portfolio-section" aria-labelledby="photos-heading"><h2 id="photos-heading">A few moments.</h2><PhotoGallery photos={photos.slice(1)} showCaptions /></section></Reveal>}
    </>
  );
}
