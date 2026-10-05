# MTE – Automatisme & Électronique Industrielle

![MTE](https://moutie.vercel.app/images/logo.png)

MTE is the website of **Fekhar Moutie**, an automation & electronics engineer based in Médéa (wilaya 26), Algeria. The business leads with **industrial programming** — PLC programming, variable-frequency-drive (VFD) and servo-drive commissioning, HMI/SCADA development and automation retrofits — with **component-level repair** (VFD, PCB, HMI, power supplies, sensors) as a strong secondary offering.

**Live website:** [https://moutie.vercel.app/](https://moutie.vercel.app/)

## 🚀 Features

* **Programming-first positioning** – PLC / drive / servo programming & commissioning foregrounded, repair as secondary.
* **Genuine bilingual FR / EN** – real localized routes `/fr` and `/en` with a runtime language switcher (lightweight custom i18n, no heavy dependency). French is the default for the Algeria market.
* **Strong SEO** – per-language `<title>`, meta, canonical and reciprocal `hreflang`; localized JSON-LD (`ProfessionalService`, `FAQPage`, `WebSite`, `BreadcrumbList`); XML sitemap with image/video + hreflang alternates; `<noscript>` fallback.
* **Build-time prerendering** – `/fr` and `/en` are rendered to static HTML at build time so crawlers get fully translated pages (see `scripts/prerender.mjs` + `src/entry-server.tsx`).
* **Dynamic portfolio** – Supabase-powered project showcase (images, video, descriptions).
* **Modern responsive UI** – Tailwind CSS v4, `lucide-react` icons. (The legacy jQuery/Bootstrap stack was removed.)

## 🛠️ Tech Stack

* **Framework:** React 19 + Vite 7 + TypeScript
* **Styling:** Tailwind CSS v4
* **Routing:** React Router v7
* **Head management:** `@dr.pogodin/react-helmet` (React 19-compatible, SSR for prerender)
* **Backend:** Supabase (PostgreSQL) — portfolio only
* **Deployment:** Vercel

## 📦 Local Development

1. **Clone:**
   ```bash
   git clone https://github.com/MOGEEK02/mte.git
   cd mte
   ```

2. **Install dependencies** (npm):
   ```bash
   npm install
   ```

3. **Environment variables** — create a `.env` file for the dynamic portfolio:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   (The home pages render fully without Supabase; only the portfolio needs it.)

4. **Dev server:**
   ```bash
   npm run dev
   ```
   Available at `http://localhost:5173` ( `/` redirects to `/fr` ).

5. **Production build** (client + prerender of `/fr` and `/en`):
   ```bash
   npm run build
   ```
   Use `npm run build:client` to skip prerendering.

## 🌍 Internationalization

UI strings live in `src/i18n/fr.ts` and `src/i18n/en.ts` (the French dictionary defines the `Dictionary` type the English one must mirror). The active locale comes from the URL (`/fr`, `/en`) and falls back to the stored choice on language-neutral routes (`/portfolio`).

## 📄 License

GPL-3.0. See [package.json](package.json).

---
*Developed by [Fekhar Moutie](https://github.com/MOGEEK02)*
