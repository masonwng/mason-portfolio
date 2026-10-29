import type { Metadata } from "next";
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
      <section className="portfolio-section" id="outside-school" aria-labelledby="hobbies-heading">
        <div className="hobby-section-heading"><h2 id="hobbies-heading">outside school</h2><span>little things I enjoy</span></div>
        <div className="hobby-journal">
          <article className="hobby-snapshot">
            <span className="hobby-photo-label">01 / outdoors</span>
            <PhotoGallery className="hobby-photo" sizes="(max-width:700px) calc(100vw - 40px), 420px" ariaLabel="Hiking photograph" photos={[{ id: 'hiking', src: '/media/hobbies/hiking.jpg', width: 1170, height: 1560, title: 'out for a hike', alt: 'A mountain viewpoint above forested slopes beneath a wide blue sky' }]} />
            <h3>out for a hike</h3><p>I like getting outside for a hike.</p>
          </article>
          <article className="hobby-snapshot">
            <span className="hobby-photo-label">02 / in the kitchen</span>
            <PhotoGallery className="hobby-photo" sizes="(max-width:700px) calc(100vw - 40px), 420px" ariaLabel="Cooking photograph" photos={[{ id: 'steak', src: '/media/hobbies/steak.jpg', width: 2160, height: 2880, title: 'made this. steak & potatoes.', alt: 'The full portrait photo of sliced steak and potatoes on a black plate' }]} />
            <h3>made this.</h3><p>Steak &amp; potatoes. Trying new recipes when I have time.</p>
          </article>
        </div>
        <div className="hobby-also"><span>also into</span><ul><li>working out</li><li>kickboxing</li><li>gaming</li><li>time with friends &amp; family</li></ul></div>
      </section>
      {photos.length > 1 && <Reveal><section className="portfolio-section" aria-labelledby="photos-heading"><h2 id="photos-heading">A few moments.</h2><PhotoGallery photos={photos.slice(1)} showCaptions /></section></Reveal>}
    </>
  );
}
