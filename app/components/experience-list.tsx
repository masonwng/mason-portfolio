import type { Experience } from "../lib/portfolio";
import { getExperienceMedia } from "../lib/media";
import { ExperienceMedia } from "./experience-media";
import { OrganizationLogo } from "./organization-logo";
import { PhotoGallery } from "./photo-gallery";
import { Timeline } from "./timeline";

export async function ExperienceList({ entries, hideMedia = false }: { entries: Experience[]; hideMedia?: boolean }) {
  const verifiedEntries = await Promise.all(entries.map(async entry => ({
    entry, media: hideMedia ? null : await getExperienceMedia(entry),
  })));
  return (
    <Timeline className="experience-list">
      {verifiedEntries.map(({ entry, media }) => (
        <article className={`experience tl-item${media?.photos.length ? " experience-featured" : ""}`} key={entry.id} data-reveal="">
          <span className="tl-dot" aria-hidden="true" />
          <div className="experience-summary">
            <div className="organization-entry">
              <OrganizationLogo logo={entry.logo} badge={entry.badge ?? entry.organization.slice(0, 3)} name={entry.organization} />
              <div className="organization-entry-copy"><p className="eyebrow">{entry.role}</p><h3>{entry.organization}</h3></div>
            </div>
            <p className="date"><time dateTime={entry.startDate}>{entry.startLabel}</time>{" – "}{entry.endDate ? <time dateTime={entry.endDate}>{entry.endLabel}</time> : entry.endLabel}</p>
          </div>
          <p className="entry-description">{entry.description[0]}</p>
          {entry.description.length > 1 && (
            <details className="experience-details"><summary>More about this role <span aria-hidden="true">+</span></summary>
              <div>{entry.description.slice(1).map(paragraph => <p className="entry-description" key={paragraph}>{paragraph}</p>)}</div>
            </details>
          )}
          {media && media.photos.length > 0 && <PhotoGallery photos={media.photos} className="photo-grid-editorial" showCaptions ariaLabel={`${entry.organization} photographs`} featuredSizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1352px) calc(100vw - 112px), 1240px" />}
          {media && <ExperienceMedia media={{ ...media, photos: [] }} organization={entry.organization} />}
        </article>
      ))}
    </Timeline>
  );
}
