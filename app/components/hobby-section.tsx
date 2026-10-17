import { hobbies } from "../lib/portfolio";
import { getImageAsset } from "../lib/media";
import { PhotoGallery } from "./photo-gallery";
import { Reveal } from "./reveal";

export async function HobbySection() {
  const entries = await Promise.all(hobbies.map(async hobby => ({
    ...hobby, asset: hobby.image ? await getImageAsset(hobby.image.src) : null,
  })));
  return (
    <>
      <div className="hobby-editorial">
        {entries.filter(hobby => hobby.asset && hobby.image).map(hobby => (
          <Reveal key={hobby.id}>
            <article className="hobby-row hobby-row-has-image">
              <div className="hobby-copy"><p className="eyebrow">Off screen</p><h3>{hobby.title}</h3><p className="secondary">{hobby.description}</p></div>
              <div className="hobby-media"><PhotoGallery photos={[{ ...hobby.asset!, id: hobby.id, title: hobby.caption ?? hobby.title, alt: hobby.image!.alt }]} className="photo-grid-single" ariaLabel={`${hobby.title} photograph`} showCaptions sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1280px) 55vw, 650px" /></div>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal><div className="hobby-notes">{entries.filter(hobby => !hobby.asset).map(hobby => <div key={hobby.id}><h3>{hobby.title}</h3><p className="secondary">{hobby.description}</p></div>)}</div></Reveal>
    </>
  );
}
