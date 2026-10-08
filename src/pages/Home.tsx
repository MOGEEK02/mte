import { Link } from "react-router-dom";
import { ArrowRight, Check, CircuitBoard, Clock, Cpu, Factory, Mail, MapPin, Phone, Plus, Quote, Star, Zap } from "lucide-react";
import { BRANDS, BUSINESS } from "../site";
import { hoursFor, telHref, useContact, whatsappLink } from "../contact";
import { useHeroImage, useSiteTexts } from "../content";
import { formatDate, portfolioStore, projectPath, projectText } from "../portfolio";
import { useServices } from "../services";
import { testimonialsStore } from "../testimonials";
import { DICT, localePath, useLang, useT } from "../i18n";
import { BrandIcon } from "../ui/BrandIcon";
import { CardMedia } from "../ui/CardMedia";
import { QuoteForm } from "../ui/QuoteForm";
import { Seo } from "../ui/Seo";
import { CITIES, cityPath } from "../local-seo";

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
  const { nav } = useT();
  const t = useSiteTexts().hero;
  const photo = useHeroImage();
  const contact = useContact();
  return (
    <section className="relative isolate overflow-hidden bg-navy-950">
      {/* Photo chosen in /admin → Contenu, darkened so the title stays readable. */}
      <img
        src={photo.url}
        alt=""
        width={1920}
        height={768}
        fetchPriority="high"
        className="absolute inset-0 -z-10 size-full object-cover"
        style={{ objectPosition: photo.position, opacity: photo.brightness / 100 }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/30 rtl:bg-gradient-to-l" />
      <div className="container-page pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-44 lg:pb-32">
        <div className="max-w-2xl">
          <p className="eyebrow text-brand">{t.eyebrow}</p>
          <h1 className="mt-4 text-4xl leading-[1.1] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">{t.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-300">{t.text}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to={localePath(lang, "/#contact")} className="btn-primary px-6">
              {nav.quote}
              <ArrowRight className="size-4 rtl:-scale-x-100" />
            </Link>
            <a href={whatsappLink(contact)} target="_blank" rel="noopener noreferrer" className="btn-outline-light px-6">
              <BrandIcon name="WhatsApp" className="size-4" />
              <span dir="ltr">{contact.whatsapp}</span>
            </a>
          </div>
          <ul className="mt-10 grid gap-3 text-sm text-slate-300 sm:grid-cols-3 sm:gap-6">
            {t.checks.map((c, i) => (
              <li key={i} className="flex items-center gap-2">
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
  const lang = useLang();
  const t = useT().reach;
  const { sectors, areas } = useSiteTexts();
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
              {sectors.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
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
              {areas.map((a, i) => {
                const city = CITIES.find((c) => [c.name.fr, c.name.en, c.name.ar].includes(a.trim()));
                return city ? (
                  <li key={i}>
                    <Link
                      to={localePath(lang, cityPath(city))}
                      className="block rounded-full border border-navy-700/30 bg-white px-3 py-1 text-sm font-medium text-navy-800 hover:border-navy-700 hover:text-navy-900"
                    >
                      {a}
                    </Link>
                  </li>
                ) : (
                  <li key={i} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
                    {a}
                  </li>
                );
              })}
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

/** Icons of the four fields shown in the About card, in the order of the texts. */
const FACT_ICONS = [Cpu, CircuitBoard, Zap, MapPin];

/** MTE and its engineers: what the team brings together, a few facts, the story. */
function About() {
  const lang = useLang();
  const { about: t, nav } = useT();
  const texts = useSiteTexts().about;
  const projects = portfolioStore.use();
  const stats = [
    { value: BUSINESS.foundingDate, label: t.stats.founded },
    { value: t.stats.diagnosisValue, unit: t.stats.diagnosisUnit, label: t.stats.diagnosis },
    ...(projects?.length ? [{ value: String(projects.length), label: t.stats.projects }] : []),
  ];
  return (
    <section id="a-propos" className="bg-slate-50 py-20 sm:py-24">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div
          className="order-last rounded-xl bg-navy-950 p-7 shadow-lg sm:p-9 lg:order-first"
          style={{
            backgroundImage:
              "linear-gradient(rgb(255 255 255 / 0.04) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >
          <p className="eyebrow text-brand">{t.cardEyebrow}</p>
          <ul className="mt-7 grid gap-6 sm:grid-cols-2">
            {t.facts.map((f, i) => {
              const Icon = FACT_ICONS[i] ?? Cpu;
              return (
                <li key={f.title}>
                  <span className="flex size-11 items-center justify-center rounded-lg bg-brand/15 text-brand">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-white">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{f.text}</p>
                </li>
              );
            })}
          </ul>
          <dl className="mt-9 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-xs text-slate-400">{s.label}</dt>
                <dd className="font-display text-xl font-semibold whitespace-nowrap text-white sm:text-3xl">
                  {/* Numbers stay left to right, also in Arabic ("24–48", not "48–24"). */}
                  <span dir="ltr">{s.value}</span>
                  {"unit" in s && s.unit && <span className="ms-1 text-sm font-medium text-slate-300 sm:text-base">{s.unit}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <SectionTitle eyebrow={t.eyebrow} title={texts.title} />
          <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600">
            {texts.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={localePath(lang, "/portfolio")} className="btn bg-navy-900 text-white hover:bg-navy-800">
              {t.work}
              <ArrowRight className="size-4 rtl:-scale-x-100" />
            </Link>
            <Link to={localePath(lang, "/#contact")} className="btn-outline">
              {nav.quote}
            </Link>
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
  // Projects chosen in /admin ("À la une"), or the three newest when none is chosen.
  const featured = all?.filter((p) => p.featured) ?? [];
  const items = all ? (featured.length ? featured : all).slice(0, 3) : null;
  if (items && items.length === 0) return null;

  return (
    <section className="py-20 sm:py-24">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle eyebrow={t.eyebrow} title={t.title} />
          <Link to={localePath(lang, "/portfolio")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-navy-700">
            {t.all}
            <ArrowRight className="size-4 rtl:-scale-x-100" />
          </Link>
        </div>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {(items ?? [null, null, null]).map((item, i) => {
            if (!item) {
              // Same box as a loaded card, so the page doesn't shift when projects arrive.
              return (
                <li key={i} aria-hidden="true" className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="aspect-[3/4] animate-pulse bg-slate-200" />
                  <div className="p-5">
                    <div className="h-4 w-24 rounded bg-slate-100" />
                    <div className="mt-1.5 h-12 rounded bg-slate-100" />
                  </div>
                </li>
              );
            }
            const { title, translated } = projectText(item, lang);
            return (
              <li key={item.id}>
                <Link
                  to={localePath(lang, projectPath(item))}
                  className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition hover:shadow-md"
                >
                  <CardMedia item={item} alt={title} />
                  <div className="p-5">
                    <p className="text-xs text-slate-500">{formatDate(item.created_at, lang)}</p>
                    <h3 className="mt-1.5 line-clamp-2 font-semibold text-navy-900 group-hover:text-navy-700" dir={translated ? undefined : "auto"}>
                      {title}
                    </h3>
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

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <p role="img" aria-label={label} className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`size-4 ${n <= rating ? "text-brand" : "text-slate-200"}`} fill="currentColor" />
      ))}
    </p>
  );
}

/** Customer reviews from /admin → Avis clients, each in the language it was written in. Hidden when there are none. */
function Reviews() {
  const t = useT().reviews;
  const items = testimonialsStore.use();
  if (items.length === 0) return null;
  return (
    <section id="avis" className="bg-slate-50 py-20 sm:py-24">
      <div className="container-page">
        <SectionTitle eyebrow={t.eyebrow} title={t.title} />
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((r) => {
            const lang = DICT[r.lang] ? r.lang : "fr";
            const who = [r.company, r.city].map((s) => s.trim()).filter(Boolean).join(" · ");
            return (
              <li key={r.id}>
                <figure className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                  <div className="flex items-start justify-between gap-4">
                    <Quote className="size-7 text-brand rtl:-scale-x-100" fill="currentColor" />
                    {r.rating ? <Stars rating={r.rating} label={t.stars(r.rating)} /> : null}
                  </div>
                  <blockquote lang={lang} dir={DICT[lang].dir} className="mt-4 flex-1 leading-relaxed whitespace-pre-line text-slate-700">
                    {r.quote}
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                    <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-semibold text-brand">
                      {r.name.trim().charAt(0).toUpperCase()}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-navy-900" dir="auto">{r.name}</span>
                      {who && <span className="block text-xs text-slate-500" dir="auto">{who}</span>}
                    </span>
                  </figcaption>
                </figure>
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
  const { faq } = useSiteTexts();
  return (
    <section id="faq" className="border-t border-slate-200 py-20 sm:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <SectionTitle eyebrow={t.eyebrow} title={t.title} text={t.text} />
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {faq.map((f, i) => (
            <details key={i} className="group py-5">
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
    { icon: <BrandIcon name="WhatsApp" className="size-5" />, label: t.whatsapp, value: contact.whatsapp, href: whatsappLink(contact), external: true, ltr: true },
    { icon: <Phone className="size-5" />, label: t.phone, value: contact.phone, href: telHref(contact.phone), ltr: true },
    { icon: <Mail className="size-5" />, label: t.email, value: contact.email, href: `mailto:${contact.email}`, ltr: true },
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
                    <span className="block font-medium break-all text-navy-900" dir={r.ltr ? "ltr" : undefined}>
                      {r.value}
                    </span>
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
      <Reviews />
      <Faq />
      <Contact />
    </>
  );
}
