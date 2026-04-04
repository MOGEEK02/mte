import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Setup Supabase Client securely
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[SEO Sitemap] Missing Supabase URL or Anon Key. Skipping Sitemap generation.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  console.log('[SEO Sitemap] Fetching dynamic portfolio publications...');
  
  const { data: posts, error } = await supabase
    .from('portfolio')
    .select('id, created_at');

  if (error) {
    console.error('[SEO Sitemap] Error fetching Supabase database:', error);
    process.exit(1);
  }

  // Define static core URLs mapping correctly to formatting document
  const baseUrl = 'https://mte-dz.com';
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static: Homepage
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/</loc>\n`;
  xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
  xml += `  </url>\n`;

  // Static: Portfolio Map
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/portfolio</loc>\n`;
  xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
  xml += `  </url>\n`;

  // Dynamic iteration from Database logic
  if (posts) {
    posts.forEach(post => {
      // Provide valid date layout YYYY-MM-DD
      const date = new Date(post.created_at).toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/portfolio/${post.id}</loc>\n`;
      xml += `    <lastmod>${date}</lastmod>\n`;
      xml += `  </url>\n`;
    });
  }

  xml += `</urlset>`;

  // Export definitively into public folder
  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(`[SEO Sitemap] Successfully generated sitemap.xml with ${posts ? posts.length + 2 : 2} URLs.`);
}

generateSitemap();
