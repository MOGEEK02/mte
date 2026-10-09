import fr, { type Dictionary } from "./fr";
import en from "./en";
import ar from "./ar";

export type Locale = "fr" | "en" | "ar";

export const LOCALES: Locale[] = ["fr", "en", "ar"];
export const DEFAULT_LOCALE: Locale = "fr";
export const RTL_LOCALES: Locale[] = ["ar"];

export const dictionaries: Record<Locale, Dictionary> = { fr, en, ar };

export function isLocale(value: string | undefined): value is Locale {
  return value === "fr" || value === "en" || value === "ar";
}

export function dirForLocale(locale: Locale): "rtl" | "ltr" {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}

/** Extract the locale from a pathname like "/fr", "/ar/...", else null. */
export function localeFromPath(pathname: string): Locale | null {
  const seg = pathname.split("/").filter(Boolean)[0];
  return isLocale(seg) ? seg : null;
}

/** Service slugs (shared across languages) — drives routing, prerender and lookups. */
export const SERVICE_SLUGS: string[] = fr.services.items.map((s) => s.slug);

export function findService(dict: Dictionary, slug: string | undefined) {
  return dict.services.items.find((s) => s.slug === slug);
}

export type { Dictionary };
