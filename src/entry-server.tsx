/* eslint-disable react-refresh/only-export-components -- build-time server entry, never hot-reloaded */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { AppRoutes } from "./App";
import { DICT, LANGS, type Lang } from "./i18n";
import { contactStore, cvStore, DEFAULT_CONTACT, fetchContact, fetchCv, type Contact, type CvLinks } from "./contact";
import { buildInfo, contentStore, fetchContent, siteTexts, storeOpen, type SiteContent } from "./content";
import { fetchProducts, formatPrice, productsStore, productText, type Product } from "./products";
import { fetchTestimonials, testimonialsStore, type Testimonial } from "./testimonials";
import { DEFAULT_SERVICES, fetchServices, servicesStore, type Service } from "./services";
import { fetchPortfolio, portfolioStore, projectPath, projectText, type PortfolioItem } from "./portfolio";
import {
  businessJsonLd,
  faqJsonLd,
  headHtml,
  portfolioJsonLd,
  projectJsonLd,
  projectMeta,
  storeJsonLd,
  storeMeta,
  summarize,
  urlFor,
  type PageMeta,
} from "./seo";
import { BUSINESS, SITE_URL } from "./site";
import { localDescription, localPages, localTitle } from "./local-seo";
import { localJsonLd, localMeta } from "./seo";

/**
 * Server entry used by scripts/prerender.mjs at build time: renders each public page to HTML
 * with its data, head tags and structured data, so search engines and AI assistants read the
 * full content without running JavaScript.
 */

export type SiteData = {
  services: Service[];
  contact: Contact;
  cv: CvLinks;
  portfolio: PortfolioItem[];
  content: SiteContent;
  testimonials: Testimonial[];
  products: Product[];
  /** When these pages were generated (shown in /admin, and used for dated content such as the banner). */
  builtAt: string;
};

export async function loadData(): Promise<SiteData> {
  const [services, contact, cv, portfolio, content, testimonials, products] = await Promise.all([
    fetchServices(),
    fetchContact(),
    fetchCv(),
    fetchPortfolio(),
    fetchContent(),
    fetchTestimonials(),
    fetchProducts(),
  ]);
  return {
    services: services ?? DEFAULT_SERVICES,
    contact: contact ?? DEFAULT_CONTACT,
    cv: cv ?? { fr: "", en: "" },
    portfolio,
    content: content ?? {},
    testimonials,
    products,
    builtAt: new Date().toISOString(),
  };
}

const isStoreOpen = (data: SiteData) => storeOpen(data.content) && data.products.length > 0;

export type Page = { url: string; lang: Lang; meta: PageMeta; jsonLd: object[] };

/** Every public page, in every language. */
export function pages(data: SiteData): Page[] {
  const out: Page[] = [];
  for (const lang of LANGS) {
    const t = DICT[lang];
    const prefix = lang === "fr" ? "" : `/${lang}`;
    const texts = siteTexts(lang, data.content);
    const business = businessJsonLd(lang, data.contact, data.services, texts.areas);
    out.push({
      url: prefix || "/",
      lang,
      meta: { lang, path: "/", title: t.seo.homeTitle, description: t.seo.homeDescription },
      jsonLd: [business, faqJsonLd(lang, texts.faq)],
    });
    out.push({
      url: `${prefix}/portfolio`,
      lang,
      meta: { lang, path: "/portfolio", title: t.seo.workTitle, description: t.seo.workDescription },
      jsonLd: [business, ...portfolioJsonLd(lang, data.portfolio)],
    });
    // Store: out of search results while it is "coming soon".
    const open = isStoreOpen(data);
    out.push({ url: `${prefix}/store`, lang, meta: storeMeta(lang, open, data.products), jsonLd: open ? [business, ...storeJsonLd(lang, data.products)] : [] });
    for (const item of data.portfolio) {
      out.push({ url: `${prefix}${projectPath(item)}`, lang, meta: projectMeta(item, lang), jsonLd: [business, ...projectJsonLd(lang, item)] });
    }
    // Local pages: one per service and city.
    for (const p of localPages()) {
      const image = p.service ? data.services.find((s) => s.slug === p.service!.key)?.image : null;
      out.push({ url: `${prefix}${p.path}`, lang, meta: localMeta(lang, p, image ? `${SITE_URL}${image}` : null), jsonLd: [business, ...localJsonLd(lang, p)] });
    }
  }
  return out;
}

