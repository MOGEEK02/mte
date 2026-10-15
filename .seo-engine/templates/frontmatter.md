# Frontmatter template for a blog draft

When the /blog section exists, each draft starts with this. Until then, drafts live as Markdown
in `.seo-engine/drafts/` with status `human-review`.

```yaml
---
slug: perte-programme-automate
lang: fr                      # fr | en | ar
pillar: plc-programming
title: "Programme d'automate perdu : comment le récupérer ou le réécrire"
description: "Max 155 characters, with the primary keyword, written for a human."
primary_keyword: "récupérer programme automate"
secondary_keywords: ["programme PLC perdu", "sauvegarde automate Siemens"]
status: human-review         # idea | drafting | human-review | published  (NEVER auto-publish)
author: "MTE Industrial Electronics"
date: 2026-10-16
internal_links:
  pillar: "/"                 # the service/pillar page
  tools: "/outils"
  related: []
cta: "WhatsApp + devis gratuit"
---
```
