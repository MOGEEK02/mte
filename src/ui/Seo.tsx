import { useSyncExternalStore } from "react";
import { Helmet } from "react-helmet-async";
import { DICT } from "../i18n";
import { alternatesFor, canonicalFor, DEFAULT_IMAGE, type PageMeta } from "../seo";

/**
 * Per-page title, description, canonical URL, language alternates and link-preview tags,
 * kept up to date while browsing. Pre-rendered pages already carry the same tags in their
 * HTML (src/seo.ts → headHtml), so nothing is rendered on the server.
 */
const noop = () => () => {};

export function Seo(meta: PageMeta) {
  // False on the server and during hydration (so the first render matches the HTML), true after.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  if (!mounted) return null;
  const image = meta.image || DEFAULT_IMAGE;
  const canonical = canonicalFor(meta);
  return (
    <Helmet htmlAttributes={{ lang: DICT[meta.lang].locale, dir: DICT[meta.lang].dir }}>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {meta.noindex ? <meta name="robots" content="noindex, follow" /> : <link rel="canonical" href={canonical} />}
      {alternatesFor(meta).map((a) => (
        <link key={a.hreflang} rel="alternate" hrefLang={a.hreflang} href={a.href} />
      ))}
      <meta property="og:type" content={meta.type ?? "website"} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={DICT[meta.lang].ogLocale} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
