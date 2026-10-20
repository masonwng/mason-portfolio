import type { Metadata } from "next";
import Image from "next/image";
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
        <div className="about-introduction-copy"><h1>about me.</h1><div className="about-copy">{personal.about.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></div>
        {photos.length > 0 && <div className="about-portrait"><PhotoGallery photos={[photos[0]]} className="photo-grid-single" showCaptions sizes="(max-width: 700px) calc(100vw - 40px), 45vw" /></div>}
      </header>
      <Reveal><section className="portfolio-section education-section" aria-labelledby="education-heading">
        <h2 id="education-heading">Currently at UBC.</h2>
        <article className="organization-entry"><OrganizationLogo logo={education.logo} badge={education.badge} name={education.institution} /><div><h3>{education.institution}</h3><p>{education.degree}</p><p className="secondary">{education.major}</p><p className="date">First year · Expected graduation {education.graduation}</p></div></article>
      </section></Reveal>
      <section className="portfolio-section" aria-labelledby="hobbies-heading"><h2 id="hobbies-heading">outside school</h2><p className="reading-copy secondary">{personal.interests}</p><div className="personal-photos"><figure><Image src="/media/hobbies/hiking.jpg" alt="A mountain viewpoint above forested slopes" width={640} height={480} sizes="(max-width:700px) 100vw, 50vw"/><figcaption>out for a hike</figcaption></figure><figure><Image src="/media/hobbies/steak.jpg" alt="Steak and potatoes Mason cooked" width={640} height={480} sizes="(max-width:700px) 100vw, 50vw"/><figcaption>made this</figcaption></figure></div></section>
      {photos.length > 1 && <Reveal><section className="portfolio-section" aria-labelledby="photos-heading"><h2 id="photos-heading">A few moments.</h2><PhotoGallery photos={photos.slice(1)} showCaptions /></section></Reveal>}
    </>
  );
}
