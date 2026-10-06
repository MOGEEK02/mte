// Fallback for project pages that did not exist at the last deployment (pre-rendered pages are
// served as static files and never reach this function): /portfolio/:id and /en/portfolio/:id.
// Serves the app shell with that project's title, description, preview image and language
// already in the HTML, or a 404. The browser then runs the app as usual.

const BASE_URL = 'https://moutie.vercel.app';
const DEFAULT_IMAGE = `${BASE_URL}/images/web/og-default.png`;
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const BLOCK = /<title data-seo>[\s\S]*?(?=\s*<!-- \/default page tags -->)/;
const TEXT = {
  fr: { locale: 'fr-DZ', og: 'fr_DZ', suffix: 'Réalisations MTE', notFound: 'Page introuvable | MTE', notFoundText: 'Cette page n’existe pas ou a été déplacée.' },
  en: { locale: 'en', og: 'en_US', suffix: 'MTE Projects', notFound: 'Page not found | MTE', notFoundText: 'This page does not exist or has moved.' },
};

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

const urlFor = (lang, path) => `${BASE_URL}${lang === 'en' ? `/en${path}` : path}`;

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

function tags({ lang, title, description, path, image, type = 'website', noindex = false, bilingual = true, canonicalLang = lang }) {
  const t = TEXT[lang];
  const other = TEXT[lang === 'fr' ? 'en' : 'fr'];
  const canonical = escapeHtml(urlFor(canonicalLang, path));
  const i = escapeHtml(image || DEFAULT_IMAGE);
  const alternates = noindex || !bilingual ? [] : [
    ['fr-DZ', urlFor('fr', path)], ['fr', urlFor('fr', path)], ['en', urlFor('en', path)], ['x-default', urlFor('fr', path)],
  ];
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
    `<meta data-seo property="og:locale:alternate" content="${other.og}">`,
    `<meta data-seo name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta data-seo name="twitter:description" content="${escapeHtml(description)}">`,
    `<meta data-seo name="twitter:image" content="${i}">`,
  ].join('\n  ');
}

function summary(text, max = 158) {
  const flat = (text || '').replace(/#[\p{L}\p{N}_]+/gu, '').replace(/\p{Extended_Pictographic}|️|[→•]/gu, '').replace(/\s+/g, ' ').trim();
  return flat.length <= max ? flat : `${flat.slice(0, flat.slice(0, max).lastIndexOf(' '))}…`;
}

async function projectPage(id, lang) {
  const t = TEXT[lang];
  const path = `/portfolio/${id}`;
  const notFound = { status: 404, html: tags({ lang, title: t.notFound, description: t.notFoundText, path, noindex: true }) };
  if (!/^\d+$/.test(id)) return notFound;
  if (!supabaseUrl || !supabaseKey) return null;

  const res = await fetch(
    `${supabaseUrl}/rest/v1/portfolio?select=*,portfolio_media(media_url,media_type,sort_order)&id=eq.${id}`,
    { headers: { apikey: supabaseKey }, signal: AbortSignal.timeout(5000) },
  );
  if (!res.ok) return null;
  const [item] = await res.json();
  if (!item) return notFound;

  const hasEn = Boolean(item.title_en && item.title_en.trim());
  const useEn = lang === 'en' && hasEn;
  const title = (useEn ? item.title_en : item.title).trim();
  const description = summary(useEn ? item.description_en || item.description : item.description) || title;
  return {
    status: 200,
    html: tags({
      lang,
      title: `${title} | ${t.suffix}`,
      description,
      path,
      image: coverImage(item.portfolio_media),
      type: 'article',
      bilingual: hasEn,
      canonicalLang: lang === 'en' && !hasEn ? 'fr' : lang,
    }),
  };
}

export default async function handler(req, res) {
  let shell;
  try {
    shell = await loadShell(req);
  } catch (err) {
    console.error('page: app shell unavailable', err);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).send('Service momentanément indisponible. Réessayez dans un instant.');
  }

  const lang = req.query.lang === 'en' ? 'en' : 'fr';
  const id = typeof req.query.id === 'string' ? req.query.id : '';
  let page = null;
  try {
    page = await projectPage(id, lang);
  } catch (err) {
    console.error('page: lookup failed', err);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  const html = shell.replace(/<html lang="[^"]*">/, `<html lang="${TEXT[lang].locale}">`);
  // Without page data, serve the shell unchanged: the app still renders the page.
  if (!page) {
    res.setHeader('Cache-Control', 'public, s-maxage=60');
    return res.status(200).send(html);
  }
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
  return res.status(page.status).send(html.replace(BLOCK, () => page.html));
}
