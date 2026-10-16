# Article audit checklist

Run this before moving a draft to `human-review`, and on existing posts periodically.

## Truth & trust (blocking)
- [ ] Every capability/claim is in `features.yaml` — **no fabricated feature, number, client or testimonial**.
- [ ] Brands/models are correct (Siemens S7 / TIA Portal, Schneider Altivar, Omron, Fatek, Delta…).
- [ ] No promise MTE can't keep (prices, delays stated as "it depends" + 24–48h diagnosis).

## Keyword & intent
- [ ] One clear **primary keyword** (in H1, intro, and naturally in the body).
- [ ] Search intent matches (informational article vs a commercial service/local page).
- [ ] **No cannibalisation** — doesn't compete with an existing page (`content-map.yaml`); if it overlaps a local page, differentiate or merge.

## Structure & E-E-A-T
- [ ] Short answer near the top; scannable H2/H3; phone-friendly.
- [ ] Written as a working engineer (concrete steps, real context: Médéa / Algérie).
- [ ] FAQ present (2–4 real questions) → FAQ/Article schema.

## Links & conversion
- [ ] Links **up to the pillar/service page**.
- [ ] Links to **one `/outils` calculator** and, when relevant, **one related article** (topic cluster).
- [ ] Ends with a **WhatsApp + devis gratuit** CTA, phone shown.

## Languages
- [ ] FR validated first; AR and EN translations faithful (brand/model names kept in Latin script).

## SEO technical (handled by the site, verify once live)
- [ ] Title ≤ ~60 chars, description ≤ ~155, canonical + hreflang present, Article + Breadcrumb schema.
- [ ] Added to the sitemap (`api/sitemap.js` → `BLOG_SLUGS`) and reachable at `/blog/<slug>`.

Only when every blocking item passes → `status: human-review` → owner approves → publish.
