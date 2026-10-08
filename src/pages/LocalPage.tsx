import { Link } from "react-router-dom";
import { ArrowRight, Check, ChevronRight, Factory, MapPin, Phone, Plus } from "lucide-react";
import { telHref, useContact, whatsappLink } from "../contact";
import { localePath, useLang, type Lang } from "../i18n";
import { formatDate, portfolioStore, projectPath, projectText } from "../portfolio";
import { useServices } from "../services";
import {
  CITIES,
  cityPath,
  LOCAL_SERVICES,
  localDescription,
  localFaq,
  localHeading,
  localTitle,
  mentionsCity,
  servicePath,
  type LocalPageRef,
} from "../local-seo";
import { BrandIcon } from "../ui/BrandIcon";
import { CardMedia } from "../ui/CardMedia";
import { QuoteForm } from "../ui/QuoteForm";
import { Seo } from "../ui/Seo";

type L<T = string> = Record<Lang, T>;

const UI = {
  home: { fr: "Accueil", en: "Home", ar: "الرئيسية" },
  eyebrow: { fr: "Intervention sur site et en atelier", en: "On-site and workshop service", ar: "تدخل في الموقع وفي الورشة" },
  quote: { fr: "Demander un devis gratuit", en: "Get a free quote", ar: "اطلب عرض سعر مجاني" },
  call: { fr: "Appeler", en: "Call", ar: "اتصل" },
  whatWeDo: { fr: "Ce que nous faisons {in}", en: "What we do {in}", ar: "ما نقوم به {in}" },
  servicesIn: { fr: "Nos services {in}", en: "Our services {in}", ar: "خدماتنا {in}" },
  where: { fr: "Où nous intervenons dans la wilaya de {name}", en: "Where we work in the wilaya of {name}", ar: "أين نتدخل في ولاية {name}" },
  travel: { fr: "À {time} de notre atelier de Médéa ({km} km).", en: "{time} from our workshop in Médéa ({km} km).", ar: "على بعد {time} من ورشتنا في المدية ({km} كلم)." },
  workshopHere: { fr: "Notre atelier est ici, à Ain Dhab.", en: "Our workshop is here, in Ain Dhab.", ar: "ورشتنا هنا، في عين الذهب." },
  sectors: { fr: "Secteurs que nous servons {in}", en: "Industries we serve {in}", ar: "القطاعات التي نخدمها {in}" },
  how: { fr: "Comment ça se passe", en: "How it works", ar: "كيف يتم العمل" },
  steps: {
    fr: ["Vous décrivez la panne ou le projet par téléphone, WhatsApp ou avec le formulaire.", "Nous faisons le diagnostic et vous envoyons un devis gratuit avant toute intervention.", "Nous intervenons sur site {in} ou réparons en atelier, avec des essais avant la remise en service."],
    en: ["You describe the fault or the project by phone, WhatsApp or with the form.", "We diagnose and send you a free quote before any work.", "We come on site {in} or repair in the workshop, with tests before handing back."],
    ar: ["تصفون العطل أو المشروع عبر الهاتف أو واتساب أو بالاستمارة.", "نقوم بالتشخيص ونرسل لكم عرض سعر مجاني قبل أي تدخل.", "نتدخل في الموقع {in} أو نصلح في الورشة، مع اختبارات قبل إعادة التشغيل."],
  },
  projectsLocal: { fr: "Nos réalisations {in}", en: "Our work {in}", ar: "إنجازاتنا {in}" },
  projectsLatest: { fr: "Nos dernières réalisations", en: "Our latest work", ar: "آخر إنجازاتنا" },
  allProjects: { fr: "Toutes les réalisations", en: "All our work", ar: "كل الإنجازات" },
  faq: { fr: "Questions fréquentes", en: "Frequently asked questions", ar: "أسئلة شائعة" },
  otherServices: { fr: "Nos autres services {in}", en: "Our other services {in}", ar: "خدماتنا الأخرى {in}" },
  otherCities: { fr: "{keyword} dans d’autres wilayas", en: "{keyword} in other wilayas", ar: "{keyword} في ولايات أخرى" },
  otherCitiesHub: { fr: "Nous intervenons aussi", en: "We also work", ar: "نتدخل أيضاً" },
  everywhere: { fr: "et partout en Algérie sur demande", en: "and anywhere in Algeria on request", ar: "وفي كل أنحاء الجزائر عند الطلب" },
  contactTitle: { fr: "Parlez-nous de votre machine", en: "Tell us about your machine", ar: "حدثونا عن آلتكم" },
  contactText: {
    fr: "Réponse rapide par téléphone ou WhatsApp, devis gratuit avant intervention {in}.",
    en: "Quick answer by phone or WhatsApp, free quote before any work {in}.",
    ar: "رد سريع عبر الهاتف أو واتساب، وعرض سعر مجاني قبل أي تدخل {in}.",
  },
  waHello: { fr: "Bonjour, j’ai besoin de : {what} {in}.", en: "Hello, I need: {what} {in}.", ar: "السلام عليكم، أحتاج إلى: {what} {in}." },
} satisfies Record<string, L | L<string[]>>;

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ""));

