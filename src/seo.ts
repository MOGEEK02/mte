import { DICT, LANGS, localePath, type Lang } from "./i18n";
import { BUSINESS, EXPERTISE, SITE_URL } from "./site";
import type { Contact } from "./contact";
import type { FaqItem } from "./content";
import { productText, type Product } from "./products";
import type { Service } from "./services";
import { coverImage, projectLangs, projectPath, projectText, splitDescription, type PortfolioItem } from "./portfolio";
import { cityPath, LOCAL_SERVICES, localDescription, localFaq, localHeading, localTitle, servicePath, type LocalPageRef } from "./local-seo";

/** What a page tells search engines. Shared by <Seo> (browser) and the pre-renderer (HTML). */
export type PageMeta = {
  lang: Lang;
  /** Path without the language prefix: "/", "/portfolio", "/portfolio/plc-programming-…". */
  path: string;
  title: string;
  description: string;
  image?: string | null;
  type?: "website" | "article";
  noindex?: boolean;
  /** Languages this page is written in (default: all). Other language URLs point to the French page. */
  available?: Lang[];
};

export const DEFAULT_IMAGE = `${SITE_URL}/images/web/og-default.png`;

export const urlFor = (lang: Lang, path: string) => SITE_URL + localePath(lang, path);

const availableFor = (m: PageMeta) => m.available ?? LANGS;

export function canonicalFor(m: PageMeta) {
  return urlFor(availableFor(m).includes(m.lang) ? m.lang : "fr", m.path);
}

const HREFLANG: Record<Lang, string[]> = { fr: ["fr-DZ", "fr"], en: ["en"], ar: ["ar-DZ", "ar"] };

