# Pragyan Dahal

An editorial personal site with essays and project notes in Markdown. Vite builds complete HTML for every route. The browser only needs a small script for navigation and scroll reveals; reading and links also work without JavaScript.

## Working locally

Use Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

## Adding an essay

Create `src/content/your-slug.md`. The filename becomes `/essays/your-slug`.

```yaml
---
title: Your title
description: A short description.
date: 2026-10-05
status: draft
tags: [systems, building]
---
```

Write the body in Markdown after the frontmatter. Indexes, reading time, page metadata, section links, RSS, and the sitemap follow the files automatically. Add `featured: 1`, `featured: 2`, or `featured: 3` to choose and order up to three essays on the homepage. Other essays still appear in the writing index.

Standard Markdown includes headings, lists, links, images, blockquotes, tables, and fenced code. Footnotes use `[^name]` in the text and `[^name]: Your note.` below. Raw HTML is disabled. Footnotes can explain a point without pretending to be an external source. If a factual claim needs verification, leave a clearly labelled citation TODO in the draft rather than inventing a reference.

## Adding a project

Create `src/content/projects/your-slug.md` with `title`, `description`, `status`, and `tags`. Optional `takeaway` supplies the short lesson on the index; optional `order` controls position. Existing projects use positions 0 and 1; use 2 or higher for additions.

Project notes should cover what you tried, why, what you built, what happened, what went wrong, what you learned, and what you would change. Describe unfinished or unsuccessful work plainly.

## Updating other pages

- `src/site.js`: home, about, interests, and now content, plus route rendering.
- `src/components.js`: reusable essay/project rows, questions, headings, prose, figures, and callouts.
- `src/drawings.js`: conceptual SVG models for the project notes and physical systems essays.
- `src/site.config.js`: the approved public email and site origin.
- `src/style.css`: layout, typography, responsive rules, and motion.
- `src/main.js`: progressive enhancements for the menu and scroll reveals.

The only public contact is `pragyandahal02@gmail.com`.

## Checking and building

```sh
npm run lint
npm run build
npm run check
npm run preview
```

The check verifies generated pages, metadata, internal links, assets, footnotes, RSS, sitemap, and the no-em-dash copy rule. Desktop and mobile visual checks still matter when changing layout or content.

## Deploying

This is a static site. Publish the contents of `dist/` using a host that serves directory `index.html` files and `404.html` for missing routes. No client-side route fallback is needed.

Set `SITE_URL` to the real public origin at build time. It must be an HTTP(S) origin without a path. No production domain has been assumed. Without this variable, metadata, RSS, and sitemap intentionally use `http://localhost:5173` for preview.

```sh
SITE_URL=https://your-domain.example npm run build
npm run check
```

That domain is a documentation placeholder. Replace it before a production build. The sharing image is `public/og-image.png`; its editable SVG source sits beside it.

Fonts are bundled locally. Their OFL licenses are included in `public/fonts/`.