function Title({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return <h2 className={`text-2xl font-bold tracking-tight sm:text-3xl ${light ? "text-white" : "text-navy-900"}`}>{children}</h2>;
}

export default function LocalPage({ page }: { page: LocalPageRef }) {
  const lang = useLang();
  const contact = useContact();
  const services = useServices(lang);
  const all = portfolioStore.use();
  const { city, service } = page;
  const inCity = city.inCity[lang];
  const to = (path: string) => localePath(lang, path);
  const card = service ? services.find((s) => s.slug === service.key) : null;
  const what = service ? service.keyword[lang] : localHeading(page, lang);
  const waText = fill(UI.waHello[lang], { what, in: inCity });
  const local = all?.filter((p) => mentionsCity(`${p.title} ${p.description ?? ""} ${projectText(p, lang).title}`, city)) ?? [];
  const projects = all ? (local.length ? local : all).slice(0, 3) : null;
  const faq = localFaq(page, lang);

  return (
    <>
      <Seo lang={lang} path={page.path} title={localTitle(page, lang)} description={localDescription(page, lang)} image={card?.image ? `https://moutie.vercel.app${card.image}` : null} />

      {/* Hero */}
      <section className="bg-navy-950 pt-32 pb-14 sm:pt-36 sm:pb-16">
        <div className="container-page">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link to={to("/")} className="hover:text-white">
                  {UI.home[lang]}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5 rtl:-scale-x-100" />
              </li>
              <li>{service ? <Link to={to(cityPath(city))} className="hover:text-white">{city.name[lang]}</Link> : <span className="text-slate-200">{city.name[lang]}</span>}</li>
              {service && (
                <>
                  <li aria-hidden="true">
                    <ChevronRight className="size-3.5 rtl:-scale-x-100" />
                  </li>
                  <li className="text-slate-200">{service.keyword[lang]}</li>
                </>
              )}
            </ol>
          </nav>
          <p className="eyebrow mt-6 text-brand">{UI.eyebrow[lang]}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">{localHeading(page, lang)}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">{localDescription(page, lang)}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#devis" className="btn-primary">
              {UI.quote[lang]}
            </a>
            <a href={whatsappLink(contact, waText)} target="_blank" rel="noopener noreferrer" className="btn-outline-light inline-flex items-center gap-2">
              <BrandIcon name="WhatsApp" className="size-4" />
              WhatsApp
            </a>
            <a href={telHref(contact.phone)} className="btn-outline-light inline-flex items-center gap-2">
              <Phone className="size-4" />
              {UI.call[lang]} <span dir="ltr">{contact.phone}</span>
            </a>
          </div>
        </div>
      </section>

      {/* What we do here */}
      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <div>
            <Title>{fill((service ? UI.whatWeDo : UI.servicesIn)[lang], { in: inCity })}</Title>
            <p className="mt-4 leading-relaxed text-slate-600">{city.intro[lang]}</p>
            {service ? (
              <ul className="mt-8 grid gap-3">
                {service.bullets[lang].map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <Check className="mt-0.5 size-5 shrink-0 text-brand-600" />
                    {b}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {LOCAL_SERVICES.map((s) => {
                  const c = services.find((x) => x.slug === s.key);
                  return (
                    <li key={s.slug}>
                      <Link
                        to={to(servicePath(s, city))}
                        className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md"
                      >
                        <span className="font-semibold text-navy-900 group-hover:text-navy-700">
                          {s.keyword[lang]} {inCity}
                        </span>
                        {c?.summary && <span className="mt-2 line-clamp-3 text-sm text-slate-600">{c.summary}</span>}
                        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-navy-900">
                          <ArrowRight className="size-4 rtl:-scale-x-100" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {card?.image && (
            <img src={card.image} alt={`${service?.keyword[lang]} ${inCity}`} loading="lazy" className="aspect-[4/3] w-full rounded-xl object-cover shadow-sm" />
          )}
        </div>
      </section>

      {/* Where and for whom */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-navy-900">
              <MapPin className="size-5 text-brand-600" />
              {fill(UI.where[lang], { name: city.name[lang] })}
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              {city.travel ? fill(UI.travel[lang], { time: city.travel.time[lang], km: city.travel.km }) : UI.workshopHere[lang]}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {city.places[lang].map((p) => (
                <li key={p} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-navy-900">
              <Factory className="size-5 text-brand-600" />
              {fill(UI.sectors[lang], { in: inCity })}
            </h2>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {city.sectors[lang].map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-slate-700">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand-600" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-navy-900 py-16 sm:py-20">
        <div className="container-page">
          <Title light>{UI.how[lang]}</Title>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {UI.steps[lang].map((s, i) => (
              <li key={i} className="rounded-xl border border-white/10 bg-white/5 p-6 text-slate-200">
                <span className="text-3xl font-bold text-brand">{i + 1}</span>
                <p className="mt-3 text-sm leading-relaxed">{fill(s, { in: inCity })}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <Title>{local.length ? fill(UI.projectsLocal[lang], { in: inCity }) : UI.projectsLatest[lang]}</Title>
              <Link to={to("/portfolio")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-navy-700">
                {UI.allProjects[lang]}
                <ArrowRight className="size-4 rtl:-scale-x-100" />
              </Link>
            </div>
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {projects.map((item) => {
                const { title, translated } = projectText(item, lang);
                return (
                  <li key={item.id}>
                    <Link to={to(projectPath(item))} className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition hover:shadow-md">
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
      )}

      {/* FAQ */}
      <section className="border-t border-slate-200 py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <Title>{UI.faq[lang]}</Title>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {faq.map((f, i) => (
              <details key={i} className="group py-5" open={i === 0}>
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

      {/* Related pages: same city, other cities */}
      <section className="bg-slate-50 py-14">
        <div className="container-page grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-semibold text-navy-900">{fill(UI.otherServices[lang], { in: inCity })}</h2>
            <ul className="mt-4 grid gap-2 text-sm">
              {LOCAL_SERVICES.filter((s) => s !== service).map((s) => (
                <li key={s.slug}>
                  <Link to={to(servicePath(s, city))} className="text-navy-800 underline-offset-4 hover:underline">
                    {s.keyword[lang]} {inCity}
                  </Link>
                </li>
              ))}
              {service && (
                <li>
                  <Link to={to(cityPath(city))} className="font-medium text-navy-800 underline-offset-4 hover:underline">
                    {localHeading({ ...page, service: null }, lang)}
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-navy-900">{service ? fill(UI.otherCities[lang], { keyword: service.keyword[lang] }) : UI.otherCitiesHub[lang]}</h2>
            <ul className="mt-4 grid gap-2 text-sm">
              {CITIES.filter((c) => c !== city).map((c) => (
                <li key={c.slug}>
                  <Link to={to(service ? servicePath(service, c) : cityPath(c))} className="text-navy-800 underline-offset-4 hover:underline">
                    {service ? `${service.keyword[lang]} ${c.inCity[lang]}` : localHeading({ city: c, service: null, path: cityPath(c) }, lang)}
                  </Link>
                </li>
              ))}
              <li>
                <Link to={to("/#zones")} className="text-slate-600 underline-offset-4 hover:underline">
                  … {UI.everywhere[lang]}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section id="devis" className="py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Title>{UI.contactTitle[lang]}</Title>
            <p className="mt-4 text-slate-600">{fill(UI.contactText[lang], { in: inCity })}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={whatsappLink(contact, waText)} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                <BrandIcon name="WhatsApp" className="size-4" />
                WhatsApp
              </a>
              <a href={telHref(contact.phone)} className="btn-outline inline-flex items-center gap-2">
                <Phone className="size-4" />
                <span dir="ltr">{contact.phone}</span>
              </a>
            </div>
          </div>
          <QuoteForm context={`${what} – ${city.name.fr}`} />
        </div>
      </section>
    </>
  );
}
