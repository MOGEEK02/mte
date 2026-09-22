/**
 * Optimizes external image URLs (e.g. Imgur, direct links) by routing them through
 * wsrv.nl (Cloudflare CDN cache + dynamic WebP conversion & resizing).
 */
export function getOptimizedImageUrl(url: string, width: number = 800, quality: number = 80): string {
  if (!url) return '';
  
  // If it's already a YouTube thumbnail or local SVG/data URL, return as is
  if (url.includes('img.youtube.com') || url.startsWith('data:') || url.endsWith('.svg')) {
    return url;
  }

  // Optimize Imgur and other raw external image URLs via wsrv.nl CDN
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp&q=${quality}`;
}
