import { hobbies } from "../lib/portfolio";
import { getImageAsset } from "../lib/media";
import { PhotoGallery } from "./photo-gallery";

export async function HobbySection() {
  const entries = await Promise.all(hobbies.map(async (hobby) => ({
    ...hobby,
    asset: hobby.image ? await getImageAsset(hobby.image.src) : null,
  })));

  return (
    <div className="hobby-editorial">
      {entries.map((hobby) => (
        <article
          className={`hobby-row${hobby.asset ? " hobby-row-has-image" : ""}`}
          key={hobby.id}
        >
          <div className="hobby-copy">
            <h3>{hobby.title}</h3>
            <p className="secondary">{hobby.description}</p>
          </div>
          {hobby.asset && hobby.image && (
            <div className="hobby-media">
              <PhotoGallery
                photos={[{
                  ...hobby.asset,
                  id: hobby.id,
                  title: hobby.caption ?? hobby.title,
                  alt: hobby.image.alt,
                }]}
                className="photo-grid-single"
                ariaLabel={`${hobby.title} photograph`}
                showCaptions={Boolean(hobby.caption)}
                sizes="(max-width: 600px) calc(100vw - 48px), 170px"
              />
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
