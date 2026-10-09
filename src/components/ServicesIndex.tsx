import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import Header from "./Header";
import Footer from "./footer";
import ServicesOverview from "./ServicesOverview";
import QuoteForm from "./QuoteForm";
import { useLang } from "../i18n/LanguageProvider";
import { isLocale } from "../i18n";
import { SITE, OG_IMAGE } from "../config";
import { hreflangLinks } from "./seoHelpers";

export default function ServicesIndex() {
  const { lang: langParam } = useParams();
  const { lang, t, dir } = useLang();
  if (!isLocale(langParam)) return <Navigate to="/fr" replace />;

  const url = `${SITE.baseUrl}/${lang}/services`;
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: t.services.items.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.title,
      url: `${SITE.baseUrl}/${lang}/services/${s.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <html lang={lang} dir={dir} />
        <title>{t.services.indexMetaTitle}</title>
        <meta name="description" content={t.services.indexMetaDescription} />
        <link rel="canonical" href={url} />
        {hreflangLinks("/services")}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={t.services.indexMetaTitle} />
        <meta property="og:description" content={t.services.indexMetaDescription} />
        <meta property="og:image" content={OG_IMAGE} />
        <script type="application/ld+json">{JSON.stringify(itemListLd)}</script>
      </Helmet>

      <Header variant="inner" />

      <section className="relative bg-ink text-white pt-28 pb-16">
        <div className="hazard absolute left-0 bottom-0 h-1.5 w-full opacity-80" />
        <div className="container-mte">
          <span className="eyebrow !text-safety">{t.services.eyebrow}</span>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight">
            {t.services.indexTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-white/80 text-lg leading-relaxed">
            {t.services.indexIntro}
          </p>
        </div>
      </section>

      <ServicesOverview withHeading={false} />
      <QuoteForm />
      <Footer />
    </div>
  );
}
