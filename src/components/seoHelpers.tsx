import { LOCALES, DEFAULT_LOCALE } from "../i18n";
import { SITE } from "../config";

/**
 * Reciprocal hreflang <link> tags for all locales, for a given path suffix.
 * e.g. hreflangLinks("")            → /fr, /en, /ar (+ x-default → /fr)
 *      hreflangLinks("/services")   → /fr/services, ...
 * Spread the result inside a <Helmet>.
 */
export function hreflangLinks(suffix: string) {
  const links = LOCALES.map((l) => (
    <link
      key={l}
      rel="alternate"
      hrefLang={l}
      href={`${SITE.baseUrl}/${l}${suffix}`}
    />
  ));
  links.push(
    <link
      key="x-default"
      rel="alternate"
      hrefLang="x-default"
      href={`${SITE.baseUrl}/${DEFAULT_LOCALE}${suffix}`}
    />
  );
  return links;
}
