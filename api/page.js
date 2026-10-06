// Project pages that are not pre-rendered files (pre-rendered pages are served as static files
// and never reach this function): /portfolio/:key, /en/portfolio/:key, /ar/portfolio/:key.
// - an old numeric link (/portfolio/18) is redirected permanently to the project's address
//   (/portfolio/plc-programming-industrial-vacuum-system);
// - a project added since the last deployment gets the app shell with its title, description,
//   preview image and languages already in the HTML; an unknown address gets a 404.

const BASE_URL = 'https://moutie.vercel.app';
const DEFAULT_IMAGE = `${BASE_URL}/images/web/og-default.png`;
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const BLOCK = /<title data-seo>[\s\S]*?(?=\s*<!-- \/default page tags -->)/;
const TEXT = {
  fr: { locale: 'fr-DZ', dir: 'ltr', og: 'fr_DZ', hreflang: ['fr-DZ', 'fr'], suffix: 'Réalisations MTE', notFound: 'Page introuvable | MTE', notFoundText: 'Cette page n’existe pas ou a été déplacée.' },
  en: { locale: 'en', dir: 'ltr', og: 'en_US', hreflang: ['en'], suffix: 'MTE Projects', notFound: 'Page not found | MTE', notFoundText: 'This page does not exist or has moved.' },
  ar: { locale: 'ar-DZ', dir: 'rtl', og: 'ar_DZ', hreflang: ['ar-DZ', 'ar'], suffix: 'إنجازات MTE', notFound: 'الصفحة غير موجودة | MTE', notFoundText: 'هذه الصفحة غير موجودة أو تم نقلها.' },
};
const LANGS = ['fr', 'en', 'ar'];

let shellCache = null;

async function loadShell(req) {
  if (shellCache) return shellCache;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const headers = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    ? { 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET }
    : {};
  const res = await fetch(`https://${host}/shell.html`, { headers });
  if (!res.ok) throw new Error(`shell ${res.status}`);
  const html = await res.text();
  if (!BLOCK.test(html)) throw new Error('shell without page tags');
  shellCache = html;
  return html;
}

function escapeHtml(str) {
  return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const pathFor = (lang, path) => (lang === 'fr' ? path : `/${lang}${path}`);
const urlFor = (lang, path) => `${BASE_URL}${pathFor(lang, path)}`;

function getYouTubeId(url) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function coverImage(media) {
  const sorted = [...(media || [])].sort((a, b) => a.sort_order - b.sort_order);
  for (const m of sorted) {
    const url = (m.media_url || '').trim();
    const yt = getYouTubeId(url);
    if (yt) return `https://img.youtube.com/vi/${yt}/hqdefault.jpg`;
    // Imgur serves a 1024 px copy at <id>h.jpg (a frame for videos); originals are often too heavy for previews.
    const imgur = url.match(/^https?:\/\/(?:i\.)?imgur\.com\/([a-zA-Z0-9]+)\.(mp4|gifv|webm|jpe?g|png|webp)/i);
    if (imgur) return `https://i.imgur.com/${imgur[1]}h.jpg`;
    if (m.media_type === 'video' || /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)) continue;
    return url;
  }
  return null;
}

