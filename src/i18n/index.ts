import fr, { type Dictionary } from "./fr";
import en from "./en";

export type Locale = "fr" | "en";

export const LOCALES: Locale[] = ["fr", "en"];
export const DEFAULT_LOCALE: Locale = "fr";

export const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function isLocale(value: string | undefined): value is Locale {
  return value === "fr" || value === "en";
}

/** Extract the locale from a pathname like "/fr", "/en/...", else null. */
export function localeFromPath(pathname: string): Locale | null {
  const seg = pathname.split("/").filter(Boolean)[0];
  return isLocale(seg) ? seg : null;
}

export type { Dictionary };
