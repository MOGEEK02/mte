# SEO content engine — MTE

Set up from the "SEO Engine Setup" prompt (gist by twf-nikhila), focused on the owner's priorities:
**1) PLC programming → 2) HMI/SCADA programming → 3) industrial electronics repair.**

## Status
`/blog` is **live** (FR/EN/AR). Published articles: **3** — `programme-automate-perdu` (PLC),
`ihm-ou-scada` (HMI), `retrofit-machine-industrielle`. Full backlog in `content-queue.yaml`.
The blog is editable from **/admin → Blog**. Engine rules and workflows live in the repo's `CLAUDE.md`.

## Files
- `config.yaml` — project, languages, focus order, brand terms, **goals/metrics**, engine rules, pending owner inputs.
- `features.yaml` — **real** MTE capabilities (the only things articles may reference).
- `topic-clusters.yaml` — pillar → cluster content plan.
- `content-queue.yaml` — published list + full prioritised backlog.
- `seo-keywords.csv` — candidate keywords (volume/difficulty **unverified** — fill from real Google data).
- `competitors.yaml` — **unverified** until you provide real competitors.
- `content-map.yaml` — existing pages (avoid cannibalisation).
- `templates/` — blog-structure, comparison, audit, frontmatter, tone.
- `drafts/` — Markdown drafts (source of the first article).

## Rules (short)
- Only use features from `features.yaml`. **No fabrication.**
- **No auto-publish** — drafts are `human-review`.
- **No built-in web search** for keywords/SERP — paste real Google results into `seo-keywords.csv`.
- Every article: links to its pillar + one `/outils` tool + a WhatsApp CTA. FR → AR → EN.

## What I need from you to go further
1. **2–3 real competitors** (Algerian automation / electronics-repair firms, or pages ranking for the
   keywords) → fills `competitors.yaml`.
2. **Real Google data** for a few target keywords (top results + "People also ask") → fills
   `seo-keywords.csv`. (Per the engine rules, I don't scrape SERPs.)
3. Go-ahead to **build the `/blog` section** (same multilingual, pre-rendered pattern as the rest of the
   site) so drafts can be published.

## Next step
Build `/blog`, then draft `perte-programme-automate` (top of the queue) — a PLC-programming article.
