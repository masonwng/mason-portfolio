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

No original personal photographs or resume PDF are currently included.
See `public/memories/README.md` for the expected photos. Only files that
actually exist are displayed; no placeholder tiles appear.

Photo discovery preserves real filenames and extensions. `sharp` reads each
photo's orientation and natural dimensions; `next/image` renders responsive
thumbnails. The native enlargement dialog supports keyboard interaction,
Escape, backdrop clicks, scroll locking, and focus restoration.

A resume download appears on Contact only when the configured PDF exists in
`public/` (default: `public/resume.pdf`). Add the real originals/PDF, then restart
development or rebuild production to refresh file discovery.
