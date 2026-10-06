import { Link } from "react-router-dom";
import { ArrowRight, Check, Clock, Factory, FileText, Mail, MapPin, Phone, Plus } from "lucide-react";
import { BRANDS } from "../site";
import { cvStore, hoursFor, telHref, useContact, whatsappLink } from "../contact";
import { coverImage, formatDate, portfolioStore, projectText } from "../portfolio";
import { useServices } from "../services";
import { localePath, useLang, useT } from "../i18n";
import { BrandIcon } from "../ui/BrandIcon";
import { QuoteForm } from "../ui/QuoteForm";
import { Seo } from "../ui/Seo";

function SectionTitle({ eyebrow, title, text, light }: { eyebrow: string; title: string; text?: string; light?: boolean }) {
  return (
    <div className="max-w-2xl">
      <p className={`eyebrow ${light ? "text-brand" : "text-navy-700"}`}>{eyebrow}</p>
      <h2 className={`mt-2 text-3xl font-bold tracking-tight sm:text-4xl ${light ? "text-white" : "text-navy-900"}`}>{title}</h2>
      {text && <p className={`mt-4 text-base leading-relaxed ${light ? "text-slate-300" : "text-slate-600"}`}>{text}</p>}
    </div>
  );
}

function Hero() {
  const lang = useLang();
  const { hero: t, nav } = useT();
  const contact = useContact();
  return (
    <section className="relative isolate overflow-hidden bg-navy-950">
      <img
        src="/images/web/hero.webp"
        alt=""
        width={1920}
        height={768}
        fetchPriority="high"
        className="absolute inset-0 -z-10 size-full object-cover opacity-45"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/30" />
      <div className="container-page pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-44 lg:pb-32">
        <div className="max-w-2xl">
          <p className="eyebrow text-brand">{t.eyebrow}</p>
          <h1 className="mt-4 text-4xl leading-[1.1] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">{t.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-300">{t.text}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to={localePath(lang, "/#contact")} className="btn-primary px-6">
              {nav.quote}
              <ArrowRight className="size-4" />
            </Link>
            <a href={whatsappLink(contact)} target="_blank" rel="noopener noreferrer" className="btn-outline-light px-6">
              <BrandIcon name="WhatsApp" className="size-4" />
              {contact.whatsapp}
            </a>
          </div>
          <ul className="mt-10 grid gap-3 text-sm text-slate-300 sm:grid-cols-3 sm:gap-6">
            {t.checks.map((c) => (
              <li key={c} className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-brand" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Brands() {
  const t = useT().brands;
  return (
    <section aria-label={t.label} className="border-b border-slate-200 bg-white">
      <div className="container-page py-10">
        <p className="text-center text-sm text-slate-500">{t.text}</p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:justify-between">
          {BRANDS.map((b) => (
            <li key={b.name}>
              <img
                src={b.logo}
                alt={b.name}
                loading="lazy"
                className="h-6 w-auto max-w-[110px] object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0 sm:h-9 sm:max-w-[150px]"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Services() {
  const lang = useLang();
  const t = useT().services;
  const services = useServices(lang);
  return (
    <section id="services" className="bg-slate-50 py-20 sm:py-24">
      <div className="container-page">
        <SectionTitle eyebrow={t.eyebrow} title={t.title} text={t.text} />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.slug} className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition hover:shadow-md">
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                <img src={s.image} alt={s.title} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold text-navy-900">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{s.summary}</p>
                {s.tagline && <p className="mt-4 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">{s.tagline}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Where and for whom: helps local searches ("automatisme Blida", "réparation variateur Oran"…). */
function Reach() {
  const t = useT().reach;
  return (
    <section id="zones" className="py-20 sm:py-24">
      <div className="container-page">
        <SectionTitle eyebrow={t.eyebrow} title={t.title} text={t.text} />
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-navy-900">
              <Factory className="size-5 text-brand-600" />
              {t.sectorsTitle}
            </h3>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {t.sectors.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-slate-700">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand-600" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-navy-900">
              <MapPin className="size-5 text-brand-600" />
              {t.areasTitle}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {t.areas.map((a) => (
                <li key={a} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
                  {a}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-slate-500">{t.everywhere}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Method() {
  const t = useT().method;
  return (
    <section id="methode" className="bg-navy-900 py-20 sm:py-24">
      <div className="container-page">
        <SectionTitle light eyebrow={t.eyebrow} title={t.title} text={t.text} />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {t.steps.map((s, i) => (
            <li key={s.title} className="bg-navy-900 p-6 lg:p-7">
              <span className="font-display text-4xl font-semibold text-brand">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function About() {
  const lang = useLang();
  const t = useT().about;
  const cv = cvStore.use();
  return (
    <section id="a-propos" className="bg-slate-50 py-20 sm:py-24">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <img
            src="/images/web/fondateur.webp"
            alt={t.photoAlt}
            width={900}
            height={1200}
            loading="lazy"
            className="aspect-[4/5] w-full rounded-xl object-cover shadow-lg"
          />
          <div className="absolute -bottom-5 left-5 rounded-lg bg-brand px-5 py-3 shadow-md sm:-right-5 sm:left-auto">
            <p className="font-display text-2xl leading-none font-semibold text-navy-950">{t.since}</p>
            <p className="mt-1 text-xs font-medium text-navy-900">{t.sinceText}</p>
          </div>
        </div>
        <div>
          <SectionTitle eyebrow={t.eyebrow} title={t.title} />
          <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600">
            <p>
              {t.p1a}
              <strong className="font-semibold text-navy-900">Fekhar Moutie</strong>
              {t.p1b}
            </p>
            <p>{t.p2}</p>
            <p>{t.p3}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={localePath(lang, "/portfolio")} className="btn bg-navy-900 text-white hover:bg-navy-800">
              {t.work}
              <ArrowRight className="size-4" />
            </Link>
            {cv.fr && (
              <a href={cv.fr} target="_blank" rel="noopener noreferrer" className="btn-outline">
                <FileText className="size-4" />
                {t.cvFr}
              </a>
            )}
            {cv.en && (
              <a href={cv.en} target="_blank" rel="noopener noreferrer" className="btn-outline">
                <FileText className="size-4" />
                {t.cvEn}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function LatestWork() {
  const lang = useLang();
  const t = useT().latest;
  const all = portfolioStore.use();
  const items = all?.slice(0, 3) ?? null;
  if (items && items.length === 0) return null;

  return (
    <section className="py-20 sm:py-24">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle eyebrow={t.eyebrow} title={t.title} />
          <Link to={localePath(lang, "/portfolio")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-navy-700">
            {t.all}
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {(items ?? [null, null, null]).map((item, i) => {
            if (!item) {
              // Same box as a loaded card, so the page doesn't shift when projects arrive.
              return (
                <li key={i} aria-hidden="true" className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="aspect-video animate-pulse bg-slate-200" />
                  <div className="p-5">
                    <div className="h-4 w-24 rounded bg-slate-100" />
                    <div className="mt-1.5 h-12 rounded bg-slate-100" />
                  </div>
                </li>
              );
            }
            const cover = coverImage(item);
            const { title } = projectText(item, lang);
            return (
              <li key={item.id}>
                <Link
                  to={localePath(lang, `/portfolio/${item.id}`)}
                  className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition hover:shadow-md"
                >
                  <div className="aspect-video overflow-hidden bg-slate-200">
                    {cover && (
                      <img src={cover} alt={title} loading="lazy" referrerPolicy="no-referrer" className="size-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-slate-500">{formatDate(item.created_at, lang)}</p>
                    <h3 className="mt-1.5 line-clamp-2 font-semibold text-navy-900 group-hover:text-navy-700">{title}</h3>
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

function Faq() {
  const t = useT().faq;
  return (
    <section id="faq" className="border-t border-slate-200 py-20 sm:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <SectionTitle eyebrow={t.eyebrow} title={t.title} text={t.text} />
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {t.items.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy-900 [&::-webkit-details-marker]:hidden">
                <h3>{f.q}</h3>
                <Plus className="size-5 shrink-0 text-slate-400 transition group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const lang = useLang();
  const t = useT().contact;
  const contact = useContact();
  const rows = [
    { icon: <BrandIcon name="WhatsApp" className="size-5" />, label: t.whatsapp, value: contact.whatsapp, href: whatsappLink(contact), external: true },
    { icon: <Phone className="size-5" />, label: t.phone, value: contact.phone, href: telHref(contact.phone) },
    { icon: <Mail className="size-5" />, label: t.email, value: contact.email, href: `mailto:${contact.email}` },
    { icon: <MapPin className="size-5" />, label: t.address, value: contact.address, href: contact.mapUrl, external: true },
    { icon: <Clock className="size-5" />, label: t.hours, value: hoursFor(contact, lang) },
  ];
  return (
    <section id="contact" className="bg-slate-50 py-20 sm:py-24">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionTitle eyebrow={t.eyebrow} title={t.title} text={t.text} />
          <ul className="mt-8 space-y-4">
            {rows.map((r) => {
              const body = (
                <>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-brand">{r.icon}</span>
                  <span>
                    <span className="block text-xs font-medium tracking-wide text-slate-500 uppercase">{r.label}</span>
                    <span className="block font-medium break-all text-navy-900">{r.value}</span>
                  </span>
                </>
              );
              return (
                <li key={r.label}>
                  {r.href ? (
                    <a
                      href={r.href}
                      {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="flex items-center gap-4 rounded-lg p-1 transition hover:bg-white"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-1">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}

export default function Home() {
  const lang = useLang();
  const t = useT().seo;
  return (
    <>
      <Seo lang={lang} path="/" title={t.homeTitle} description={t.homeDescription} />
      <Hero />
      <Brands />
      <Services />
      <Reach />
      <Method />
      <About />
      <LatestWork />
      <Faq />
      <Contact />
    </>
  );
}
