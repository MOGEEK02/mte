/**
 * Utility to optimize external image URLs (especially Imgur) and provide fallbacks.
 */

export const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450'%3E%3Crect width='600' height='450' fill='%230f172a'/%3E%3Cg fill='none' stroke='%23334155' stroke-width='2'%3E%3Crect x='160' y='110' width='280' height='190' rx='12' stroke-dasharray='6 6'/%3E%3Ccircle cx='230' cy='180' r='24' fill='%231e293b' stroke='%233b82f6' stroke-width='2'/%3E%3Cpath d='M190 270 l90-70 70 50 50-40 40 60' stroke='%230ea5e9' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Ctext x='300' y='340' fill='%2394a3b8' font-family='system-ui, sans-serif' font-size='15' text-anchor='middle' font-weight='600'%3EMTE %C3%89lectronique Industrielle%3C/text%3E%3Ctext x='300' y='365' fill='%2364748b' font-family='system-ui, sans-serif' font-size='12' text-anchor='middle'%3EImage indisponible%3C/text%3E%3C/svg%3E";

export function getOptimizedImageUrl(url: string, _width: number = 800): string {
  if (!url) return FALLBACK_IMAGE;
  const cleanUrl = url.trim();
  if (!cleanUrl) return FALLBACK_IMAGE;

  // If it's already a YouTube thumbnail or data URL or SVG, return as is
  if (cleanUrl.includes('img.youtube.com') || cleanUrl.startsWith('data:') || cleanUrl.endsWith('.svg')) {
    return cleanUrl;
  }

  // Handle Imgur URLs (direct or page/album links)
  const imgurMatch = cleanUrl.match(/https?:\/\/(?:i\.)?imgur\.com\/(?:gallery\/|a\/)?([a-zA-Z0-9]+)(\.[a-zA-Z]{3,4})?/i);
  if (imgurMatch) {
    const id = imgurMatch[1];
    const ext = imgurMatch[2] || '.jpg';
    return `https://i.imgur.com/${id}${ext}`;
  }

  // Return direct raw image URL
  return cleanUrl;
}

/**
 * Robust check to identify if a media item is a video.
 */
export function isVideoMedia(url?: string, mediaType?: string): boolean {
  if (!url) return false;
  const cleanUrl = url.trim().toLowerCase();

  // 1. YouTube link check
  if (/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(cleanUrl)) {
    return true;
  }

  const pathWithoutQuery = cleanUrl.split('?')[0].split('#')[0];

  // 2. Video file extension check (.mp4, .webm, .ogg, .mov, .m4v, .m3u8, etc.)
  if (/\.(mp4|webm|ogg|mov|m4v|m3u8|avi|mkv)$/i.test(pathWithoutQuery)) {
    return true;
  }

  // 3. Known image extension check (.jpg, .jpeg, .png, .gif, .webp, .svg, .avif, .bmp, etc.)
  if (/\.(jpg|jpeg|png|gif|webp|svg|avif|bmp|tiff)$/i.test(pathWithoutQuery)) {
    return false;
  }

  // 4. Imgur / PostImg / ImgBB checks (primarily image hosts unless specified as video)
  if (cleanUrl.includes('imgur.com') || cleanUrl.includes('postimg.') || cleanUrl.includes('imgbb.')) {
    return false;
  }

  // 5. Fallback to mediaType string (case-insensitive)
  if (mediaType) {
    const type = mediaType.trim().toLowerCase();
    if (type === 'video') return true;
    if (type === 'image' || type === 'img' || type === 'photo' || type === 'picture') return false;
  }

  return false;
}

/**
 * Robust check to identify if a media item is an image.
 */
export function isImageMedia(url?: string, mediaType?: string): boolean {
  if (!url) return false;
  return !isVideoMedia(url, mediaType);
}

