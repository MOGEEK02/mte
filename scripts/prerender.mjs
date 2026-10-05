// Build-time prerender: renders /fr and /en to static HTML so crawlers get
// fully-translated pages with correct <head> (title, hreflang, JSON-LD).
// Runs after `vite build` (client) and `vite build --ssr` (server bundle).

import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const distDir = resolve(root, "dist");
const ssrEntry = resolve(root, "dist-ssr", "entry-server.js");

const LOCALES = ["fr", "en"];

const { render } = await import(pathToFileURL(ssrEntry).href);

const template = readFileSync(resolve(distDir, "index.html"), "utf-8");

for (const locale of LOCALES) {
  const { html, helmet } = render(`/${locale}`);

  let page = template;

  // Strip the template's default <title> and description so Helmet's win.
  page = page.replace(/\s*<title>[\s\S]*?<\/title>/, "");
  page = page.replace(/\s*<meta name="description"[^>]*>/, "");

  // <html lang="..">
  if (helmet?.htmlAttributes) {
    page = page.replace(/<html[^>]*>/, `<html ${helmet.htmlAttributes.toString()}>`);
  }

  // Inject collected head tags before </head>.
  const head = [
    helmet?.title?.toString() ?? "",
    helmet?.meta?.toString() ?? "",
    helmet?.link?.toString() ?? "",
    helmet?.script?.toString() ?? "",
  ].join("\n");
  page = page.replace("</head>", `${head}\n</head>`);

  // Inject rendered app markup for hydration.
  page = page.replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  const outDir = resolve(distDir, locale);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "index.html"), page, "utf-8");
  console.log(`✓ prerendered /${locale} → dist/${locale}/index.html`);
}

// Clean up the throwaway SSR bundle.
rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });
console.log("✓ prerender complete");
