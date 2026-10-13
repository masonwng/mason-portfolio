import type { Experience } from "../lib/portfolio";

export function ExperienceList({
  entries,
  leadership = false,
}: {
  entries: Experience[];
  leadership?: boolean;
}) {
  if (entries.length === 0) return null;

  return (
    <div className="experience-list">
      {entries.map((entry) => (
        <article className="experience" key={entry.id}>
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
        </article>
      ))}
    </div>
  );
}
