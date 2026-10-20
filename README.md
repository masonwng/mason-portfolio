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

The pig game only loads after opening “play with the pigs” and pauses offscreen. Dark mode, reduced motion, keyboard navigation, and photo enlargement are supported.

Deploy to the existing Vercel project, `masonwang`. Production uses [masonwang.dev](https://masonwang.dev).

## Projects

- [Itemle](https://masonwang.dev/projects/itemle/index.html): League item recipe guessing game. Source: https://github.com/masonwng/league-itemle
- [Lane notes](https://masonwang.dev/projects/lane-notes/index.html): local laning journal. Source: https://github.com/masonwng/lane-notes

Both projects are dependency-free static apps with their own test suites and repositories. This portfolio serves deployment snapshots from `public/projects/`. To refresh them from sibling checkouts named `league-itemle` and `lane-notes`, run `node scripts/sync-projects.mjs` before building. Changes in a project repository do not automatically update the portfolio’s snapshot.
