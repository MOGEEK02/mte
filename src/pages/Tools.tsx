import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { localePath, useLang, type Lang } from "../i18n";
import { Seo } from "../ui/Seo";
import { TOOLS, TOOLS_HUB, toolPath } from "../tools";
import { toolIcon } from "../ui/toolIcons";
import { toolsMeta } from "../seo";

type L<T = string> = Record<Lang, T>;
const USE: L = {
  fr: "Entrez vos valeurs, le résultat se calcule instantanément. Gratuit, sans inscription.",
  en: "Enter your values, the result is computed instantly. Free, no sign-up.",
  ar: "أدخل قيمك فيُحسب الناتج فوراً. مجاني وبدون تسجيل.",
};

export default function Tools() {
  const lang = useLang();
  const to = (p: string) => localePath(lang, p);

  return (
    <>
      <Seo {...toolsMeta(lang)} />

      <section className="bg-navy-950 pt-32 pb-14 sm:pt-36 sm:pb-16">
        <div className="container-page">
          <p className="eyebrow text-brand">{TOOLS_HUB.eyebrow[lang]}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">{TOOLS_HUB.h1[lang]}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">{TOOLS_HUB.intro[lang]}</p>
        </div>
      </section>

      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="container-page">
          <p className="mb-8 text-sm text-slate-500">{USE[lang]}</p>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => {
              const Icon = toolIcon(tool.icon);
              return (
                <li key={tool.slug}>
                  <Link
                    to={to(toolPath(tool))}
                    className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-navy-300 hover:shadow-md"
                  >
                    <span className="flex size-11 items-center justify-center rounded-lg bg-navy-950 text-brand transition-colors group-hover:bg-brand group-hover:text-navy-950">
                      <Icon className="size-5" />
                    </span>
                    <h2 className="mt-4 text-lg font-semibold text-navy-900 group-hover:text-navy-700">{tool.title[lang]}</h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{tool.tagline[lang]}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-navy-900">
                      {TOOLS_HUB.eyebrow[lang]}
                      <ArrowRight className="size-4 transition group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
