"use client";

import { useId, useState } from "react";
import type { ExperienceMediaAssets } from "../lib/media";
import { PhotoGallery } from "./photo-gallery";

export function ExperienceMedia({
  media,
  organization,
}: {
  media: ExperienceMediaAssets;
  organization: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();
  if (!media.photos.length && !media.videos.length && !media.links.length) return null;

  const label = media.photos.length && media.videos.length
    ? "View photos & videos"
    : media.photos.length ? "View photos" : media.videos.length ? "View videos" : "View links";

  return (
    <details className="experience-media" onToggle={(event) => setExpanded(event.currentTarget.open)}>
      <summary className="experience-media-toggle" aria-controls={contentId}>
        <span>{label}</span><span className="experience-media-chevron" aria-hidden="true">+</span>
      </summary>
      <div className="experience-media-content" id={contentId}>
        {expanded && (
          <>
            <PhotoGallery photos={media.photos} showCaptions ariaLabel={`${organization} photographs`} />
            {media.videos.length > 0 && (
              <div className="experience-video-grid">
                {media.videos.map((video) => (
                  <figure className="experience-video" key={video.id}>
                    <video controls preload="metadata" poster={video.poster} aria-label={video.title} playsInline>
                      <source src={video.src} type={video.mimeType} />
                      {video.captionsSrc && <track kind="captions" src={video.captionsSrc} srcLang="en" label="English" default />}
                      Your browser does not support this video. <a href={video.src}>Open {video.title}</a>.
                    </video>
                    <figcaption className="photo-caption">{video.caption ?? video.title}</figcaption>
                    {video.externalLink && (
                      <a className="text-link" href={video.externalLink.href} target="_blank" rel="noopener noreferrer">
                        {video.externalLink.label}
                      </a>
                    )}
                  </figure>
                ))}
              </div>
            )}
            {media.links.map((link) => (
              <a className="text-link" key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
            ))}
          </>
        )}
      </div>
    </details>
  );
}
