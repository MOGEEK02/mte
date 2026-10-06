import { createClient } from '@supabase/supabase-js';

// Serves the app shell for /portfolio and /portfolio/:id with that page's title,
// description and preview image already in the HTML, so WhatsApp, Facebook,
// LinkedIn and crawlers that don't run JavaScript see the right page.
// The browser then runs the app as usual (src/main.tsx replaces these tags).

const BASE_URL = 'https://moutie.vercel.app';
const DEFAULT_IMAGE = `${BASE_URL}/images/web/og-default.png`;
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const BLOCK = /<title data-seo>[\s\S]*?(?=\s*<!-- \/default page tags -->)/;

let shellCache = null;

async function loadShell(req) {
  if (shellCache) return shellCache;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const headers = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    ? { 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET }
    : {};
  const res = await fetch(`https://${host}/index.html`, { headers });
  if (!res.ok) throw new Error(`shell ${res.status}`);
  const html = await res.text();
  if (!BLOCK.test(html)) throw new Error('shell without default tags');
  shellCache = html;
  return html;
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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
    // Imgur serves a frame of a video at <id>h.jpg.
    const imgurVideo = url.match(/^https?:\/\/(?:i\.)?imgur\.com\/([a-zA-Z0-9]+)\.(mp4|gifv|webm)/i);
    if (imgurVideo) return `https://i.imgur.com/${imgurVideo[1]}h.jpg`;
    if (m.media_type === 'video' || /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)) continue;
    const imgur = url.match(/https?:\/\/(?:i\.)?imgur\.com\/(?:gallery\/|a\/)?([a-zA-Z0-9]+)(\.[a-zA-Z]{3,4})?/i);
    // The 1024 px copy: originals are often too heavy for WhatsApp previews.
    return imgur ? `https://i.imgur.com/${imgur[1]}h.jpg` : url;
  }
  return null;
}

function tags({ title, description, path, image, type = 'website', noindex = false }) {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const u = escapeHtml(`${BASE_URL}${path}`);
  const i = escapeHtml(image || DEFAULT_IMAGE);
  return [
    `<title data-seo>${t}</title>`,
    `<meta data-seo name="description" content="${d}">`,
    noindex ? `<meta data-seo name="robots" content="noindex, follow">` : `<link data-seo rel="canonical" href="${u}">`,
    `<meta data-seo property="og:type" content="${type}">`,
    `<meta data-seo property="og:url" content="${u}">`,
    `<meta data-seo property="og:title" content="${t}">`,
    `<meta data-seo property="og:description" content="${d}">`,
    `<meta data-seo property="og:image" content="${i}">`,
    `<meta data-seo name="twitter:title" content="${t}">`,
    `<meta data-seo name="twitter:description" content="${d}">`,
    `<meta data-seo name="twitter:image" content="${i}">`,
  ].join('\n  ');
}

const NOT_FOUND = { title: 'Page introuvable | MTE', description: 'Cette page n’existe pas ou a été déplacée.', noindex: true };

async function portfolioTags(id) {
  if (!id) {
    return {
      status: 200,
      tags: tags({
        title: 'Réalisations – réparations industrielles | MTE Algérie',
        description: 'Interventions réelles de MTE : réparation de variateurs de vitesse, automates, cartes électroniques et équipements industriels partout en Algérie.',
        path: '/portfolio',
      }),
    };
  }
  const notFound = { status: 404, tags: tags({ ...NOT_FOUND, path: `/portfolio/${id}` }) };
  if (!/^\d+$/.test(id)) return notFound;
  if (!supabaseUrl || !supabaseKey) return null;

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from('portfolio')
    .select('id, title, description, portfolio_media ( media_url, media_type, sort_order )')
    .eq('id', id)
    .maybeSingle();
  if (error) return null;
  if (!data) return notFound;

  const body = (data.description || '').replace(/#[\p{L}\p{N}_]+/gu, '').replace(/\s+/g, ' ').trim();
  return {
    status: 200,
    tags: tags({
      title: `${data.title.trim()} | Réalisations MTE`,
      description: (body || data.title).slice(0, 160),
      path: `/portfolio/${data.id}`,
      image: coverImage(data.portfolio_media),
      type: 'article',
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

  const param = (name) => (typeof req.query[name] === 'string' ? req.query[name] : '');
  let page = null;
  try {
    page = await portfolioTags(param('id'));
  } catch (err) {
    console.error('page: lookup failed', err);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Without page data, serve the shell unchanged: the app still renders the page.
  if (!page) {
    res.setHeader('Cache-Control', 'public, s-maxage=60');
    return res.status(200).send(shell);
  }
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
  return res.status(page.status).send(shell.replace(BLOCK, () => page.tags));
}
