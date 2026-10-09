// Build-time prerender: renders the marketing routes (home, services index,
// and every service detail page) in each locale to static HTML, so crawlers
// get fully-translated pages. Runs after the client build + SSR build.

import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve, join } from "node:path";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const distDir = resolve(root, "dist");
const ssrEntry = resolve(root, "dist-ssr", "entry-server.js");

const LOCALES = ["fr", "en", "ar"];

const { render, SERVICE_SLUGS } = await import(pathToFileURL(ssrEntry).href);

// Build the full route list.
const routes = [];
for (const locale of LOCALES) {
  routes.push(`/${locale}`);
  routes.push(`/${locale}/services`);
  for (const slug of SERVICE_SLUGS) routes.push(`/${locale}/services/${slug}`);
}

const template = readFileSync(resolve(distDir, "index.html"), "utf-8");

for (const route of routes) {
  const { html, helmet } = render(route);

  let page = template;
  page = page.replace(/\s*<title>[\s\S]*?<\/title>/, "");
  page = page.replace(/\s*<meta name="description"[^>]*>/, "");

  if (helmet?.htmlAttributes) {
    page = page.replace(/<html[^>]*>/, `<html ${helmet.htmlAttributes.toString()}>`);
  }

  const head = [
    helmet?.title?.toString() ?? "",
    helmet?.meta?.toString() ?? "",
    helmet?.link?.toString() ?? "",
    helmet?.script?.toString() ?? "",
  ].join("\n");
  page = page.replace("</head>", `${head}\n</head>`);
  page = page.replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  const outDir = join(distDir, ...route.split("/").filter(Boolean));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), page, "utf-8");
  console.log(`✓ prerendered ${route}`);
}

rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });
console.log(`✓ prerender complete (${routes.length} pages)`);
