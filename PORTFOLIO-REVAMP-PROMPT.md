# masonwang.dev revamp prompt

Historical design brief from the initial portfolio revamp. Current game implementation and limitations are documented in `docs/GAMES.md`.

Revamp my existing portfolio website in this portfolio repository for masonwang.dev. Implement the redesign in this project, preserving useful existing content and real links. Finish the working site, check it in a browser, and refine the result. I want a complete, carefully designed portfolio rather than a proposal or a generic template.

## Direction

Use https://jackluk.framer.website/ as a reference for a personal introduction, easy-to-find social links, projects with visual previews, and a clear sequence of sections. Inspect the reference before designing. Borrow its sense of personality and straightforward navigation, then make a distinct website for me. Do not copy Jack's writing, achievements, project details, artwork, or identity.

My direction is more understated: casual, nonchalant, and written like I am texting someone. The website should look intentional and polished. The casualness should come from the language and comfortable pacing, while the typography, spacing, interactions, and responsive layouts show care.

Interpret “texting” primarily as a writing voice. Use a few subtle message-like details, such as a rounded intro snippet or compact conversational labels. Avoid turning the whole site into a fake messaging app. Visitors should be able to scan my background and projects immediately without clicking through a simulated conversation.

Make confident design decisions within this brief and carry them through consistently.

## Voice and copy

Write short, specific sentences in the first person. Use contractions and everyday words. A little lowercase is fine in informal labels, but keep names, organizations, acronyms, and proper nouns correctly written. The copy should read naturally, with enough substance to explain what I do.

Example tone:

- “hey, i'm Mason.”
- “First-year business + computer science student at UBC.”
- “I teach coding and robotics at RoboEDU.”
- “A few things I want to build.”
- “Usually hiking, cooking, working out, or playing something with friends.”
- “say hi.”

Use these as tonal anchors, adapting line breaks and wording to fit the design. Don't repeat the same introductory thought in several sections.

Remove the current “I love vibe coding.” headline. Avoid flowery subtitles, marketing language, motivational slogans, exaggerated humor, forced slang, or invented personal quirks. Do not use copy such as:

- “Crafting digital experiences.”
- “Where creativity meets technology.”
- “Building at the intersection of business and innovation.”
- “Turning caffeine into code.”
- “Passionate problem solver.”
- “Let's build something extraordinary.”
- “Beyond the screen.”
- “A little bit of everything, a whole lot of curiosity.”

Every subtitle should communicate a fact or help someone understand the section. If it only fills space, remove it. Do not use “vibe coded” anywhere in the public-facing copy.

## Visual system

Create an airy, mostly light website with warm off-white backgrounds, near-black text, muted secondary text, and one restrained accent color. A soft blue works well for links, focus states, and an occasional message-like detail. Keep accent colors sparse. Give the existing dark theme the same level of care if it remains available.

Use a clean sans serif such as the existing Geist font. Body text should be comfortable to read, around 16–18px with generous line height. Aim for a compact hero heading around 48–64px on desktop and 36–44px on mobile, adjusting for natural line breaks. Use weight, size, and spacing to create hierarchy. Avoid an oversized name filling the screen, decorative display fonts, and constant uppercase labels.

Use a centered content width of roughly 960–1080px, with a reading width around 600–680px for prose. Keep 20–24px mobile gutters and a consistent spacing scale. Give sections room to breathe without making visitors scroll through large empty areas. On a typical laptop, the opening screen should show my intro, links, and at least the beginning of the next meaningful section.

Prefer an editorial mix of plain text, understated rows, and two project previews. Do not place every paragraph in a separate rounded card. Use thin dividers, quiet surfaces, and restrained borders where they establish grouping. Project previews can have rounded corners around 16–20px. Buttons should be compact and readable. Avoid heavy shadows, gradients everywhere, glass panels, neon accents, skill meters, logo marquees, decorative code terminals, and generic dashboard widgets.

One small personal detail is enough. The existing pig illustration may stay as a small, lightweight accent if it fits the composition. It should never compete with the introduction, obstruct content, or require loading a heavy 3D scene on the critical path. Simplify or remove it if the redesign works better without it.

## Content and information architecture

Make the homepage the main portfolio, with this flow: introduction → projects → selected experience → a small personal section → contact. Use a restrained header with my name or `mw.`, a few section links, and a resume link. Prefer plain labels such as “projects,” “about,” and “contact.” Keep navigation clear on mobile without creating an oversized menu.

Preserve the existing `/work`, `/about`, `/resume`, and `/contact` routes as useful destinations or intentional redirects. If they remain pages, update them to match the new design. Keep the resume PDF accessible. Do not leave old layouts or conflicting navigation behind.

Use `app/lib/portfolio.ts` and the existing assets as the source of truth. Retain real dates and facts wherever displayed. Prioritize the following:

### Introduction

My name is Mason Wang. I am a first-year student in the combined Business and Computer Science program at the University of British Columbia. Introduce me in two or three short lines. Include immediate access to GitHub, LinkedIn, email, and my resume. Avoid a separate aspirational tagline.

### Selected experience

Show RoboEDU first, followed by Young Architects for Change. Include my IB Director role in a compact third entry or on the fuller work page. Keep visible summaries short, and use existing verified details for expanded descriptions:

- **RoboEDU — Coding Instructor, July 2024–present.** Teach programming and robotics to students aged 5–16. The existing content records more than 50 students and work with Java, Python, Unity, EV3, and Scratch. A natural homepage summary is: “I teach coding and robotics to kids at RoboEDU.”
- **Young Architects for Change — Project Coordinator, April 2025–present.** Help coordinate events, workshops, fundraising, and social posts. The existing record includes Design for Change 2025 at the Museum of Vancouver.
- **Sir Winston Churchill Secondary School — IB Director, February 2025–June 2026.** Helped organize orientation camp, information sessions, and student events. Keep the detailed record on the work page if it makes the homepage too long.

