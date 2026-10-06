# MTE – Réparation Électronique Industrielle

![MTE Banner](https://moutie.vercel.app/images/logo.png)

MTE is a professional industrial electronics repair service based in Médéa, Algeria. This repository contains the source code for the official MTE website and portfolio.

**Live Website:** [https://moutie.vercel.app/](https://moutie.vercel.app/)

## 🚀 Features

* **Modern SPA Architecture:** Built with React and Vite for blazing fast performance.
* **Dynamic Portfolio:** Supabase-powered backend for showcasing industrial repair projects (images, descriptions, categories).
* **Responsive Design:** Fully responsive UI crafted with Tailwind CSS v4, providing an excellent experience on mobile and desktop.
* **SEO Optimized:** Structured metadata (JSON-LD), highly optimized performance, semantic HTML, and proper XML sitemap configuration.
* **Bilingual Support:** Ready for French (fr-DZ) and Arabic to serve the local Algerian market.

## 🛠️ Tech Stack

* **Frontend Framework:** React 19
* **Build Tool:** Vite
* **Styling:** Tailwind CSS v4 (brand colours and fonts in `src/index.css`)
* **Language:** TypeScript
* **Routing:** React Router v7
* **Database/Backend:** Supabase (PostgreSQL)
* **Deployment:** Vercel

## 📦 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MOGEEK02/mte.git
   cd mte
   ```

2. **Install dependencies:**
   Make sure to use `yarn` as the package manager for this project.
   ```bash
   yarn install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key
   ```

4. **Start the development server:**
   ```bash
   yarn dev
   ```
   The application will be available at `http://localhost:5173`.

5. **Build for production:**
   ```bash
   yarn build
   ```

## 🌍 Languages and search engines

- French at `/`, English under `/en`, Arabic (right-to-left) under `/ar` (texts in `src/i18n.ts`; services, projects and opening hours have English and Arabic fields in /admin). Project pages live at `/portfolio/<slug>`; old numeric links redirect there.
- `npm run build` pre-renders every public page in both languages (`src/entry-server.tsx`, `scripts/prerender.mjs`): full HTML content, title, description, canonical, hreflang, and schema.org data (LocalBusiness, FAQPage, Article, BreadcrumbList). Search engines and AI assistants read it without JavaScript.
- `/sitemap.xml` (both languages, hreflang, images), `/robots.txt` (AI crawlers allowed), `/llms.txt` and `/llms-full.txt` (summary for AI assistants).
- Pre-rendered pages are refreshed at each deployment: /admin → "Mettre à jour le site public", and every night (Vercel cron). Needs `DEPLOY_HOOK_URL` (Vercel → Settings → Git → Deploy Hooks) and `CRON_SECRET`.

## 🔐 Administration (/admin)

The site has a private admin panel at `/admin` to manage quote requests, portfolio projects and service pages.

1. In Supabase (website project) → **Authentication → Users → Add user**: your e-mail and a strong password, "Auto confirm user" ticked.
2. **SQL Editor**: run [`supabase/admin.sql`](supabase/admin.sql) (safe to run again). It creates the tables, the access rules and the `portfolio` photo bucket, and makes that account the admin.
3. **Authentication → URL Configuration**: Site URL `https://moutie.vercel.app`, and add `https://moutie.vercel.app/admin` to the redirect URLs (password reset).
4. Vercel → project → **Settings → Environment Variables**:
   - `SUPABASE_SECRET_KEY`: the project's secret key (saves quote requests)
   - `RESEND_API_KEY`: e-mail notification of new requests (optional; requests are saved either way)

## 📄 License

This project is licensed under the GPL-3.0 License. See the [package.json](package.json) for details.

---
*Developed by [Fekhar Moutie](https://github.com/MOGEEK02)*
