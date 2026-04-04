import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export default async function handler(request, response) {
  const baseUrl = 'https://moutie.vercel.app';
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Provide core static nodes unconditionally
  const today = new Date().toISOString().split('T')[0];
  xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n`;
  xml += `  <url>\n    <loc>${baseUrl}/portfolio</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n`;

  // Append Live Supabase Database entries immediately if Auth config functions correctly
  if (supabaseUrl !== 'https://placeholder.supabase.co' && supabaseKey !== 'placeholder') {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: posts, error } = await supabase.from('portfolio').select('id, created_at');

    if (!error && posts) {
      posts.forEach(post => {
        const date = new Date(post.created_at).toISOString().split('T')[0];
        xml += `  <url>\n    <loc>${baseUrl}/portfolio/${post.id}</loc>\n    <lastmod>${date}</lastmod>\n  </url>\n`;
      });
    }
  }

  xml += `</urlset>`;

  response.setHeader('Content-Type', 'application/xml');
  
  // Protect Database from being spammed by Google parsing multiple domains per/sec.
  // Cache for half an hour explicitly; highly effective but maintains extremely fresh sync! 
  response.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate'); 
  return response.status(200).send(xml);
}