Preserve awards in the fuller work/resume view. If the homepage includes awards, show only two or three relevant entries and use their actual names and results. Do not make the site feel like an exhaustive resume pasted into cards.

### Outside school

Use one short paragraph about hiking, working out, kickboxing, cooking, gaming, and spending time with friends and family. Select a few interests rather than giving every hobby its own card. Use one or two existing photos if they improve the layout. Simple captions such as “made this” or “out for a hike” are enough. Use only available images, with accurate alt text and thoughtful cropping. Do not fabricate a portrait or substitute stock people.

### Contact

Keep this direct: “say hi.” followed by my email and a few social links. A contact form is unnecessary. Use the real destinations already in the project:

- GitHub: https://github.com/masonwng
- LinkedIn: https://www.linkedin.com/in/mason-wang-926026353/
- Email: masonwang322@gmail.com
- Instagram, if included: https://www.instagram.com/masonwng/
- Discord, if included: `masonwng`, with a functioning copy action and visible confirmation.

GitHub, LinkedIn, email, and resume deserve priority. Keep secondary social links in the contact section or footer.

## Two passion project placeholders

Add exactly two example projects. Treat them as concepts for now. A visible “concept” label and section wording such as “a couple project ideas” should make their status clear. Do not describe them as launched, in development, API-connected, or already used by anyone. Do not invent repository URLs, screenshots, traffic, performance results, dates, or technology stacks presented as completed work.

Both projects should link to https://github.com/masonwng with the explicit label “GitHub profile ↗”. Keep the destination easy to replace with a real repository later. Do not label that link “source code” or “view repo” while it points to the profile. Do not add a dead demo button.

### 1. Wordle, again

Suggested copy: “A Wordle-style game with daily words, practice rounds, and a simple streak tracker.”

The intended idea is a small word game with six guesses, keyboard feedback, local progress, and a shareable result. These are planned features, not claims about a finished implementation.

Create a crisp visual preview using HTML/CSS: a five-column guess board with green, muted yellow, and neutral tiles. Use a valid five-letter word or consistent sample board. The preview should look considered and legible at small sizes. Label it “sample preview.” It can be static; building a complete game is outside this portfolio redesign.

### 2. Lane notes

Suggested copy: “A League matchup tracker for the first 15 minutes. CS, trades, wave notes, and what to try next game.”

The idea is a personal League of Legends laning journal: champion versus opponent, role, CS at 10 and 15 minutes, gold difference, deaths before 15, and short notes about trades, wave management, or recall timing. Frame it as reviewing your own lane rather than a finished prediction engine or win-rate analytics service.

Create a small preview of one sample matchup entry with a role, a matchup label, two or three readable lane stats, and one short note. Mark all data as sample data. Use text and simple shapes; avoid relying on third-party champion art or suggesting a live Riot API integration. Keep the preview visually related to Wordle without making it look like a copied card.

Structure project data so concept status, description, preview, and GitHub destination can be updated centrally. Keep placeholder labels in visible UI, not just code comments. Do not create or publish GitHub repositories as part of this task.

## Interaction and accessibility

Use short, subtle hover and focus transitions, roughly 150–220ms. A small entrance fade is acceptable if it does not hide content or delay reading. Avoid typing animations, scroll hijacking, custom cursors, parallax, bouncing elements, and long staged reveals. Respect reduced-motion preferences.

Use semantic headings, real links and buttons, visible keyboard focus, sufficient contrast, and comfortable touch targets. Hover effects must also work for keyboard users. Keep essential information visible without interaction. Email and Discord copy controls need actual success/failure feedback; do not display success when copying fails.

On mobile, use a single column, full-width project previews, readable text, and wrapping navigation or a simple accessible menu. Keep dates and role names from colliding. Ensure the layout works at 360px without horizontal scrolling. Do not rely on sideways-scrolling project carousels.

## Implementation requirements

Work in the existing Next.js/React/TypeScript application. Read `AGENTS.md` and the relevant installed Next.js documentation under `node_modules/next/dist/docs/` before writing code; this project explicitly requires using those docs. Inspect the working tree first and preserve unrelated changes. Keep the existing package manager and avoid unnecessary dependencies or migrations.

Reuse suitable data, components, fonts, and image assets. Make shared components consistent across routes. Keep static content server-rendered where practical, and limit client JavaScript to interactions that need it. Prevent layout shifts with image dimensions and stable preview sizes. Remove unused heavy visual components from the rendered path where appropriate, without deleting unrelated work.

Keep metadata, canonical URLs, social previews, and the sitemap consistent with the final route structure and masonwang.dev. Update any obsolete pig-centric preview descriptions if the pig is removed. Do not deploy, change DNS, push commits, or modify external accounts unless separately instructed.

## Finish and verify

Run the project's lint and production build checks, and address issues introduced by the redesign. Inspect the running site at desktop and mobile widths, including approximately 1440px, 768px, and 390px. Check every retained route, navigation link, resume link, external destination, copy action, and theme control. Confirm no broken images, clipped text, horizontal overflow, hydration errors, or unreadable dark-mode text.

Review the copy once more and remove anything that sounds like a generic portfolio template. The final result should feel like a real student's personal website: relaxed, clear, visually cohesive, and easy to update. Present a concise summary of the changes, checks performed, and the two concept projects that still need real repositories.
