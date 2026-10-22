# Maintaining the portfolio

## Structure

The Next.js App Router serves the homepage and `/about`, `/work`, `/resume`, and `/contact`. Static standalone projects are served under `/projects/itemle/index.html` and `/projects/math-ascension/index.html`. The standalone pages do not inherit the Next.js layout or its metadata.

`app/layout.tsx` owns the self-hosted Geist font, theme provider, navigation, footer, shared metadata, and stylesheet imports. Pages are server-rendered where possible. Client code is reserved for the pig simulation, theme control, galleries, and other interactions. Do not migrate framework versions or replace the package manager just to edit content; follow `AGENTS.md` and the installed Next.js docs.

## Where to edit

| Change | Source |
| --- | --- |
| Personal facts, experience, awards, project destinations | `app/lib/portfolio.ts` |
| Homepage order and section copy | `app/page.tsx` |
| Project preview composition | `app/components/project-previews.tsx` |
| Shared layout and responsive styling | `app/globals.css` |
| Header links | `app/components/site-navbar.tsx` |
| Portrait and event photos | `public/media/`, `public/memories/`, and the verified media helpers |
| Résumé download | `public/resume.pdf` |
| Résumé preview image | `public/resume-preview-1.png` |
| Favicon set | `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png` |
| Full cartoon avatar | `public/avatar-mason.png` |
| Social sharing image | `public/social-preview.png`; regenerate with `npm run generate:social-preview` |
| Open Graph / Twitter image URL and alt text | `app/lib/social-preview.ts` |
| Canonicals and sitemap | Route metadata and `app/sitemap.ts` |

Keep the résumé PDF and its preview synchronized. The public résumé page links to the PDF rather than retyping its contents. Never replace a real photo with an invented portrait or publish source reference photographs used for avatar generation.

## Piggy window

`piggy-break.tsx` wraps the existing Three.js/Rapier simulation in an inline square window beside the intro. Its button moves the same dialog into modal mode; minimizing or pressing Escape returns it to the page. The game component is not duplicated, so expanding preserves simulation state. Modal mode locks body scrolling and uses the browser's native focus containment. The simulation pauses offscreen or when the document is hidden, respects reduced motion, and provides a WebGL fallback.

## Theme and accessibility

Light is the default theme; visitors can select dark and the choice persists. Keep both palettes readable. Preserve real headings, labels, links, visible focus rings, reduced-motion behavior, and the skip link. At narrow widths the intro and game stack, project previews become one column, and experience dates wrap. Verify at 360, 390, 768, and desktop widths after structural edits.

## Standalone project snapshots

Itemdle source lives in `masonwng/league-itemle`, checked out as a sibling named `league-itemle`. Math Ascension is maintained directly in `public/projects/math-ascension/`; see [game documentation](GAMES.md). Run:

```sh
node scripts/sync-projects.mjs
```

The script copies an explicit allowlist of static runtime files into `public/projects/`. It does not copy `.git`, environment files, local storage, test data, or project documentation. Publish source changes to their own repository and commit the refreshed snapshot in this repository. A push to a standalone repository does not refresh the live portfolio snapshot by itself.

## Checks

```sh
npm run lint
npm run build
npm --prefix ../league-itemle test
npm test
```

Run the relevant subset for the change. Browser-check changed interactions and inspect the production output rather than relying on a successful build alone. Keep credentials, `.env*`, `.vercel`, temporary screenshots, and pasted prompts out of commits and deployment uploads.
