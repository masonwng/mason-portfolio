import type { Metadata } from "next";
import { HobbySection } from "../components/hobby-section";
import { OrganizationLogo } from "../components/organization-logo";
import { PhotoGallery } from "../components/photo-gallery";
import { education, personal } from "../lib/portfolio";
import { getPhotos } from "../lib/photos";

export const metadata: Metadata = {
  title: "About",
  description: "A little about Mason Wang, a Business and Computer Science student at UBC.",
};

export default async function AboutPage() {
  const photos = await getPhotos();

  return (
    <>
      <header className="portfolio-header">
        <h1 className="page-heading">A little about me.</h1>
        <div className="about-copy">
          {personal.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </header>

      <section className="portfolio-section" aria-labelledby="education-heading">
        <h2 id="education-heading">Education</h2>
        <article className="experience">
          <div className="experience-heading">
            <OrganizationLogo
              logo={education.logo}
              badge={education.badge}
              name={education.institution}
            />
            <div className="experience-copy">
              <div className="entry-top">
                <h3>{education.institution}</h3>
                <p className="date">
                  <time dateTime={education.startDate}>{education.startLabel}</time>
                  {" – "}
                  {education.endDate ? (
                    <time dateTime={education.endDate}>{education.endLabel}</time>
                  ) : education.endLabel}
                </p>
              </div>
              <p className="entry-role">{education.degree}</p>
              <p className="entry-description">{education.major}</p>
            </div>
          </div>
        </article>
      </section>

      <section className="portfolio-section" aria-labelledby="hobbies-heading">
        <h2 id="hobbies-heading">Outside the terminal</h2>
        <p className="secondary">
          Away from my screen, I make time for the things that keep me moving,
          curious, and connected.
        </p>
        <HobbySection />
      </section>

      {photos.length > 0 && (
        <section className="portfolio-section" aria-labelledby="photos-heading">
          <h2 id="photos-heading">A few moments</h2>
          <PhotoGallery photos={photos} />
        </section>
      )}
    </>
  );
}
