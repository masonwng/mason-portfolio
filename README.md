# Mason Wang

My personal website, built with Next.js, React, and TypeScript.

It's where I share a bit about myself, what I've worked on, and what I'm learning. There's also a little interactive pig game on the homepage.

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

Content lives in `app/lib/portfolio.ts`. Photos live in `public/`; missing media is left out automatically. The Resume page uses native HTML, with an optional download if a resume-only `public/resume.pdf` is added. Don't put a combined resume and cover letter there.

The pig game loads separately from the rest of the site and pauses offscreen. Dark mode, reduced motion, keyboard navigation, and photo enlargement are supported.

Deploy to the existing Vercel project, `masonwang`. Production uses [masonwang.dev](https://masonwang.dev).
