# CLAUDE.md

Guidance for AI assistants working in this repo. (The site's own build/architecture is documented in `README.md`.)

## SEO content engine (`.seo-engine/`)

This project has an SEO content engine for planning and writing blog articles. **Before writing or
improving any blog/SEO content, read `.seo-engine/` first** — especially `config.yaml`,
`features.yaml`, `topic-clusters.yaml` and `content-queue.yaml`.

Focus order (set by the owner): **1) PLC programming · 2) HMI/SCADA programming · 3) industrial
electronics repair.**

Hard rules:
- **Never fabricate features, numbers, client names or testimonials.** Only reference capabilities
  listed in `.seo-engine/features.yaml`.
- **Never auto-publish.** Drafts are written with `status: human-review` for the owner to approve.
- **Never use built-in web search for keyword/SERP research.** Ask the owner to paste real Google
  results and "People also ask" questions, and record them in `.seo-engine/seo-keywords.csv`.
- **Competitor data is unverified** until the owner provides it — never guess.
- Every article links up to its pillar/service page, to one relevant `/outils` calculator, and ends
  with a WhatsApp + "devis gratuit" CTA. Write FR first, then AR, then EN.
- Avoid cannibalisation with the local pages (`/{service}-{city}`) — see `.seo-engine/content-map.yaml`.

### Blog-writing workflow
1. **Pick** the top `status: idea` item in `.seo-engine/content-queue.yaml` (respect the focus order: PLC → HMI → repair).
2. **Draft** in FR following `.seo-engine/templates/` — `blog-structure.md` (or `comparison.md` for "X vs Y"), `tone.md`, `frontmatter.md`. Only use capabilities from `features.yaml`.
3. **Translate** to AR, then EN (keep brand/model names in Latin script).
4. **Audit** against `.seo-engine/templates/audit.md`. Fix every blocking item.
5. **Human-review** — the article is for the owner to approve. Never auto-publish.
6. **Ship it** (how the blog works here, after approval):
   - Add a `Post` to `DEFAULT_POSTS` in `src/blog.ts` (slug, date, `title`/`description`/`body` in fr/en/ar; body in the Markdown subset of `src/ui/markdown.ts`).
   - Add the slug to `BLOG_SLUGS` in `api/sitemap.js`.
   - `npm run build` to verify it pre-renders; the owner can then show/hide/edit/reorder it from **/admin → Blog** (overrides live in `site_content` → `blog`).
7. **Update** the item's `status` to `published` with `live_url` in `content-queue.yaml`.

### Audit workflow (existing posts)
Periodically run `.seo-engine/templates/audit.md` over published posts: check for fabricated claims, cannibalisation, broken internal links, and whether the primary keyword still matches intent. Record real Google data (positions, "People also ask") in `seo-keywords.csv` when the owner provides it.

### Current status
`/blog` is **live** (FR/EN/AR). Published: `programme-automate-perdu` (PLC), `ihm-ou-scada` (HMI), `retrofit-machine-industrielle`. See `content-queue.yaml` for the backlog.
