import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import { Check, ChevronRight, ArrowRight } from "lucide-react";
import Header from "./Header";
import Footer from "./footer";
import CompanyLogosShowcase from "./company";
import { useLang } from "../i18n/LanguageProvider";
import { findService, isLocale } from "../i18n";
import { SITE } from "../config";
import { serviceIcon } from "./serviceIcons";
import { WhatsappIcon } from "./icons";

export default function ServiceDetail() {
  const { lang: langParam, slug } = useParams();
  const { lang, t } = useLang();

  if (!isLocale(langParam)) return <Navigate to="/fr" replace />;
  const service = findService(t, slug);
  if (!service) return <Navigate to={`/${lang}/services`} replace />;

  const Icon = serviceIcon(service.slug);
  const url = `${SITE.baseUrl}/${lang}/services/${service.slug}`;
  const related = t.services.items.filter((s) => s.slug !== service.slug).slice(0, 3);

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.overview,
    url,
    areaServed: { "@type": "Country", name: "Algeria" },
    provider: { "@type": "ProfessionalService", name: SITE.legalName, "@id": `${SITE.baseUrl}/#business` },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.nav.home, item: `${SITE.baseUrl}/${lang}` },
      { "@type": "ListItem", position: 2, name: t.nav.services, item: `${SITE.baseUrl}/${lang}/services` },
      { "@type": "ListItem", position: 3, name: service.title, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <html lang={lang} />
        <title>{`${service.title} | MTE Algérie`}</title>
        <meta name="description" content={service.intro} />
        <link rel="canonical" href={url} />
        <link rel="alternate" hrefLang="fr" href={`${SITE.baseUrl}/fr/services/${service.slug}`} />
        <link rel="alternate" hrefLang="en" href={`${SITE.baseUrl}/en/services/${service.slug}`} />
        <link rel="alternate" hrefLang="x-default" href={`${SITE.baseUrl}/fr/services/${service.slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={`${service.title} | MTE`} />
        <meta property="og:description" content={service.intro} />
        <meta property="og:image" content={`${SITE.baseUrl}/images/logo.png`} />
        <script type="application/ld+json">{JSON.stringify(serviceLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>

      <Header variant="inner" />

      {/* Hero */}
      <section className="relative bg-ink text-white pt-28 pb-16">
        <div className="hazard absolute left-0 bottom-0 h-1.5 w-full opacity-80" />
        <div className="container-mte">
          {/* breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/50">
            <Link to={`/${lang}`} className="hover:text-brand">{t.nav.home}</Link>
            <ChevronRight size={13} />
            <Link to={`/${lang}/services`} className="hover:text-brand">{t.nav.services}</Link>
            <ChevronRight size={13} />
            <span className="text-white/80">{service.title}</span>
          </nav>

          <div className="mt-6 flex items-start gap-5">
            <span className="hidden sm:flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-brand text-white">
              <Icon size={32} />
            </span>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase leading-tight tracking-tight">
                {service.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base sm:text-lg text-white/80 leading-relaxed">
                {service.intro}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-wa">
              <WhatsappIcon size={18} />
              {t.hero.ctaPrimary}
            </a>
            <Link to={`/${lang}#quote`} className="btn-ghost">
              {t.hero.ctaQuote}
            </Link>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 sm:py-20">
        <div className="container-mte grid lg:grid-cols-[1fr_320px] gap-12">
          <div>
            <p className="text-lg text-slate-700 leading-relaxed">{service.overview}</p>

            <h2 className="mt-10 text-xl font-extrabold uppercase tracking-tight text-ink">
              {t.services.coversTitle}
            </h2>
            <ul className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {service.covers.map((c) => (
                <li key={c} className="flex items-start gap-3 text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span className="text-[15px] leading-snug">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar CTA */}
          <aside className="lg:sticky lg:top-24 h-max rounded-md border border-slate-200 bg-zinc-50 p-6">
            <h3 className="text-lg font-extrabold uppercase tracking-tight text-ink">
              {t.services.ctaTitle}
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.services.ctaSubtitle}</p>
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-wa mt-5 w-full">
              <WhatsappIcon size={18} />
              {t.hero.ctaPrimary}
            </a>
            <a href={`tel:${SITE.phone}`} className="btn-outline mt-3 w-full" dir="ltr">
              {SITE.phoneDisplay}
            </a>
          </aside>
        </div>
      </section>

      <CompanyLogosShowcase />

      {/* Related services */}
      <section className="py-16 sm:py-20 bg-zinc-50">
        <div className="container-mte">
          <h2 className="text-xl font-extrabold uppercase tracking-tight text-ink">
            {t.services.relatedTitle}
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {related.map((s) => {
              const RIcon = serviceIcon(s.slug);
              return (
                <Link
                  key={s.slug}
                  to={`/${lang}/services/${s.slug}`}
                  className="group flex flex-col rounded-md border border-slate-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-brand hover:shadow-lg"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                    <RIcon size={20} />
                  </span>
                  <h3 className="mt-4 text-base font-extrabold uppercase tracking-tight text-ink leading-tight">
                    {s.title}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand group-hover:gap-3 transition-all">
                    {t.services.learnMore}
                    <ArrowRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-8">
            <Link to={`/${lang}/services`} className="btn-outline">
              {t.services.allServices}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
