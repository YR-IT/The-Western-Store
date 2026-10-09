import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.thewesternstore.in';
const SITEMAP_PATH = path.resolve(__dirname, '../public/sitemap.xml');

const staticRoutes = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/shop', priority: '0.9', changefreq: 'daily' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/pricing', priority: '0.8', changefreq: 'weekly' },
  { url: '/contact', priority: '0.8', changefreq: 'monthly' },
  { url: '/policies/refund-policy', priority: '0.7', changefreq: 'monthly' },
  { url: '/policies/shipping-policy', priority: '0.7', changefreq: 'monthly' },
  { url: '/policies/terms', priority: '0.7', changefreq: 'monthly' },
  { url: '/policies/privacy-policy', priority: '0.7', changefreq: 'monthly' },
];

async function generateSitemap() {
  console.log('🗺️ Generating sitemap.xml for The Western Store...');
  const urls: { url: string; priority: string; changefreq: string; lastmod?: string }[] = [...staticRoutes];

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Fetch Categories
      const { data: categories, error: catErr } = await supabase.from('categories').select('slug, updated_at');
      if (!catErr && categories) {
        for (const cat of categories) {
          if (cat.slug) {
            urls.push({
              url: `/category/${cat.slug}`,
              priority: '0.8',
              changefreq: 'weekly',
              lastmod: cat.updated_at ? new Date(cat.updated_at).toISOString().split('T')[0] : undefined,
            });
          }
        }
      }

      // Fetch Products
      const { data: products, error: prodErr } = await supabase.from('products').select('slug, id, updated_at');
      if (!prodErr && products) {
        for (const prod of products) {
          const itemSlug = prod.slug || prod.id;
          if (itemSlug) {
            urls.push({
              url: `/product/${itemSlug}`,
              priority: '0.9',
              changefreq: 'weekly',
              lastmod: prod.updated_at ? new Date(prod.updated_at).toISOString().split('T')[0] : undefined,
            });
          }
        }
      }
    } catch (err) {
      console.warn('⚠️ [Sitemap Notice] Could not fetch dynamic catalog from Supabase, falling back to static routes:', err);
    }
  } else {
    console.log('ℹ️ [Sitemap Notice] Supabase credentials not found in build environment; generating static sitemap.');
  }

  const today = new Date().toISOString().split('T')[0];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${BASE_URL}${u.url}</loc>
    <lastmod>${u.lastmod || today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  fs.mkdirSync(path.dirname(SITEMAP_PATH), { recursive: true });
  fs.writeFileSync(SITEMAP_PATH, xmlContent, 'utf8');
  console.log(`✅ Sitemap successfully written with ${urls.length} URLs to: ${SITEMAP_PATH}`);
}

generateSitemap().catch((err) => {
  console.error('❌ Sitemap generation error:', err);
});
