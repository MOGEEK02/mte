import { select } from "./db";
import { DICT, LANGS, type Lang } from "./i18n";
import { createStore } from "./store";
import { getOptimizedImageUrl, isVideoMedia } from "./utils/imageOptimizer";

export interface MediaItem {
  id: number;
  media_url: string;
  media_type: "image" | "video";
  sort_order: number;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  created_at: string;
  /** Address of the project page: /portfolio/<slug> (edited in /admin; the id until it is set). */
  slug?: string | null;
  /** English and Arabic versions, edited in /admin (empty: the French text is shown). */
  title_en?: string | null;
  description_en?: string | null;
  title_ar?: string | null;
  description_ar?: string | null;
  /** Set in /admin (columns added by supabase/admin.sql). */
  service_slug?: string | null;
  published?: boolean;
  portfolio_media: MediaItem[];
}

// "*" rather than a column list, so the query works before and after supabase/admin.sql adds columns.
const SELECT = "*,portfolio_media(id,media_url,media_type,sort_order)";

export function fetchPortfolio(limit?: number): Promise<PortfolioItem[]> {
  return select<PortfolioItem>("portfolio", {
    select: SELECT,
    order: "created_at.desc",
    ...(limit ? { limit: String(limit) } : {}),
  });
}

/** A project by its address segment: the slug, or the numeric id of older links. */
export async function fetchPortfolioItem(key: string): Promise<PortfolioItem | null> {
  if (!/^[a-z0-9-]+$/.test(key)) return null;
  const filter: Record<string, string> = /^\d+$/.test(key) ? { id: `eq.${key}` } : { slug: `eq.${key}` };
  const [item] = await select<PortfolioItem>("portfolio", { select: SELECT, ...filter });
  return item ?? null;
}

export function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export function sortedMedia(item: PortfolioItem): MediaItem[] {
  return [...(item.portfolio_media ?? [])].sort((a, b) => a.sort_order - b.sort_order);
}

const IMGUR_VIDEO = /^https?:\/\/(?:i\.)?imgur\.com\/([a-zA-Z0-9]+)\.(mp4|gifv|webm)/i;
const IMGUR_IMAGE = /^https?:\/\/(?:i\.)?imgur\.com\/([a-zA-Z0-9]+)\.(jpe?g|png|webp)/i;

/** Imgur resized copies: "l" ≈ 640 px wide, "h" ≈ 1024 px. Video ids give a still frame. */
export type StillSize = "l" | "h";

/** A still image for a media item: the photo itself, or a frame of the video when the host provides one. */
export function stillImage(m: MediaItem, size: StillSize = "l"): string | null {
  const yt = getYouTubeId(m.media_url);
  if (yt) return `https://img.youtube.com/vi/${yt}/hqdefault.jpg`;
  const imgur = m.media_url.trim().match(IMGUR_VIDEO) ?? m.media_url.trim().match(IMGUR_IMAGE);
  if (imgur) return `https://i.imgur.com/${imgur[1]}${size}.jpg`;
  return isVideoMedia(m.media_url, m.media_type) ? null : getOptimizedImageUrl(m.media_url);
}

/** Direct file URL for a hosted video ("imgur.com/x.mp4" only redirects; "i.imgur.com" serves the file). */
export function videoSource(url: string): string {
  const imgur = url.match(IMGUR_VIDEO);
  return imgur ? `https://i.imgur.com/${imgur[1]}.mp4` : url;
}

/** The first still image of a project, for cards and link previews. */
export function coverImage(item: PortfolioItem): string | null {
  for (const m of sortedMedia(item)) {
    const still = stillImage(m);
    if (still) return still;
  }
  return null;
}

const HASHTAG = /#[\p{L}\p{N}_]+/gu;

export function splitDescription(text: string) {
  const tags = (text || "").match(HASHTAG) ?? [];
  const body = (text || "").replace(HASHTAG, "").replace(/[ \t]+\n/g, "\n").trim();
  return { body, tags: [...new Set(tags)] };
}

/** Same result on the server (pre-render) and in the browser, whatever their time zone. */
export function formatDate(iso: string, lang: Lang = "fr") {
  return new Date(iso).toLocaleDateString(DICT[lang].dateLocale, { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Algiers" });
}

/** Title and description in the page's language; `translated` is false when it falls back to French. */
export function projectText(item: PortfolioItem, lang: Lang) {
  if (lang !== "fr") {
    const title = item[`title_${lang}`]?.trim();
    if (title) return { title, description: item[`description_${lang}`]?.trim() || item.description, translated: true };
  }
  return { title: item.title.trim(), description: item.description, translated: lang === "fr" };
}

/** Languages the project is written in (French always). */
export function projectLangs(item: PortfolioItem): Lang[] {
  return LANGS.filter((l) => l === "fr" || Boolean(item[`title_${l}`]?.trim()));
}

/** "/portfolio/plc-programming-industrial-vacuum-system" (or "/portfolio/18" before a slug is set). */
export function projectPath(item: PortfolioItem) {
  return `/portfolio/${item.slug?.trim() || item.id}`;
}

/** Finds a project by its address segment: the slug, or the numeric id of older links. */
export function findProject(items: PortfolioItem[], key: string) {
  return items.find((p) => p.slug === key) ?? (/^\d+$/.test(key) ? items.find((p) => String(p.id) === key) : undefined);
}

/** All published projects, newest first; null until loaded. */
export const portfolioStore = createStore<PortfolioItem[] | null>({
  key: "portfolio",
  fallback: null,
  load: async () => fetchPortfolio(),
});
