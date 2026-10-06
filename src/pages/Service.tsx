import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { findService, SERVICE_PAGES, type Service as ServiceData } from "../services";
import { CONTACT, SITE_URL, whatsappUrl } from "../site";
import { coverImage, fetchPortfolio, formatDate, type PortfolioItem } from "../portfolio";
import { BrandIcon } from "../ui/BrandIcon";
import { QuoteForm } from "../ui/QuoteForm";
import { ServiceArt } from "../ui/ServiceArt";
import { Seo } from "../ui/Seo";
import NotFound from "./NotFound";

function relatedProjects(items: PortfolioItem[], service: ServiceData) {
  const score = (p: PortfolioItem) => {
    const text = `${p.title} ${p.description}`.toLowerCase();
    return service.keywords.filter((k) => text.includes(k)).length;
  };
  return items
    .map((p) => ({ p, s: score(p) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)
    .map((x) => x.p);
}

function RelatedWork({ service }: { service: ServiceData }) {
  const [items, setItems] = useState<PortfolioItem[] | null>(null);
  useEffect(() => {
    fetchPortfolio().then((all) => setItems(relatedProjects(all, service)));
  }, [service]);
  if (!items || items.length === 0) return null;

  return (
    <section className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-navy-700">Réalisations</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">Exemples d’interventions</h2>
          </div>
          <Link to="/portfolio" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-navy-700">
            Toutes les réalisations
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {items.map((item) => {
            const cover = coverImage(item);
            return (
              <li key={item.id}>
                <Link
                  to={`/portfolio/${item.id}`}
                  className="group block h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition hover:shadow-md"
                >
                  <div className="aspect-video overflow-hidden bg-slate-200">
                    {cover && (
                      <img
                        src={cover}
                        alt={item.title}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-slate-500">{formatDate(item.created_at)}</p>
                    <h3 className="mt-1.5 line-clamp-2 font-semibold text-navy-900 group-hover:text-navy-700">{item.title}</h3>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default function Service() {
  const { slug = "" } = useParams();
  const service = findService(slug);
  if (!service) return <NotFound />;
  const others = SERVICE_PAGES.filter((s) => s.slug !== service.slug);

  return (
    <>
      <Seo
        title={service.seoTitle}
        description={service.seoDescription}
        path={`/services/${service.slug}`}
        image={`${SITE_URL}/images/web/og-${service.slug}.png`}
      />

      {/* Hero */}
      <section className="bg-grid bg-navy-950 pt-28 pb-14 sm:pt-32 lg:pb-20">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <nav aria-label="Fil d’Ariane" className="flex flex-wrap items-center gap-1 text-sm text-slate-400">
              <Link to="/" className="hover:text-white">Accueil</Link>
              <ChevronRight className="size-3.5" />
              <Link to="/services" className="hover:text-white">Services</Link>
              <ChevronRight className="size-3.5" />
              <span className="text-slate-200" aria-current="page">{service.title}</span>
            </nav>
            <h1 className="mt-5 text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl">{service.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-300">{service.summary}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#devis" className="btn-primary px-6">
                Demander un devis
                <ArrowRight className="size-4" />
              </a>
              <a
                href={whatsappUrl(`Bonjour MTE, j’ai une question sur : ${service.title}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-light px-6"
              >
                <BrandIcon name="WhatsApp" className="size-4" />
                {CONTACT.phoneDisplay}
              </a>
            </div>
          </div>
          <ServiceArt kind={service.art} className="aspect-[5/3] w-full rounded-xl ring-1 ring-white/10" />
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div className="space-y-10">
            <div className="space-y-4 text-lg leading-relaxed text-slate-700">
              {service.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {service.sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-2xl font-bold tracking-tight text-navy-900">{s.title}</h2>
                <div className="mt-3 space-y-3 leading-relaxed text-slate-600">
                  {s.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-7">
              <h2 className="eyebrow text-navy-700">{service.specialtiesTitle}</h2>
              <ul className="mt-5 space-y-3.5">
                {service.specialties.map((s) => (
                  <li key={s} className="flex gap-3 text-[15px] leading-snug text-slate-800">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-navy-950">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
              <a href="#devis" className="btn mt-7 w-full bg-navy-900 text-white hover:bg-navy-800">
                Parler de votre projet
              </a>
            </div>
          </aside>
        </div>
      </section>

      <RelatedWork service={service} />

      {/* Quote */}
      <section id="devis" className="py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
          <div>
            <p className="eyebrow text-navy-700">Devis</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-900">Parlons de votre besoin</h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Décrivez votre machine, la panne ou le projet. Nous revenons vers vous rapidement avec des questions ou une
              proposition chiffrée.
            </p>
            <h3 className="eyebrow mt-10 text-navy-700">Nos autres services</h3>
            <ul className="mt-4 space-y-2">
              {others.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/services/${s.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3 font-medium text-navy-900 hover:border-navy-900"
                  >
                    {s.title}
                    <ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-navy-900" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <QuoteForm key={service.slug} service={service.title} defaultType={service.requestType} />
        </div>
      </section>
    </>
  );
}