export function notFoundPage(): Page {
  const t = DICT.fr.seo;
  return { url: "/404", lang: "fr", meta: { lang: "fr", path: "/404", title: t.notFoundTitle, description: t.notFoundDescription, noindex: true }, jsonLd: [] };
}

export function render(url: string, data: SiteData) {
  servicesStore.prime(data.services);
  contactStore.prime(data.contact);
  cvStore.prime(data.cv);
  portfolioStore.prime(data.portfolio);
  contentStore.prime(data.content);
  testimonialsStore.prime(data.testimonials);
  productsStore.prime(data.products);
  buildInfo.at = data.builtAt;
  return renderToString(
    <HelmetProvider context={{}}>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </HelmetProvider>,
  );
}

export { headHtml, DICT };

export const localPaths = () => localPages().map((p) => p.path);

// ---------------------------------------------------------------------------
// llms.txt: a plain summary of the business for AI assistants (llmstxt.org)
// ---------------------------------------------------------------------------

export function llmsTxt(data: SiteData, full = false) {
  const en = DICT.en;
  const fr = DICT.fr;
  const ar = DICT.ar;
  const texts = siteTexts("en", data.content);
  const store = isStoreOpen(data)
    ? [
        "## Store (orders on WhatsApp)",
        "",
        ...data.products.map((p) => {
          const { name } = productText(p, "en");
          const price = p.price_da != null ? formatPrice(p.price_da, "en") : "price on request";
          return `- ${name}${p.brand.trim() ? ` (${p.brand.trim()})` : ""}: ${en.store.conditions[p.condition] ?? ""}, ${price}, ${p.in_stock ? "in stock" : "on order"}`;
        }),
        "",
      ]
    : [];
  const lines = [
    `# ${BUSINESS.name}`,
    "",
    `> ${en.seo.homeDescription}`,
    "",
    `MTE (${BUSINESS.name}) is an industrial automation and electronics company founded in ${BUSINESS.foundingDate} by ${BUSINESS.founder}, an automation and electronics engineer. It is based in Ain Dhab, Médéa (wilaya 26), Algeria, and works on site across Algeria. Languages: French, Arabic, English.`,
    "",
    `- Website (French): ${SITE_URL}/`,
    `- Website (English): ${SITE_URL}/en`,
    `- Website (Arabic): ${SITE_URL}/ar`,
    `- Phone / WhatsApp: ${data.contact.phone}`,
    `- Email: ${data.contact.email}`,
    `- Address: ${data.contact.address}`,
    `- Opening hours: ${data.contact.hoursEn}`,
    "",
    "## Services",
    "",
    ...data.services.map((s) => `- **${s.en.title}** (${s.fr.title}): ${s.en.summary}${s.en.tagline ? ` — ${s.en.tagline}` : ""}`),
    "",
    "## Industries and areas served",
    "",
    `- Industries: ${texts.sectors.join("; ")}.`,
    `- Wilayas: ${texts.areas.join(", ")}, and anywhere else in Algeria on request.`,
    "",
    "## Local pages (service and city)",
    "",
    ...localPages().map((p) => `- [${localTitle(p, "fr").replace(/ \| MTE$/, "")}](${urlFor("fr", p.path)}): ${localDescription(p, "fr")}`),
    "",
    "## Frequently asked questions",
    "",
    ...texts.faq.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    ...store,
    "## Projects",
    "",
    ...data.portfolio.map((p) => {
      const text = projectText(p, "en");
      const base = `- [${text.title}](${urlFor(text.translated ? "en" : "fr", projectPath(p))}) (${p.created_at.slice(0, 10)})`;
      return full ? `${base}\n\n  ${text.description.replace(/\n+/g, "\n  ")}\n` : `${base}: ${summarize(text.description, 200)}`;
    }),
    "",
    "## Optional",
    "",
    `- [Full project descriptions](${SITE_URL}/llms-full.txt)`,
    `- [Site en français](${SITE_URL}/) — ${fr.seo.homeDescription}`,
    `- [الموقع بالعربية](${SITE_URL}/ar) — ${ar.seo.homeDescription}`,
    "",
    "## بالعربية",
    "",
    `${BUSINESS.name} (MTE): ${ar.seo.homeDescription}`,
    "",
    ...data.services.map((s) => `- ${s.ar.title}: ${s.ar.summary}`),
    "",
  ];
  return lines.join("\n");
}
