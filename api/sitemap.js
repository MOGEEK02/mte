import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

// Basic regex for YouTube parsing in sitemap
function getYouTubeId(url) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default async function handler(request, response) {
  const baseUrl = 'https://moutie.vercel.app';
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n`;
  xml += `        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n`;

  // Static: Homepage & Portfolio Hub
  const today = new Date().toISOString().split('T')[0];
  xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n`;
  xml += `  <url>\n    <loc>${baseUrl}/portfolio</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n`;

  // Dynamic Portfolio Posts with Image/Video Extensions
  if (supabaseUrl !== 'https://placeholder.supabase.co' && supabaseKey !== 'placeholder') {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: posts, error } = await supabase
      .from('portfolio')
      .select(`
        id, title, description, created_at,
        portfolio_media ( media_url, media_type )
      `)
      .order('created_at', { ascending: false });

    if (!error && posts) {
      posts.forEach(post => {
        const date = new Date(post.created_at).toISOString().split('T')[0];
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/portfolio/${post.id}</loc>\n`;
        xml += `    <lastmod>${date}</lastmod>\n`;
        
        // Inject Media Extensions (Images & Videos)
        if (post.portfolio_media && post.portfolio_media.length > 0) {
          post.portfolio_media.forEach(media => {
            if (media.media_type === 'image') {
              xml += `    <image:image>\n`;
              xml += `      <image:loc>${media.media_url}</image:loc>\n`;
              xml += `      <image:title>${post.title.replace(/[&<>"']/g, '')}</image:title>\n`;
              xml += `      <image:caption>${post.description.substring(0, 150).replace(/[&<>"']/g, '')}</image:caption>\n`;
              xml += `    </image:image>\n`;
            } else if (media.media_type === 'video') {
              const ytId = getYouTubeId(media.media_url);
              if (ytId) {
                xml += `    <video:video>\n`;
                xml += `      <video:thumbnail_loc>https://img.youtube.com/vi/${ytId}/hqdefault.jpg</video:thumbnail_loc>\n`;
                xml += `      <video:title>${post.title.replace(/[&<>"']/g, '')}</video:title>\n`;
                xml += `      <video:description>${post.description.substring(0, 150).replace(/[&<>"']/g, '')}</video:description>\n`;
                xml += `      <video:player_loc>https://www.youtube.com/embed/${ytId}</video:player_loc>\n`;
                xml += `    </video:video>\n`;
              }
            }
          });
        }
        
        xml += `  </url>\n`;
      });
    }
  }

  xml += `</urlset>`;

  response.setHeader('Content-Type', 'application/xml');
  response.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate'); 
  return response.status(200).send(xml);
}
