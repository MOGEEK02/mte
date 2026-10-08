import { select } from "./db";
import { DICT, useLang, type Lang } from "./i18n";
import { createStore } from "./store";

/**
 * Texts edited in /admin → Contenu ("site_content" table, one row per block). Each block holds
 * only what was changed, per language; everything else comes from src/i18n.ts.
 */
export type FaqItem = { q: string; a: string };
export type Announcement = {
  enabled: boolean;
  tone: "info" | "alert";
  /** Optional: "/store", "/#contact", "https://…". */
  link: string;
  /** Last day shown (YYYY-MM-DD, Algeria time); empty: until switched off. */
  until: string;
  text: Partial<Record<Lang, string>>;
};
export type HeroTexts = { eyebrow?: string; title?: string; text?: string; checks?: string[] };
export type ReachTexts = { sectors?: string[]; areas?: string[] };
export type AboutTexts = { title?: string; paragraphs?: string[] };
/** Photo behind the home page title, chosen in /admin → Contenu (empty: the built-in one). */
export type HeroImage = { url?: string; position?: HeroPosition; brightness?: number };
export type HeroPosition = "center" | "top" | "bottom";
export type SiteContent = {
  announcement?: Announcement;
  hero?: Partial<Record<Lang, HeroTexts>>;
  faq?: Partial<Record<Lang, FaqItem[]>>;
  reach?: Partial<Record<Lang, ReachTexts>>;
  about?: Partial<Record<Lang, AboutTexts>>;
  hero_image?: HeroImage;
  store?: { open?: boolean };
};

export async function fetchContent(): Promise<SiteContent | undefined> {
  const rows = await select<{ key: string; value: unknown }>("site_content", { select: "key,value" });
  return rows.length ? (Object.fromEntries(rows.map((r) => [r.key, r.value])) as SiteContent) : undefined;
}

export const contentStore = createStore<SiteContent>({ key: "content", fallback: {}, load: fetchContent });

const filled = (s?: string) => s?.trim() || undefined;
const lines = (l?: string[]) => {
  const kept = l?.map((s) => s.trim()).filter(Boolean);
  return kept?.length ? kept : undefined;
};

/** The built-in About paragraphs: MTE and its engineers (no personal name on the site). */
export function defaultAbout(lang: Lang) {
  const t = DICT[lang].about;
  return [t.p1, t.p2, t.p3, t.p4];
}

/** Page texts in one language: what was changed in /admin, otherwise the built-in text. */
export function siteTexts(lang: Lang, c: SiteContent) {
  const t = DICT[lang];
  const hero = c.hero?.[lang] ?? {};
  const reach = c.reach?.[lang] ?? {};
  const about = c.about?.[lang] ?? {};
  const faq = c.faq?.[lang]?.map((f) => ({ q: f.q.trim(), a: f.a.trim() })).filter((f) => f.q && f.a);
  return {
    hero: {
      eyebrow: filled(hero.eyebrow) ?? t.hero.eyebrow,
      title: filled(hero.title) ?? t.hero.title,
      text: filled(hero.text) ?? t.hero.text,
      checks: lines(hero.checks) ?? t.hero.checks,
    },
    faq: faq?.length ? faq : t.faq.items,
    sectors: lines(reach.sectors) ?? t.reach.sectors,
    areas: lines(reach.areas) ?? t.reach.areas,
    about: { title: filled(about.title) ?? t.about.title, paragraphs: lines(about.paragraphs) ?? defaultAbout(lang) },
  };
}

export type SiteTexts = ReturnType<typeof siteTexts>;

export const DEFAULT_HERO_IMAGE = "/images/web/hero.webp";
/** Brightness of the photo under the title, in % (the title stays readable up to about 70). */
export const DEFAULT_HERO_BRIGHTNESS = 45;
export const HERO_BRIGHTNESS_RANGE = [15, 80] as const;

/** The hero photo to show: the one chosen in /admin, or the built-in one. */
export function heroImage(c: SiteContent) {
  const h = c.hero_image ?? {};
  const [min, max] = HERO_BRIGHTNESS_RANGE;
  const brightness = typeof h.brightness === "number" ? Math.min(max, Math.max(min, Math.round(h.brightness))) : DEFAULT_HERO_BRIGHTNESS;
  const position: HeroPosition = h.position === "top" || h.position === "bottom" ? h.position : "center";
  return { url: h.url?.trim() || DEFAULT_HERO_IMAGE, position, brightness };
}

export function useHeroImage() {
  return heroImage(contentStore.use());
}

export function useSiteTexts(): SiteTexts {
  return siteTexts(useLang(), contentStore.use());
}

/** Today in Algeria, "YYYY-MM-DD". */
export function algeriaDay(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Algiers", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

/** The banner for a page language (French text when that language has none), or null when off or past its last day. */
export function announcementFor(lang: Lang, c: SiteContent, now: Date) {
  const a = c.announcement;
  if (!a?.enabled) return null;
  const own = a.text?.[lang]?.trim();
  const text = own || a.text?.fr?.trim();
  if (!text) return null;
  if (a.until && algeriaDay(now) > a.until) return null;
  return { text, lang: own ? lang : ("fr" as Lang), tone: a.tone === "alert" ? "alert" : "info", link: a.link?.trim() ?? "" };
}

/** Whether the store shows its catalogue (switch in /admin → Boutique). */
export const storeOpen = (c: SiteContent) => c.store?.open === true;

/**
 * Build time of the pre-rendered pages (embedded with their data), so that the first render in
 * the browser makes the same date-based choices as the HTML it takes over.
 */
export const buildInfo = { at: typeof window === "undefined" ? "" : String(window.__MTE_DATA__?.builtAt ?? "") };
