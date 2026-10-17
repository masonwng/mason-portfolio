# Mason Wang's portfolio

A minimalist Next.js 16 portfolio with Home, Work, About, and Contact pages.
Built with React 19, TypeScript, Geist Sans, and Tailwind CSS 4.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. The application uses `app/`, not `src/app/`.

```sh
npm run lint
npm run build
npm start
```

## Edit content

Personal copy, official social profiles, experience, leadership, awards,
education, projects, hobbies, photo descriptions, and the optional resume path
live in `app/lib/portfolio.ts`. All public pages read the shared data.
Projects stay empty until real project details are available.

The official LinkedIn profile is configured once. External profile links open
in a new tab. Discord has a copy-username control, without a fabricated profile
URL. Contact and the footer use the supplied email address.

## Themes and styling

The shared navigation includes a dark/light switch powered by `next-themes`.
The initial theme follows the system preference; explicit selections persist
in local storage under `mason-portfolio-theme`. The provider initializes the
HTML theme before painting, and the toggle has stable server/client markup.

`app/layout.tsx` imports `app/tailwind.css` first, then `app/globals.css`.
Tailwind 4's import/theme entry alone uses the installed Turbopack loader.
Ordinary portfolio CSS stays on Next.js's native pipeline so it updates live
without the stale Tailwind compiler issue diagnosed in the previous design.
Light/dark palette variables, spacing, typography, and responsive layouts live
in `globals.css`. New theme colors preserve the same centered foundation.

## Photographs and resume

Uploaded logos, event photographs, hobby photographs, and a personal mirror
photo are included. An optional resume PDF is not present. See
`public/memories/README.md` for personal photo configuration. Only files that
actually exist are displayed; no placeholder tiles appear.

Photo discovery preserves real filenames and extensions. `sharp` reads each
photo's orientation and natural dimensions; `next/image` renders responsive
thumbnails. The native enlargement dialog supports keyboard interaction,
Escape, backdrop clicks, scroll locking, and focus restoration.

A resume download appears on Contact only when the configured PDF exists in
`public/` (default: `public/resume.pdf`). Add the real originals/PDF, then restart
development or rebuild production to refresh file discovery.

The latest additions keep the four existing pages and design, with small
organization logos, expandable experience media, hobby photographs, and an
isolated Piggy Slide widget.

## Media configuration

Edit logo paths, badge fallback text, experience photos/videos/mediaLinks,
structured hobbies, and personal photos in `app/lib/portfolio.ts`. Logo entries
can set `approved: false` to show the text badge instead. Only use logos you are
allowed to use. Uploaded originals remain untouched.

`app/lib/media.ts` verifies local paths, actual files, image dimensions and
orientation. Missing or invalid media is omitted. The IB Director gallery uses
the four uploaded event photographs confirmed by Mason. No RoboEDU event photos
or videos were supplied, so no gallery is invented for that experience.

Images load through `next/image`. Experience images and native videos mount
only after the gallery is expanded. Video entries support captions, posters,
optional subtitle tracks, and external links; playback has controls,
`preload="metadata"`, and no autoplay. Photography uses keyboard-accessible
native enlargement dialogs with Escape and focus restoration.

Hiking and cooking photographs live in `public/media/hobbies/`; hobbies without
photos retain their descriptions. The existing mirror photo is configured
using its actual `public/memories/IMG_5670.jpg` filename.

## Piggy Slide

The widget dynamically imports `app/components/piggy-slide-scene.tsx` on the
client when it is visible and opened. It uses Three.js, React Three Fiber,
Drei, and Rapier. The installed Fiber version explicitly supports React 19.3.
Original box geometry creates the miniature scene; no game textures or models
are downloaded. Rapier's WASM is bundled locally.

Dragging makes a pig kinematic; releasing restores its dynamic rigid body and
gravity. Fixed colliders form the ground, slide and mud, with a mud sensor and
safety boundaries. The count selector mounts one, two, or three actual pigs and
physics bodies, in pink, spotted, and brown order. Reset clears body motion,
dragging and splashes while preserving the count and camera orientation.
Drag empty space to orbit the camera; dragging a pig temporarily disables
orbit controls. Vertical orbit and wheel zoom have limits. The transparent
canvas blends into both themes without changing the scene's brand-free colors.
The widget pauses when offscreen or the tab is hidden, caps device pixel ratio,
and removes decorative motion for reduced-motion preferences. WebGL-unavailable
browsers show a small fallback while the portfolio remains available.

On Home, desktop screens at least 1200px wide place the compact widget beside
the introduction. Smaller screens put it immediately below the introduction
with an explicit Play control. Work, About and Contact retain a single readable
column. The regular portfolio remains server-rendered.

A baseline of the original working design, including the uploaded originals,
was committed locally before changes: `8d22539`. Git is a portable installation
inside ignored `.preview/tools/`; no global installation was required.
