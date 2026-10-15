import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Phone, Sigma } from "lucide-react";
import { telHref, useContact, whatsappLink } from "../contact";
import { localePath, useLang, type Lang } from "../i18n";
import { BrandIcon } from "../ui/BrandIcon";
import { Seo } from "../ui/Seo";
import { CALCULATORS } from "../ui/calculators";
import { toolIcon } from "../ui/toolIcons";
import { TOOLS, TOOLS_HUB, TOOLS_PATH, toolPath, type Tool } from "../tools";
import { toolMeta } from "../seo";

type L<T = string> = Record<Lang, T>;
const UI = {
  home: { fr: "Accueil", en: "Home", ar: "الرئيسية" },
  tools: { fr: "Outils", en: "Tools", ar: "أدوات" },
  formula: { fr: "Formule", en: "Formula", ar: "الصيغة" },
  goodToKnow: { fr: "À savoir", en: "Good to know", ar: "معلومات مفيدة" },
  other: { fr: "Autres outils", en: "Other tools", ar: "أدوات أخرى" },
  ctaTitle: { fr: "Besoin d’un professionnel ?", en: "Need a professional?", ar: "تحتاج إلى محترف؟" },
  ctaText: {
    fr: "MTE réalise études électriques, dépannage d’armoires et réparation de variateurs et de cartes, partout en Algérie.",
    en: "MTE provides electrical design, control-panel troubleshooting and repair of drives and boards, across Algeria.",
    ar: "تنجز MTE الدراسات الكهربائية وتصليح الخزائن وإصلاح مغيرات السرعة والبطاقات في كامل الجزائر.",
  },
  disclaimer: {
    fr: "Résultat indicatif : vérifiez toujours selon les normes et le mode de pose de votre installation.",
    en: "Indicative result: always verify against the standards and the installation method on site.",
    ar: "النتيجة إرشادية: تحقّق دائماً وفق المعايير وطريقة التمديد في منشأتك.",
  },
} satisfies Record<string, L>;

export default function ToolPage({ tool }: { tool: Tool }) {
  const lang = useLang();
  const contact = useContact();
  const to = (p: string) => localePath(lang, p);
  const Calc = CALCULATORS[tool.slug];
  const Icon = toolIcon(tool.icon);
  const others = TOOLS.filter((x) => x.slug !== tool.slug);

  return (
    <>
      <Seo {...toolMeta(lang, tool)} />

      {/* Hero */}
      <section className="bg-navy-950 pt-32 pb-12 sm:pt-36 sm:pb-14">
        <div className="container-page">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link to={to("/")} className="hover:text-white">{UI.home[lang]}</Link></li>
              <li aria-hidden="true"><ChevronRight className="size-3.5 rtl:-scale-x-100" /></li>
              <li><Link to={to(TOOLS_PATH)} className="hover:text-white">{UI.tools[lang]}</Link></li>
              <li aria-hidden="true"><ChevronRight className="size-3.5 rtl:-scale-x-100" /></li>
              <li className="text-slate-200">{tool.title[lang]}</li>
            </ol>
          </nav>
          <div className="mt-6 flex items-start gap-4">
            <span className="hidden size-12 shrink-0 items-center justify-center rounded-xl bg-brand text-navy-950 sm:flex">
              <Icon className="size-6" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{tool.keyword[lang]}</h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">{tool.intro[lang]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div className="grid gap-6">
            {/* Calculator */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
              {Calc ? <Calc /> : null}
              <p className="mt-6 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-400">{UI.disclaimer[lang]}</p>
            </div>

            {/* Formula */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                <Sigma className="size-4 text-brand-600" />
                {UI.formula[lang]}
              </h2>
              <p dir="ltr" className="mt-2 rounded-lg bg-navy-950 px-4 py-3 text-center font-mono text-sm text-brand">{tool.formula[lang]}</p>
            </div>

            {/* Good to know */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-navy-900">{UI.goodToKnow[lang]}</h2>
              <ul className="mt-3 grid gap-2 text-sm text-slate-600">
                {tool.notes[lang].map((n, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-600" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="grid gap-6 lg:sticky lg:top-24">
            <div className="rounded-2xl bg-navy-950 p-6 text-white">
              <h2 className="text-lg font-bold">{UI.ctaTitle[lang]}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{UI.ctaText[lang]}</p>
              <div className="mt-5 grid gap-2.5">
                <a href={whatsappLink(contact)} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
                  <BrandIcon name="WhatsApp" className="size-4" />
                  WhatsApp
                </a>
                <a href={telHref(contact.phone)} className="btn-outline-light w-full">
                  <Phone className="size-4" />
                  <span dir="ltr">{contact.phone}</span>
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-navy-900">{UI.other[lang]}</h2>
              <ul className="mt-3 grid gap-1.5 text-sm">
                {others.map((o) => {
                  const OIcon = toolIcon(o.icon);
                  return (
                    <li key={o.slug}>
                      <Link to={to(toolPath(o))} className="group flex items-center gap-2.5 rounded-lg px-2 py-2 text-navy-800 hover:bg-slate-50">
                        <OIcon className="size-4 text-brand-600" />
                        <span className="group-hover:text-navy-900">{o.title[lang]}</span>
                        <ArrowRight className="ms-auto size-3.5 text-slate-300 rtl:-scale-x-100" />
                      </Link>
                    </li>
                  );
                })}
                <li className="pt-1">
                  <Link to={to(TOOLS_PATH)} className="inline-flex items-center gap-1.5 px-2 text-sm font-semibold text-navy-900">
                    {TOOLS_HUB.h1[lang]}
                    <ArrowRight className="size-3.5 rtl:-scale-x-100" />
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
