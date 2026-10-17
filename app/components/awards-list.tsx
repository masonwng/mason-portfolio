import type { Award } from "../lib/portfolio";

export function AwardsList({ awards }: { awards: Award[] }) {
  if (awards.length === 0) return null;

  return (
    <div className="experience-list">
      {[...awards].sort((a, b) => b.date.localeCompare(a.date)).map((award) => (
        <article className="experience" key={award.id}>
          <div className="entry-top">
            <h3>{award.title}</h3>
            <p className="date"><time dateTime={award.date}>{award.dateLabel}</time></p>
          </div>
          {award.result && <p className="entry-description">{award.result}</p>}
        </article>
      ))}
    </div>
  );
}
