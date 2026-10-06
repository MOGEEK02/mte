// GET /sitemap.xml — every public page in French, English and Arabic, with hreflang alternates
// (xhtml:link) and project images, always up to date with the database.

const BASE_URL = 'https://moutie.vercel.app';
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const LANGS = ['fr', 'en', 'ar'];
const HREFLANG = { fr: ['fr-DZ', 'fr'], en: ['en'], ar: ['ar-DZ', 'ar'] };
const urlFor = (lang, path) => `${BASE_URL}${lang === 'fr' ? path : path === '/' ? `/${lang}` : `/${lang}${path}`}`;

function escapeXml(str) {
  return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function imageUrl(m) {
  const url = (m.media_url || '').trim();
  const imgur = url.match(/^https?:\/\/(?:i\.)?imgur\.com\/([a-zA-Z0-9]+)\.(mp4|gifv|webm|jpe?g|png|webp)/i);
  if (imgur) return `https://i.imgur.com/${imgur[1]}h.jpg`;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (yt) return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`;
  return m.media_type === 'image' && /^https?:\/\//.test(url) ? url : null;
}

/** One <url> per language the page exists in; all carry the same alternates. */
function entries(path, { lastmod, priority, changefreq = 'monthly', langs = LANGS, images = [] }) {
  const alternates =
    langs.length > 1
      ? [
          ...langs.flatMap((l) => HREFLANG[l].map((h) => `    <xhtml:link rel="alternate" hreflang="${h}" href="${urlFor(l, path)}"/>`)),
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor('fr', path)}"/>`,
        ]
      : [];
  return langs
    .map((lang) =>
      [
        '  <url>',
        `    <loc>${urlFor(lang, path)}</loc>`,
        ...alternates,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        ...images.map((img) =>
          ['    <image:image>', `      <image:loc>${escapeXml(img.loc)}</image:loc>`, `      <image:title>${escapeXml(img.titles[lang])}</image:title>`, '    </image:image>'].join('\n'),
        ),
        '  </url>',
      ].join('\n'),
    )
    .join('\n');
}

async function projects() {
  if (!supabaseUrl || !supabaseKey) return [];
  const res = await fetch(`${supabaseUrl}/rest/v1/portfolio?select=*,portfolio_media(media_url,media_type,sort_order)&order=created_at.desc`, {
    headers: { apikey: supabaseKey },
    signal: AbortSignal.timeout(5000),
  });
  return res.ok ? res.json() : [];
}

export default async function handler(request, response) {
  response.setHeader('Content-Type', 'application/xml; charset=utf-8');
  response.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  response.setHeader('X-Robots-Tag', 'noindex');

  const today = new Date().toISOString().slice(0, 10);
  let items = [];
  try {
    items = await projects();
  } catch (err) {
    console.error('sitemap: projects unavailable', err);
  }
  const newest = items[0]?.updated_at?.slice(0, 10) || items[0]?.created_at?.slice(0, 10) || today;

  const urls = [
    entries('/', { lastmod: newest, priority: '1.0', changefreq: 'weekly' }),
    entries('/portfolio', { lastmod: newest, priority: '0.9', changefreq: 'weekly' }),
    ...items.map((p) => {
      const titles = Object.fromEntries(LANGS.map((l) => [l, (l === 'fr' ? p.title : p[`title_${l}`] || '').trim()]));
      return entries(`/portfolio/${(p.slug || '').trim() || p.id}`, {
        lastmod: (p.updated_at || p.created_at).slice(0, 10),
        priority: '0.8',
        langs: LANGS.filter((l) => titles[l]),
        images: [...(p.portfolio_media || [])]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(imageUrl)
          .filter(Boolean)
          .slice(0, 10)
          .map((loc) => ({ loc, titles: Object.fromEntries(LANGS.map((l) => [l, titles[l] || titles.fr])) })),
      });
    }),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>`;
  return response.status(200).send(xml);
}
