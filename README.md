# Mason Wang

My personal portfolio website built with Next.js, React, and TypeScript.

Website: [masonwang.dev](https://masonwang.dev)

## Tech

Next.js 16, React 19, TypeScript, Tailwind CSS 4, Three.js, React Three Fiber, Drei, and Rapier. Images use Next.js and Sharp. Fonts are self-hosted.

## Running locally

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

```sh
npm run lint
npm run build
npm start
```

## Notes

Content lives in `app/lib/portfolio.ts`. Photos live in `public/`; missing media is left out automatically. The Resume page previews `public/resume-preview-1.png` and downloads `public/resume.pdf`. Update both when replacing the résumé.

The pig game lives in a square window next to the intro, loads separately, pauses offscreen, and expands into a modal. Dark mode, reduced motion, keyboard navigation, and photo enlargement are supported.

Deploy to the existing Vercel project, `masonwang`. Production uses [masonwang.dev](https://masonwang.dev).

## Projects

- [Itemle](https://masonwang.dev/projects/itemle/index.html): League item recipe guessing game with unlimited guesses and puzzle rank badges. Source: https://github.com/masonwng/league-itemle
- [Lane notes](https://masonwang.dev/projects/lane-notes/index.html): local laning journal with champion portraits and hand-authored matchup build suggestions. Source: https://github.com/masonwng/lane-notes

Both projects are dependency-free static apps with their own test suites and repositories. This portfolio serves deployment snapshots from `public/projects/`. To refresh them from sibling checkouts named `league-itemle` and `lane-notes`, run `node scripts/sync-projects.mjs` before building. Changes in a project repository do not automatically update the portfolio’s snapshot.

## Documentation

- [Architecture and content maintenance](docs/MAINTENANCE.md)
- [Social previews, deployment, and verification](docs/SHARING-AND-DEPLOYMENT.md)
- [Avatar generation and refinement prompts](docs/favicon-generation.md)
- [Release history](CHANGELOG.md)
- [Itemle documentation](https://github.com/masonwng/league-itemle#readme)
- [Lane notes documentation](https://github.com/masonwng/lane-notes#readme)

## Sharing thumbnail

![Mason Wang social preview](public/social-preview.png)

Regenerate this 1200 × 630 image with `npm run generate:social-preview`. Its shared Open Graph / Twitter configuration lives in `app/lib/social-preview.ts`; update the image URL's version after changing the artwork. Existing third-party shares may retain their cached preview until refreshed by that service.
