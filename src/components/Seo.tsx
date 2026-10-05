import { Helmet } from "@dr.pogodin/react-helmet";
import { useLang } from "../i18n/LanguageProvider";
import { SITE, SAME_AS } from "../config";

/**
 * Per-language <head> for the home page: title, description, canonical,
 * reciprocal hreflang (fr ⇄ en, x-default → fr), Open Graph / Twitter,
 * and localized JSON-LD (LocalBusiness + FAQPage + WebSite).
 */
export default function Seo() {
  const { lang, t } = useLang();
  const url = `${SITE.baseUrl}/${lang}`;
  const ogLocale = lang === "fr" ? "fr_DZ" : "en_US";
  const ogImage = `${SITE.baseUrl}/images/logo.png`;

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE.baseUrl}/#business`,
    url,
    name: SITE.legalName,
    alternateName: ["MTE Algérie", "MTE Automation", "MTE Médéa"],
    description: t.meta.description,
    image: ogImage,
    logo: ogImage,
    email: SITE.email,
    telephone: SITE.phone,
    founder: { "@type": "Person", name: SITE.founder },
    foundingDate: SITE.foundingDate,
    priceRange: "$$",
    openingHours: SITE.openingHours,
    sameAs: SAME_AS,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    areaServed: { "@type": "Country", name: "Algeria" },
    availableLanguage: ["French", "English", "Arabic"],
    knowsAbout: [
      "PLC programming",
      "Siemens TIA Portal",
      "Variable frequency drive commissioning",
      "Servo drive programming",
      "HMI SCADA development",
      "Industrial electronics repair",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t.services.title,
      itemListElement: [...t.services.group1, ...t.services.group2].map(
        (s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: s.title,
            description: s.description,
          },
        })
      ),
    },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: SITE.baseUrl,
    name: SITE.legalName,
    alternateName: "MTE Algérie",
    inLanguage: lang,
    description: t.meta.description,
  };

  return (
    <Helmet>
      <html lang={lang} />
      <title>{t.meta.title}</title>
      <meta name="description" content={t.meta.description} />
      <meta name="keywords" content={t.meta.keywords} />
      <meta name="author" content={SITE.founder} />

      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="fr" href={`${SITE.baseUrl}/fr`} />
      <link rel="alternate" hrefLang="en" href={`${SITE.baseUrl}/en`} />
      <link rel="alternate" hrefLang="x-default" href={`${SITE.baseUrl}/fr`} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={t.meta.ogTitle} />
      <meta property="og:description" content={t.meta.ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:site_name" content={SITE.legalName} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t.meta.ogTitle} />
      <meta name="twitter:description" content={t.meta.ogDescription} />
      <meta name="twitter:image" content={ogImage} />

      <script type="application/ld+json">{JSON.stringify(localBusiness)}</script>
      <script type="application/ld+json">{JSON.stringify(faqPage)}</script>
      <script type="application/ld+json">{JSON.stringify(website)}</script>
    </Helmet>
  );
}
