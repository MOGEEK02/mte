import { ShieldCheck, Cpu, MapPin, Clock } from "lucide-react";
import { useLang } from "../i18n/LanguageProvider";

const ICONS = [ShieldCheck, Cpu, MapPin, Clock];

export default function WhyMe() {
  const { t } = useLang();
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="container-mte">
        <div className="max-w-2xl">
          <span className="eyebrow">{t.why.eyebrow}</span>
          <h2 className="section-title mt-3">{t.why.title}</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.why.items.map((item, i) => {
            const Icon = ICONS[i] ?? ShieldCheck;
            return (
              <div key={item.title} className="relative rounded-md border border-slate-200 p-6">
                <span className="absolute -top-4 left-6 flex h-10 w-10 items-center justify-center rounded-md bg-brand text-white">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 text-base font-extrabold uppercase tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