function tags({ lang, title, description, path, image, type = 'website', noindex = false, available = LANGS }) {
  const t = TEXT[lang];
  const canonical = escapeHtml(urlFor(available.includes(lang) ? lang : 'fr', path));
  const i = escapeHtml(image || DEFAULT_IMAGE);
  const alternates =
    noindex || available.length < 2 || !available.includes(lang)
      ? []
      : [...available.flatMap((l) => TEXT[l].hreflang.map((h) => [h, urlFor(l, path)])), ['x-default', urlFor('fr', path)]];
  return [
    `<title data-seo>${escapeHtml(title)}</title>`,
    `<meta data-seo name="description" content="${escapeHtml(description)}">`,
    noindex ? `<meta data-seo name="robots" content="noindex, follow">` : `<link data-seo rel="canonical" href="${canonical}">`,
    ...alternates.map(([h, href]) => `<link data-seo rel="alternate" hreflang="${h}" href="${escapeHtml(href)}">`),
    `<meta data-seo property="og:type" content="${type}">`,
    `<meta data-seo property="og:url" content="${canonical}">`,
    `<meta data-seo property="og:title" content="${escapeHtml(title)}">`,
    `<meta data-seo property="og:description" content="${escapeHtml(description)}">`,
    `<meta data-seo property="og:image" content="${i}">`,
    `<meta data-seo property="og:locale" content="${t.og}">`,
    `<meta data-seo name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta data-seo name="twitter:description" content="${escapeHtml(description)}">`,
    `<meta data-seo name="twitter:image" content="${i}">`,
  ].join('\n  ');
}

function summary(text, max = 158) {
  const flat = (text || '').replace(/#[\p{L}\p{N}_]+/gu, '').replace(/\p{Extended_Pictographic}|️|[→•]/gu, '').replace(/\s+/g, ' ').trim();
  return flat.length <= max ? flat : `${flat.slice(0, flat.slice(0, max).lastIndexOf(' '))}…`;
}

async function fetchProject(key) {
  const filter = /^\d+$/.test(key) ? `id=eq.${key}` : `slug=eq.${encodeURIComponent(key)}`;
  const res = await fetch(`${supabaseUrl}/rest/v1/portfolio?select=*,portfolio_media(media_url,media_type,sort_order)&${filter}`, {
    headers: { apikey: supabaseKey },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`portfolio ${res.status}`);
  const [item] = await res.json();
  return item ?? null;
}

async function projectPage(key, lang) {
  const t = TEXT[lang];
  const path = `/portfolio/${key}`;
  const notFound = { status: 404, html: tags({ lang, title: t.notFound, description: t.notFoundText, path, noindex: true }) };
  if (!/^[a-z0-9-]+$/.test(key)) return notFound;
  if (!supabaseUrl || !supabaseKey) return null;

  const item = await fetchProject(key);
  if (!item) return notFound;
  const slug = (item.slug || '').trim();
  if (slug && slug !== key) return { redirect: pathFor(lang, `/portfolio/${slug}`) };

  const available = LANGS.filter((l) => l === 'fr' || (item[`title_${l}`] || '').trim());
  const own = lang !== 'fr' && available.includes(lang);
  const title = (own ? item[`title_${lang}`] : item.title).trim();
  const description = summary(own ? item[`description_${lang}`] || item.description : item.description) || title;
  return {
    status: 200,
    html: tags({
      lang,
      title: `${title} | ${t.suffix}`,
      description,
      path: `/portfolio/${slug || item.id}`,
      image: coverImage(item.portfolio_media),
      type: 'article',
      available,
    }),
  };
}

export default async function handler(req, res) {
  const lang = LANGS.includes(req.query.lang) ? req.query.lang : 'fr';
  const key = typeof req.query.id === 'string' ? req.query.id : '';
  let page = null;
  try {
    page = await projectPage(key, lang);
  } catch (err) {
    console.error('page: lookup failed', err);
  }

  if (page?.redirect) {
    res.setHeader('Location', page.redirect);
    res.setHeader('Cache-Control', 'public, s-maxage=86400');
    return res.status(301).end();
  }

  let shell;
  try {
    shell = await loadShell(req);
  } catch (err) {
    console.error('page: app shell unavailable', err);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).send('Service momentanément indisponible. Réessayez dans un instant.');
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  const html = shell.replace(/<html lang="[^"]*">/, `<html lang="${TEXT[lang].locale}" dir="${TEXT[lang].dir}">`);
  // Without page data, serve the shell unchanged: the app still renders the page.
  if (!page) {
    res.setHeader('Cache-Control', 'public, s-maxage=60');
    return res.status(200).send(html);
  }
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
  return res.status(page.status).send(html.replace(BLOCK, () => page.html));
}
