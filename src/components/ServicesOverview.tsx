import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLang } from "../i18n/LanguageProvider";
import { serviceIcon } from "./serviceIcons";

const GROUP_ORDER = ["automation", "repair", "power"] as const;

export default function ServicesOverview({ withHeading = true }: { withHeading?: boolean }) {
  const { lang, t } = useLang();

  return (
    <section id="services" className="py-20 sm:py-28 bg-zinc-50">
      <div className="container-mte">
        {withHeading && (
          <div className="max-w-2xl">
            <span className="eyebrow">{t.services.eyebrow}</span>
            <h2 className="section-title mt-3">{t.services.title}</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">{t.services.intro}</p>
          </div>
        )}

        {GROUP_ORDER.map((group) => {
          const items = t.services.items.filter((s) => s.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group} className="mt-14 first:mt-12">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 bg-brand" />
                <h3 className="text-lg font-extrabold uppercase tracking-wide text-ink">
                  {t.services.groups[group]}
                </h3>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((s) => {
                  const Icon = serviceIcon(s.slug);
                  return (
                    <Link
                      key={s.slug}
                      to={`/${lang}/services/${s.slug}`}
                      className="group flex flex-col rounded-md border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-brand hover:shadow-xl"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-md bg-ink text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                        <Icon size={24} />
                      </span>
                      <h4 className="mt-5 text-lg font-extrabold uppercase tracking-tight text-ink leading-tight">
                        {s.title}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 flex-grow">
                        {s.tagline}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand group-hover:gap-3 transition-all">
                        {t.services.learnMore}
                        <ArrowRight size={15} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
