import type { Experience } from "../lib/portfolio";
import { getExperienceMedia } from "../lib/media";
import { ExperienceMedia } from "./experience-media";
import { OrganizationLogo } from "./organization-logo";

export async function ExperienceList({
  entries,
  leadership = false,
  hideMedia = false,
}: {
  entries: Experience[];
  leadership?: boolean;
  hideMedia?: boolean;
}) {
  if (entries.length === 0) return null;
  const verifiedEntries = await Promise.all(entries.map(async (entry) => ({
    entry,
    media: hideMedia ? null : await getExperienceMedia(entry),
  })));

  return (
    <div className="experience-list">
      {verifiedEntries.map(({ entry, media }) => (
        <article className="experience" key={entry.id}>
          <div className="organization-entry">
            <OrganizationLogo logo={entry.logo} badge={entry.badge ?? entry.organization.slice(0, 3)} name={entry.organization} />
            <div className="organization-entry-copy">
              <div className="entry-top">
                <h3>{leadership ? entry.role : entry.organization}</h3>
                <p className="date">
                  <time dateTime={entry.startDate}>{entry.startLabel}</time>
                  {" – "}
                  {entry.endDate ? (
                    <time dateTime={entry.endDate}>{entry.endLabel}</time>
                  ) : entry.endLabel}
                </p>
              </div>
              <p className="entry-role">{leadership ? entry.organization : entry.role}</p>
              {entry.description.map((paragraph) => (
                <p className="entry-description" key={paragraph}>{paragraph}</p>
              ))}
              {media && <ExperienceMedia media={media} organization={entry.organization} />}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
