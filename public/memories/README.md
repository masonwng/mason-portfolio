# Personal photo gallery

No personal photograph files are currently available in the project. The
configured subjects can be added to this directory using these filenames:

- sister.jpg — the photo of Mason and his sister
- friend.jpg — the mirror photo with his friend
- cats.jpg — the two cats in the sunlight
- graduation.jpg — Mason in his graduation gown
- hiking.jpg — a hiking photo

The About page shows every configured photograph whose file actually exists.
The gallery uses two columns on mobile and three on desktop, preserving each
image's natural aspect ratio. Click a photograph to enlarge it; the dialog
supports keyboard navigation and Escape to close.

The entire gallery section stays hidden when no configured photographs exist.
No placeholder labels or missing-file notices appear on the public website.

The gallery accepts .jpg, .jpeg, .png, .webp, and .avif, including uppercase
extensions. Match the filenames above by subject; the original extension and
capitalization are preserved in image URLs. Check the captions and alternative
text against your originals when adding files.

Edit photoDetails in app/lib/portfolio.ts to add a subject, change its caption
or alternative text, or supply an explicit src such as /photos/hike.JPG for a
file stored elsewhere in public/. Without src, the loader matches each id to
the filename before its extension in this directory, ignoring case.

File discovery and image dimensions are handled by getPhotos in
app/lib/photos.ts. It reads dimensions with Sharp, including EXIF orientation,
and renders the real files through next/image.

Restart development or rebuild production after adding photographs because
file discovery is cached.
