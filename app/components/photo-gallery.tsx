"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent } from "react";
import type { Photo } from "../lib/photos";

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const captionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!selectedPhoto || !dialog) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    dialog.querySelector<HTMLButtonElement>(".photo-dialog-close")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [selectedPhoto]);

  function openPhoto(photo: Photo, event: MouseEvent<HTMLButtonElement>) {
    triggerRef.current = event.currentTarget;
    setSelectedPhoto(photo);
  }

  function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom
    ) {
      event.currentTarget.close();
    }
  }

  if (photos.length === 0) return null;

  return (
    <>
      <div className="photo-grid" aria-label="Personal photographs">
        {photos.map((photo) => (
          <button
            className="photo-button"
            key={photo.id}
            type="button"
            aria-label={`Enlarge photograph: ${photo.alt}`}
            aria-haspopup="dialog"
            onClick={(event) => openPhoto(photo, event)}
          >
            <Image
              className="photo-image"
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 600px) calc((100vw - 60px) / 2), (max-width: 850px) calc((100vw - 72px) / 3), 267px"
            />
          </button>
        ))}
      </div>
      <dialog
        className="photo-dialog"
        ref={dialogRef}
        aria-labelledby={captionId}
        onClick={closeOnBackdrop}
        onClose={() => setSelectedPhoto(null)}
      >
        <div className="photo-dialog-content">
          <button
            className="photo-dialog-close"
            type="button"
            onClick={() => dialogRef.current?.close()}
          >
            Close
          </button>
          {selectedPhoto && (
            <figure>
              <div className="photo-enlarged">
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  fill
                  sizes="(max-width: 900px) calc(100vw - 48px), 852px"
                />
              </div>
              <figcaption className="photo-caption" id={captionId}>
                {selectedPhoto.title}
              </figcaption>
            </figure>
          )}
        </div>
      </dialog>
    </>
  );
}
