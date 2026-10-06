import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Clock, FileText, Mail, MapPin, Phone, Plus } from "lucide-react";
import { BRANDS, FAQ, STEPS } from "../site";
import { telHref, useContact, whatsappLink } from "../contact";
import { coverImage, fetchPortfolio, formatDate, type PortfolioItem } from "../portfolio";
import { select } from "../db";
import { BrandIcon } from "../ui/BrandIcon";
import { QuoteForm } from "../ui/QuoteForm";
import { ServiceArt } from "../ui/ServiceArt";
import { ServiceCards } from "../ui/ServiceCards";
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
  const contact = useContact();
  return (
    <section className="bg-grid relative isolate overflow-hidden bg-navy-950">
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-navy-950 to-transparent" />
      <div className="container-page grid items-center gap-12 pt-32 pb-20 sm:pt-40 sm:pb-24 lg:grid-cols-[1.05fr_1fr] lg:pt-44 lg:pb-28">
        <div>
          <p className="eyebrow text-brand">Automatisme industriel · Médéa · toute l’Algérie</p>
          <h1 className="mt-4 text-4xl leading-[1.1] font-bold tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
            Programmation d’automates et dépannage d’armoires
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-300">
            Programmes PLC et IHM, recherche de pannes dans vos armoires de commande, rétrofit et mise en service de
            variateurs : nous remettons vos machines en production et les rendons plus fiables.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/#contact" className="btn-primary px-6">
              Demander un devis
              <ArrowRight className="size-4" />
            </Link>
            <a href={whatsappLink(contact)} target="_blank" rel="noopener noreferrer" className="btn-outline-light px-6">
              <BrandIcon name="WhatsApp" className="size-4" />
              {contact.whatsapp}
            </a>
          </div>
          <ul className="mt-10 grid gap-3 text-sm text-slate-300 sm:grid-cols-3 sm:gap-6">
            {["Siemens, Schneider, Omron, Fatek", "Sur site partout en Algérie", "Devis avant intervention"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-brand" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* A programming window showing a ladder diagram */}
        <div className="hidden overflow-hidden rounded-xl bg-navy-900 shadow-2xl ring-1 ring-white/10 sm:block">
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
            </span>
            <span className="font-mono text-xs text-slate-400">OB1 · Programme principal</span>
            <span className="ms-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              EN LIGNE
            </span>
          </div>
          <ServiceArt kind="ladder" className="aspect-[5/3]" />
        </div>
      </div>
    </section>
  );
}

function Brands() {
  return (
    <section aria-label="Marques prises en charge" className="border-b border-slate-200 bg-white">
      <div className="container-page py-10">
        <p className="text-center text-sm text-slate-500">Automates et équipements de toutes marques, notamment</p>
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
  return (
    <section id="services" className="bg-slate-50 py-20 sm:py-24">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle
            eyebrow="Services"
            title="Ce que nous faisons"
            text="Toute la partie commande de vos machines : le programme, l’armoire et les variateurs."
          />
          <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-navy-700">
            Tous les services
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-12">
          <ServiceCards />
        </div>
      </div>
    </section>
  );
}

function Method() {
  return (
    <section id="methode" className="bg-grid bg-navy-900 py-20 sm:py-24">
      <div className="container-page">
        <SectionTitle
          light
          eyebrow="Méthode"
          title="Une intervention préparée, de l’appel à la mise en service"
          text="Vous savez à chaque étape ce qui a été constaté, ce qui sera fait et dans quel délai."
        />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
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
  const [cv, setCv] = useState<{ fr: string; en: string }>({ fr: "", en: "" });
  useEffect(() => {
    select<{ url_fr: string | null; url_en: string | null }>("resume_links", { select: "url_fr,url_en", limit: "1" }).then(
      ([row]) => row && setCv({ fr: row.url_fr || "", en: row.url_en || "" }),
    );
  }, []);

  return (
    <section id="a-propos" className="py-20 sm:py-24">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <img
            src="/images/web/fondateur.webp"
            alt="Fekhar Moutie sur un site industriel"
            width={900}
            height={1200}
            loading="lazy"
            className="aspect-[4/5] w-full rounded-xl object-cover shadow-lg"
          />
          <div className="absolute -bottom-5 left-5 rounded-lg bg-brand px-5 py-3 shadow-md sm:-right-5 sm:left-auto">
            <p className="font-display text-2xl leading-none font-semibold text-navy-950">Depuis 2020</p>
            <p className="mt-1 text-xs font-medium text-navy-900">au service de l’industrie</p>
          </div>
        </div>
        <div>
          <SectionTitle eyebrow="À propos" title="Un ingénieur en automatisme, sur le terrain" />
          <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600">
            <p>
              MTE a été créé par <strong className="font-semibold text-navy-900">Fekhar Moutie</strong>, ingénieur en
              automatisme et électronique, pour accompagner les industriels sur la partie commande de leurs machines :
              automates, écrans, armoires et variateurs.
            </p>
            <p>
              Être à la fois programmeur et électronicien permet de dépanner vite : lire le programme en ligne, mesurer
              les signaux dans l’armoire et, si besoin, comprendre ce qui se passe sur une carte.
            </p>
            <p>Notre engagement : des interventions préparées, des explications claires, et des programmes sauvegardés et documentés.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/portfolio" className="btn bg-navy-900 text-white hover:bg-navy-800">
              Voir les réalisations
              <ArrowRight className="size-4" />
            </Link>
            {cv.fr && (
              <a href={cv.fr} target="_blank" rel="noopener noreferrer" className="btn-outline">
                <FileText className="size-4" />
                CV (français)
              </a>
            )}
            {cv.en && (
              <a href={cv.en} target="_blank" rel="noopener noreferrer" className="btn-outline">
                <FileText className="size-4" />
                CV (anglais)
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function LatestWork() {
  const [items, setItems] = useState<PortfolioItem[] | null>(null);
  useEffect(() => {
    fetchPortfolio(3).then(setItems);
  }, []);
  if (items && items.length === 0) return null;

  return (
    <section className="border-t border-slate-200 bg-slate-50 py-20 sm:py-24">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle eyebrow="Réalisations" title="Interventions récentes" />
          <Link to="/portfolio" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-navy-700">
            Toutes les réalisations
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {(items ?? [null, null, null]).map((item, i) =>
            item ? (
              <li key={item.id}>
                <Link
                  to={`/portfolio/${item.id}`}
                  className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition hover:shadow-md"
                >
                  <div className="aspect-video overflow-hidden bg-slate-200">
                    {coverImage(item) && (
                      <img
                        src={coverImage(item)!}
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
            ) : (
              // Same box as a loaded card, so the page doesn't shift when projects arrive.
              <li key={i} aria-hidden="true" className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="aspect-video animate-pulse bg-slate-200" />
                <div className="p-5">
                  <div className="h-4 w-24 rounded bg-slate-100" />
                  <div className="mt-1.5 h-12 rounded bg-slate-100" />
                </div>
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="py-20 sm:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <SectionTitle eyebrow="FAQ" title="Questions fréquentes" text="Une autre question ? Appelez-nous ou écrivez-nous sur WhatsApp." />
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy-900 [&::-webkit-details-marker]:hidden">
                {f.q}
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
  const contact = useContact();
  const rows = [
    { icon: <BrandIcon name="WhatsApp" className="size-5" />, label: "WhatsApp", value: contact.whatsapp, href: whatsappLink(contact), external: true },
    { icon: <Phone className="size-5" />, label: "Téléphone", value: contact.phone, href: telHref(contact.phone) },
    { icon: <Mail className="size-5" />, label: "E-mail", value: contact.email, href: `mailto:${contact.email}` },
    { icon: <MapPin className="size-5" />, label: "Adresse", value: contact.address, href: contact.mapUrl, external: true },
    { icon: <Clock className="size-5" />, label: "Horaires", value: contact.hours },
  ];
  return (
    <section id="contact" className="bg-slate-50 py-20 sm:py-24">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionTitle
            eyebrow="Contact"
            title="Une machine à l’arrêt ou un projet ?"
            text="Envoyez une photo de l’armoire, le code défaut affiché ou la description de votre projet : nous revenons vers vous rapidement."
          />
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
  return (
    <>
      <Seo
        title="MTE – Automatisme industriel en Algérie | Programmation PLC, dépannage d’armoires"
        description="Programmation d’automates et d’écrans IHM, diagnostic et dépannage d’armoires de commande, rétrofit et mise en service de variateurs. Médéa et intervention partout en Algérie."
        path="/"
      />
      <Hero />
      <Brands />
      <Services />
      <Method />
      <About />
      <LatestWork />
      <Faq />
      <Contact />
    </>
  );
}
