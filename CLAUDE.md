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

### Workflow
1. Pick the top item in `.seo-engine/content-queue.yaml`.
2. Draft it following `.seo-engine/templates/` (blog-structure, frontmatter, tone).
3. Save as a draft (`status: human-review`); do not publish.
4. The `/blog` section does not exist yet — it must be built before drafts go live.
