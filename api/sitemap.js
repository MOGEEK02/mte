import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const BASE_URL = 'https://moutie.vercel.app';

function getYouTubeId(url) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function escapeXml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

// Service page slugs (shared across languages). Keep in sync with src/i18n/fr.ts.
const SERVICE_SLUGS = [
  'programmation-plc',
  'variateurs-vfd',
  'servo-variateurs',
  'ihm-scada',
  'reparation-carte-electronique',
  'armoires-de-commande',
  'reparation-machine-industrielle',
  'groupe-electrogene',
];

function altLinks(path) {
  return `      <xhtml:link rel="alternate" hreflang="fr" href="${BASE_URL}/fr${path}"/>
      <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en${path}"/>
      <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/fr${path}"/>`;
}

// Localized services index + per-service detail pages, both languages, with hreflang.
function servicesUrlsXml(today) {
  const paths = ['/services', ...SERVICE_SLUGS.map((s) => `/services/${s}`)];
  const out = [];
  for (const path of paths) {
    for (const locale of ['fr', 'en']) {
      out.push(`  <url>
    <loc>${BASE_URL}/${locale}${path}</loc>
    <lastmod>${today}</lastmod>
${altLinks(path)}
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
    }
  }
  return out.join('\n');
}

// Localized home pages with reciprocal hreflang alternates.
function homeUrlsXml(today) {
  const alts = `      <xhtml:link rel="alternate" hreflang="fr" href="${BASE_URL}/fr"/>
      <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en"/>
      <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/fr"/>`;
  return `  <url>
    <loc>${BASE_URL}/fr</loc>
    <lastmod>${today}</lastmod>
${alts}
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/en</loc>
    <lastmod>${today}</lastmod>
${alts}
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;
}

function buildStaticFallbackXml() {
  const today = new Date().toISOString().split('T')[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${homeUrlsXml(today)}
${servicesUrlsXml(today)}
  <url>
    <loc>${BASE_URL}/portfolio</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/portfolio/1</loc>
    <lastmod>2026-02-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/portfolio/2</loc>
    <lastmod>2026-03-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/portfolio/3</loc>
    <lastmod>2025-12-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/portfolio/4</loc>
    <lastmod>2026-01-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/portfolio/5</loc>
    <lastmod>2025-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/portfolio/6</loc>
    <lastmod>2026-02-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/portfolio/7</loc>
    <lastmod>2025-10-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/portfolio/8</loc>
    <lastmod>2023-02-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/portfolio/9</loc>
    <lastmod>2025-09-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/portfolio/10</loc>
    <lastmod>2023-10-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/portfolio/11</loc>
    <lastmod>2025-02-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/portfolio/12</loc>
    <lastmod>2025-09-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/portfolio/13</loc>
    <lastmod>2025-02-25</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/portfolio/14</loc>
    <lastmod>2025-01-21</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
}

export default async function handler(request, response) {
  // ALWAYS set XML headers first — even before any logic
  response.setHeader('Content-Type', 'application/xml; charset=utf-8');
  response.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  response.setHeader('X-Robots-Tag', 'noindex');

  try {
    // If Supabase credentials are missing, return static fallback immediately
    if (!supabaseUrl || !supabaseKey) {
      return response.status(200).send(buildStaticFallbackXml());
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Set a timeout for the Supabase query (5 seconds max)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Supabase query timeout')), 5000)
    );
    
    const queryPromise = supabase
      .from('portfolio')
      .select(`
        id, title, description, created_at,
        portfolio_media ( media_url, media_type )
      `)
      .order('created_at', { ascending: false });

    const { data: posts, error } = await Promise.race([queryPromise, timeoutPromise]);

    // If query failed, return static fallback
    if (error || !posts || posts.length === 0) {
      return response.status(200).send(buildStaticFallbackXml());
    }

    // Build dynamic sitemap
    const today = new Date().toISOString().split('T')[0];
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n`;
    xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n`;
    xml += `        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n`;

    // Localized home pages (/fr, /en) with hreflang
    xml += `${homeUrlsXml(today)}\n`;

    // Services index + per-service pages (/fr, /en) with hreflang
    xml += `${servicesUrlsXml(today)}\n`;

    // Portfolio hub
    xml += `  <url>\n    <loc>${BASE_URL}/portfolio</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

    // Dynamic portfolio posts
    posts.forEach(post => {
      const date = new Date(post.created_at).toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/portfolio/${post.id}</loc>\n`;
      xml += `    <lastmod>${date}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;

      // Image & Video extensions
      if (post.portfolio_media && post.portfolio_media.length > 0) {
        post.portfolio_media.forEach(media => {
          if (media.media_type === 'image') {
            xml += `    <image:image>\n`;
            xml += `      <image:loc>${escapeXml(media.media_url)}</image:loc>\n`;
            xml += `      <image:title>${escapeXml(post.title)}</image:title>\n`;
            xml += `      <image:caption>${escapeXml((post.description || '').substring(0, 150))}</image:caption>\n`;
            xml += `    </image:image>\n`;
          } else if (media.media_type === 'video') {
            const ytId = getYouTubeId(media.media_url);
            if (ytId) {
              xml += `    <video:video>\n`;
              xml += `      <video:thumbnail_loc>https://img.youtube.com/vi/${ytId}/hqdefault.jpg</video:thumbnail_loc>\n`;
              xml += `      <video:title>${escapeXml(post.title)}</video:title>\n`;
              xml += `      <video:description>${escapeXml((post.description || '').substring(0, 150))}</video:description>\n`;
              xml += `      <video:player_loc>https://www.youtube.com/embed/${ytId}</video:player_loc>\n`;
              xml += `    </video:video>\n`;
            }
          }
        });
      }

      xml += `  </url>\n`;
    });

    xml += `</urlset>`;
    return response.status(200).send(xml);

  } catch (err) {
    // CRITICAL: Never return an error — always return valid XML
    console.error('Sitemap generation error:', err);
    return response.status(200).send(buildStaticFallbackXml());
  }
}
