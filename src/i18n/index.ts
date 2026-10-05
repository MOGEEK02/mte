import fr, { type Dictionary } from "./fr";
import en from "./en";

export type Locale = "fr" | "en";

export const LOCALES: Locale[] = ["fr", "en"];
export const DEFAULT_LOCALE: Locale = "fr";

export const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function isLocale(value: string | undefined): value is Locale {
  return value === "fr" || value === "en";
}

/** Service slugs (shared across languages) — drives routing, prerender and lookups. */
export const SERVICE_SLUGS: string[] = fr.services.items.map((s) => s.slug);

export function findService(dict: Dictionary, slug: string | undefined) {
  return dict.services.items.find((s) => s.slug === slug);
}

/** Extract the locale from a pathname like "/fr", "/en/...", else null. */
export function localeFromPath(pathname: string): Locale | null {
  const seg = pathname.split("/").filter(Boolean)[0];
  return isLocale(seg) ? seg : null;
}

export type { Dictionary };
