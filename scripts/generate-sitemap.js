import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables safely for both local and action runner mapping
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Setup Supabase Client using the exact variable name Vercel expects
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

async function generateSitemap() {
  console.log('[SEO Sitemap] Generating Google XML structure...');
  
  const baseUrl = 'https://mte-dz.com';
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Fundamental Pages
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/</loc>\n`;
  xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
  xml += `  </url>\n`;

  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/portfolio</loc>\n`;
  xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
  xml += `  </url>\n`;

  // Always attempt to inject dynamic Database iterations when keys are genuinely valid
  if (supabaseUrl !== 'https://placeholder.supabase.co' && supabaseKey !== 'placeholder') {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: posts, error } = await supabase.from('portfolio').select('id, created_at');

    if (!error && posts) {
      console.log(`[SEO Sitemap] Injecting ${posts.length} dynamic endpoints.`);
      posts.forEach(post => {
        const date = new Date(post.created_at).toISOString().split('T')[0];
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/portfolio/${post.id}</loc>\n`;
        xml += `    <lastmod>${date}</lastmod>\n`;
        xml += `  </url>\n`;
      });
    } else {
      console.warn('[SEO Sitemap] Database query failed, continuing with static core.');
    }
  } else {
    console.warn('[SEO Sitemap] Missing DB Keys detected. Proceeding to inject fundamental static pages only.');
  }

  xml += `</urlset>`;

  // Export definitively into public folder so Vite bundles it into /dist natively
  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log('[SEO Sitemap] XML generation process officially terminated and injected safely.');
}

generateSitemap();
