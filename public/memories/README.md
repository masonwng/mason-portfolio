# Personal photo gallery

The uploaded `IMG_5670.jpg` mirror photograph is mapped to the `friend` entry
in `app/lib/portfolio.ts`. The About page displays it under A few moments using
its actual filename and extension.

Other optional personal photo entries currently have no original files:

- sister.jpg — Mason and his sister
- cats.jpg — the cats
- graduation.jpg — graduation
- hiking.jpg — an optional photo for the personal gallery

The existing hiking photograph is already displayed in the hobby section from
`public/media/hobbies/hiking.jpg`; it does not need to be duplicated here.

Edit `photoDetails` in `app/lib/portfolio.ts` to add subjects, change captions or
alternative text, or supply an explicit local `src`. Supported extensions are
.jpg, .jpeg, .png, .webp, and .avif, including uppercase extensions. Real names
and extensions are preserved. Without an explicit src, the loader matches the
entry id to the filename before its extension in this directory.

Only existing, valid files appear. Natural dimensions include EXIF orientation.
The gallery uses two columns on mobile and three on desktop. Each image opens
an accessible dialog with keyboard controls, Escape, and focus restoration.

The entire section stays hidden if there are no configured files. There are no
placeholder labels. Restart development or rebuild production after adding
files, since server-side discovery is cached.