/** hreflang alternates for every language the page exists in, or none for a single-language page. */
export function alternatesFor(m: PageMeta): { hreflang: string; href: string }[] {
  const langs = availableFor(m);
  if (m.noindex || langs.length < 2 || !langs.includes(m.lang)) return [];
  return [
    ...langs.flatMap((l) => HREFLANG[l].map((hreflang) => ({ hreflang, href: urlFor(l, m.path) }))),
    { hreflang: "x-default", href: urlFor("fr", m.path) },
  ];
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Head tags for a pre-rendered page (marked data-seo: the app replaces them once it runs). */
export function headHtml(m: PageMeta): string {
  const t = DICT[m.lang];
  const image = m.image || DEFAULT_IMAGE;
  const others = availableFor(m).filter((l) => l !== m.lang);
  const tags = [
    `<title data-seo>${esc(m.title)}</title>`,
    `<meta data-seo name="description" content="${esc(m.description)}">`,
    m.noindex ? `<meta data-seo name="robots" content="noindex, follow">` : `<link data-seo rel="canonical" href="${esc(canonicalFor(m))}">`,
    ...alternatesFor(m).map((a) => `<link data-seo rel="alternate" hreflang="${a.hreflang}" href="${esc(a.href)}">`),
    `<meta data-seo property="og:type" content="${m.type ?? "website"}">`,
    `<meta data-seo property="og:url" content="${esc(canonicalFor(m))}">`,
    `<meta data-seo property="og:title" content="${esc(m.title)}">`,
    `<meta data-seo property="og:description" content="${esc(m.description)}">`,
    `<meta data-seo property="og:image" content="${esc(image)}">`,
    `<meta data-seo property="og:locale" content="${t.ogLocale}">`,
    ...others.map((l) => `<meta data-seo property="og:locale:alternate" content="${DICT[l].ogLocale}">`),
    `<meta data-seo name="twitter:title" content="${esc(m.title)}">`,
    `<meta data-seo name="twitter:description" content="${esc(m.description)}">`,
    `<meta data-seo name="twitter:image" content="${esc(image)}">`,
  ];
  return tags.join("\n  ");
}

/** Short plain-text summary for meta descriptions. */
export function summarize(text: string, max = 158) {
  const flat = splitDescription(text)
    .body.replace(/\p{Extended_Pictographic}|️|[→•]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export function projectMeta(item: PortfolioItem, lang: Lang): PageMeta {
  const text = projectText(item, lang);
  const cover = coverImage(item);
  return {
    lang,
    path: projectPath(item),
    title: `${text.title} | ${DICT[lang].seo.projectSuffix}`,
    description: summarize(text.description) || text.title,
    // Imgur "h" copy (1024 px): originals are often too heavy for WhatsApp previews.
    image: cover?.replace(/l\.jpg$/, "h.jpg") ?? null,
    type: "article",
    available: projectLangs(item),
  };
}

// ---------------------------------------------------------------------------
// Structured data (schema.org JSON-LD) for search engines and AI assistants
// ---------------------------------------------------------------------------

const BUSINESS_ID = `${SITE_URL}/#business`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const COUNTRY: Record<Lang, string> = { fr: "Algérie", en: "Algeria", ar: "الجزائر" };
const HOME: Record<Lang, string> = { fr: "Accueil", en: "Home", ar: "الرئيسية" };

/** `areas`: the wilayas shown on the page (edited in /admin → Contenu). */
export function businessJsonLd(lang: Lang, contact: Contact, services: Service[], areas: string[] = DICT[lang].reach.areas) {
  const t = DICT[lang];
  const social = Object.values(contact.social).filter(Boolean);
  const phone = `+${contact.phone.replace(/\D/g, "").replace(/^0/, "213")}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "ProfessionalService"],
        "@id": BUSINESS_ID,
        name: BUSINESS.name,
        alternateName: ["MTE", "MTE Algérie", "MTE Médéa", "MTE الجزائر"],
        description: t.seo.homeDescription,
        url: urlFor(lang, "/"),
        logo: BUSINESS.logo,
        image: BUSINESS.image,
        telephone: phone,
        email: contact.email,
        foundingDate: BUSINESS.foundingDate,
        address: {
          "@type": "PostalAddress",
          streetAddress: BUSINESS.street,
          addressLocality: BUSINESS.city,
          addressRegion: BUSINESS.region,
          postalCode: BUSINESS.postalCode,
          addressCountry: BUSINESS.country,
        },
        geo: { "@type": "GeoCoordinates", latitude: BUSINESS.geo.latitude, longitude: BUSINESS.geo.longitude },
        hasMap: contact.mapUrl,
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: BUSINESS.days,
          opens: BUSINESS.opens,
          closes: BUSINESS.closes,
        },
        areaServed: [
          { "@type": "Country", name: COUNTRY[lang] },
          ...areas.map((name) => ({ "@type": "AdministrativeArea", name, containedInPlace: { "@type": "Country", name: "DZ" } })),
        ],
        knowsAbout: EXPERTISE,
        knowsLanguage: ["fr", "ar", "en"],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: phone,
          email: contact.email,
          contactType: "customer service",
          areaServed: "DZ",
          availableLanguage: ["French", "Arabic", "English"],
        },
        makesOffer: services.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: s[lang].title,
            description: s[lang].summary,
            areaServed: { "@type": "Country", name: "DZ" },
            provider: { "@id": BUSINESS_ID },
          },
        })),
        sameAs: social,
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: BUSINESS.name,
        inLanguage: LANGS.map((l) => DICT[l].locale),
        publisher: { "@id": BUSINESS_ID },
      },
    ],
  };
}

/** `items`: the questions shown on the page (edited in /admin → Contenu). */
export function faqJsonLd(lang: Lang, items: FaqItem[] = DICT[lang].faq.items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: DICT[lang].locale,
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

function breadcrumb(lang: Lang, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: urlFor(lang, it.path) })),
  };
}

export function portfolioJsonLd(lang: Lang, items: PortfolioItem[]) {
  const t = DICT[lang];
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: t.seo.workTitle,
      description: t.seo.workDescription,
      url: urlFor(lang, "/portfolio"),
      inLanguage: t.locale,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": BUSINESS_ID },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: items.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: canonicalFor(projectMeta(p, lang)),
          name: projectText(p, lang).title,
        })),
      },
    },
    breadcrumb(lang, [
      { name: HOME[lang], path: "/" },
      { name: t.work.eyebrow, path: "/portfolio" },
    ]),
  ];
}

export function projectJsonLd(lang: Lang, item: PortfolioItem) {
  const t = DICT[lang];
  const text = projectText(item, lang);
  const meta = projectMeta(item, lang);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: text.title,
      description: meta.description,
      image: meta.image ?? DEFAULT_IMAGE,
      datePublished: item.created_at,
      dateModified: (item as { updated_at?: string }).updated_at ?? item.created_at,
      inLanguage: text.translated ? t.locale : DICT.fr.locale,
      url: canonicalFor(meta),
      author: { "@id": BUSINESS_ID, "@type": "Organization", name: BUSINESS.name },
      publisher: { "@id": BUSINESS_ID, "@type": "Organization", name: BUSINESS.name, logo: BUSINESS.logo },
      about: splitDescription(text.description).tags.map((tag) => tag.slice(1)),
      locationCreated: { "@type": "Country", name: COUNTRY[lang] },
    },
    breadcrumb(lang, [
      { name: HOME[lang], path: "/" },
      { name: t.work.eyebrow, path: "/portfolio" },
      { name: text.title, path: projectPath(item) },
    ]),
  ];
}

// ---------------------------------------------------------------------------
// Store (/store): out of search results until it is opened in /admin with products
// ---------------------------------------------------------------------------

/** Product photos are full addresses (Supabase storage); a site path becomes one too. */
const absolute = (url: string) => (url.startsWith("/") ? `${SITE_URL}${url}` : url);

export function storeMeta(lang: Lang, open: boolean, products: Product[]): PageMeta {
  const t = DICT[lang].store;
  const photo = products.find((p) => p.image)?.image;
  return open
    ? { lang, path: "/store", title: t.seoOpenTitle, description: t.seoOpenDescription, image: photo ? absolute(photo) : null }
    : { lang, path: "/store", title: t.seoTitle, description: t.seoDescription, noindex: true };
}

const CONDITION_URL = {
  new: "https://schema.org/NewCondition",
  used: "https://schema.org/UsedCondition",
  refurbished: "https://schema.org/RefurbishedCondition",
} as const;

/** The catalogue; products with a price are described as offers from MTE. */
export function storeJsonLd(lang: Lang, products: Product[]) {
  const t = DICT[lang];
  return [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: t.store.openTitle,
      url: urlFor(lang, "/store"),
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => {
        const { name, description } = productText(p, lang);
        if (p.price_da == null) return { "@type": "ListItem", position: i + 1, name };
        return {
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name,
            ...(description ? { description: summarize(description, 300) } : {}),
            ...(p.image ? { image: absolute(p.image) } : {}),
            ...(p.brand.trim() ? { brand: { "@type": "Brand", name: p.brand.trim() } } : {}),
            ...(p.reference.trim() ? { mpn: p.reference.trim() } : {}),
            offers: {
              "@type": "Offer",
              price: p.price_da,
              priceCurrency: "DZD",
              availability: p.in_stock ? "https://schema.org/InStock" : "https://schema.org/BackOrder",
              itemCondition: CONDITION_URL[p.condition] ?? CONDITION_URL.new,
              url: urlFor(lang, "/store"),
              seller: { "@id": BUSINESS_ID },
            },
          },
        };
      }),
    },
    breadcrumb(lang, [
      { name: HOME[lang], path: "/" },
      { name: t.store.eyebrow, path: "/store" },
    ]),
  ];
}

// ---------------------------------------------------------------------------
// Local pages: "Programmation automate à Blida", "Automatisme industriel à Alger"…
// ---------------------------------------------------------------------------

export function localMeta(lang: Lang, page: LocalPageRef, image?: string | null): PageMeta {
  return { lang, path: page.path, title: localTitle(page, lang), description: localDescription(page, lang), image: image ?? null };
}

export function localJsonLd(lang: Lang, page: LocalPageRef) {
  const { city, service } = page;
  const url = urlFor(lang, page.path);
  const place = {
    "@type": "City",
    name: city.name[lang],
    geo: { "@type": "GeoCoordinates", latitude: city.geo.latitude, longitude: city.geo.longitude },
    containedInPlace: { "@type": "AdministrativeArea", name: `Wilaya ${city.wilaya} – ${city.name.fr}`, containedInPlace: { "@type": "Country", name: "DZ" } },
  };
  const main = service
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${url}#service`,
        name: localHeading(page, lang),
        serviceType: service.keyword[lang],
        description: localDescription(page, lang),
        url,
        inLanguage: DICT[lang].locale,
        provider: { "@id": BUSINESS_ID },
        areaServed: place,
        availableChannel: { "@type": "ServiceChannel", serviceUrl: url, servicePhone: { "@id": BUSINESS_ID } },
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: localTitle(page, lang),
        description: localDescription(page, lang),
        url,
        inLanguage: DICT[lang].locale,
        about: { "@id": BUSINESS_ID },
        spatialCoverage: place,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: LOCAL_SERVICES.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${s.keyword[lang]} ${city.inCity[lang]}`,
            url: urlFor(lang, servicePath(s, city)),
          })),
        },
      };
  return [
    main,
    faqJsonLd(lang, localFaq(page, lang)),
    breadcrumb(lang, [
      { name: HOME[lang], path: "/" },
      { name: city.name[lang], path: cityPath(city) },
      ...(service ? [{ name: service.keyword[lang], path: page.path }] : []),
    ]),
  ];
}
