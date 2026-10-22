# Games: implementation and verification

## Itemdle and Builddle

The source is the sibling `league-itemle` repository; `public/projects/itemle/` is its deployment snapshot. `scripts/sync-projects.mjs` copies an explicit list of runtime files and assets. The original daily item data, revision, saved-guess key, and daily selection function are unchanged.

Recipe mode adds shake/pop/glow/particle feedback, an animated correct message, time taken, optional synthesized sound, keyboard-search suggestions, and daily streaks. `ui.js` and `search.js` are reused by Builddle. Buttons, guesses, and clues have reduced-motion-aware CSS transitions.

Builddle has champion hints and complete-the-build modes with difficulty, attempt limits, score penalties, local bests, round restoration, results, and sharing. Its four-champion question bank was manually reviewed against public U.GG pages on 2026-10-21 for patch 26.21. Metadata and patch-specific icons come from Riot Data Dragon 16.21.1. The original Itemdle data remains at 16.20.1 to preserve daily progress.

No documented authorized U.GG API was verified. This is an authored factual question bank with source citations, not a live U.GG connection or licensed bulk dataset. It copies no win-rate statistics. A licensed automated feed is a remaining integration limitation. Source details are in [the Itemdle repository](https://github.com/masonwng/league-itemle/blob/main/BUILD-DATA.md).

`build-provider.js` validates the snapshot before use, caches successful loads locally, allows a seven-day cached fallback, and exposes clear retry/failure states. The optional latest-patch check has a timeout. Older snapshots are explicitly labeled historical. Providers can be replaced without changing question generation. There are no credentials in client code.

## Math Ascension

The source and deployed runtime are in `public/projects/math-ascension/`:

- `questions.mjs`: seeded generation, 14 stages, multiple templates per stage, hints, and worked solutions. University templates cover chain/product/quotient rules, implicit differentiation, optimization, definite/indefinite integrals, accumulation, matrices, vectors, and limits.
- `answers.mjs`: a restricted expression parser with exact BigInt rational polynomial arithmetic. It compares coefficients, not sampled points or raw strings. Numeric answers accept equivalent fractions and decimals with a small tolerance. Antiderivatives require `+ C` and ignore additive constants. Unsupported functions and variable denominators are rejected; complex question types use explicit choices or numerical answers.
- `core.mjs`: Standard and One-Life state transitions, solution-reveal guard, question replacement, persisted-state validation, accuracy, and per-mode records.
- `app.mjs`: DOM rendering, KaTeX, the progression map, timer, sounds, animations, sharing, and browser storage.
- `style.css`: matching light/dark palettes, responsive layouts, and reduced-motion treatment.

Standard retries wrong answers. Revealing a solution disables answering that question until a new one at the same stage is generated. One-Life ends on the first valid but incorrect answer; malformed input is not charged as an attempt. Hints are recorded. Each correct answer advances exactly one stage. The final stage is University Year 1; there are no later university levels.

Progress, elapsed active time, settings, completed question IDs, and per-mode bests use versioned `math-ascension:v1` localStorage keys. The active timer pauses while the page is hidden. A seed and question revision reproduce the saved question; new runs avoid the previous question at each completed stage. Corrupt run data is rejected. There is no account, global leaderboard, or cross-device sync.

KaTeX is self-hosted so math rendering needs no third-party network request. Run `npm run vendor:katex` after upgrading the pinned package; it copies the distribution and license. Vendor files are excluded from linting.

## Verification commands

```sh
npm test
npm run lint
npm run build
npm --prefix ../league-itemle test
```

The math tests generate 4,200 questions, exercise every template, parse their TeX, check exact equivalence and invalid input, independently verify university answers with known parameters, complete both modes, fail One-Life, check solution replacement, validate restoration, and check best-time rules. Builddle tests cover both modes across every difficulty, verified item relationships and assets, penalties, attempt caps, malformed saved states, and fresh/cached/expired/missing data.

Manual browser checks include Itemdle miss/win and keyboard search; Math progression, solution replacement, One-Life failure, and reload; Builddle hints, win scoring, source links, and mode changes. Responsive previews use 390, 768, and 1440px iframe viewports. Temporary verification pages and screenshots are removed from the deployment tree after checks.

## Retired project

Lane notes is removed from the portfolio cards and sitemap and is no longer copied by the sync script. Its legacy static URL remains available for old links and existing local journal data; the separate `lane-notes` repository and user records are not deleted.
