// Build step (after `vite build` and the server build): writes a complete HTML file for every
// public page, in French and English, with the content, title, description, canonical URL,
// hreflang alternates and schema.org data already inside. Search engines and AI assistants
// read it without running JavaScript; the browser then takes over (src/main.tsx).
//
// Also writes dist/shell.html (empty app, used by api/page.js for pages added since the
// deployment), dist/404.html, dist/llms.txt and dist/llms-full.txt.

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");

// Supabase settings: Vercel provides them as environment variables; locally, read .env.local.
for (const file of [".env.local", ".env"]) {
  const p = path.join(root, file);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const server = await import(pathToFileURL(path.join(root, "dist-server", "entry-server.js")).href);
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
fs.writeFileSync(path.join(dist, "shell.html"), template);

const HEAD_BLOCK = /<title data-seo>[\s\S]*?(?=\s*<!-- \/default page tags -->)/;
const HERO_PRELOAD = /\s*<link rel="preload" as="image" href="\/images\/web\/hero\.webp"[^>]*>/;

const json = (value) => JSON.stringify(value).replace(/</g, "\\u003c");

function page(p, data, { keepData = true } = {}) {
  const markup = server.render(p.url, data);
  const structured = p.jsonLd.map((d) => `<script type="application/ld+json">${json(d)}</script>`).join("\n  ");
  let html = template
    .replace(/<html lang="[^"]*">/, `<html lang="${server.DICT[p.lang].locale}">`)
    .replace(HEAD_BLOCK, () => server.headHtml(p.meta))
    .replace("<!--structured-data-->", () => structured)
    .replace('<div id="root"></div>', () =>
      keepData ? `<div id="root">${markup}</div>\n  <script>window.__MTE_DATA__=${json(data)}</script>` : `<div id="root">${markup}</div>`,
    );
  if (p.meta.path !== "/") html = html.replace(HERO_PRELOAD, "");
  return html;
}

function write(url, html) {
  const file = url === "/" ? path.join(dist, "index.html") : path.join(dist, url.slice(1), "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  return path.relative(dist, file);
}

const data = await server.loadData();
console.log(`prerender: ${data.services.length} services, ${data.portfolio.length} projects`);

let count = 0;
for (const p of server.pages(data)) {
  write(p.url, page(p, data));
  count++;
}

// 404: French "page not found", served by Vercel for unknown addresses.
const nf = server.notFoundPage();
fs.writeFileSync(path.join(dist, "404.html"), page(nf, data));

fs.writeFileSync(path.join(dist, "llms.txt"), server.llmsTxt(data));
fs.writeFileSync(path.join(dist, "llms-full.txt"), server.llmsTxt(data, true));

console.log(`prerender: ${count} pages, 404.html, shell.html, llms.txt, llms-full.txt`);
