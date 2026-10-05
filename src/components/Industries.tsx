import { useLang } from "../i18n/LanguageProvider";

export default function Industries() {
  const { t } = useLang();
  return (
    <section className="py-20 sm:py-28 bg-steel text-white relative overflow-hidden">
      <div className="hazard absolute left-0 top-0 h-1.5 w-full opacity-70" />
      <div className="container-mte">
        <div className="max-w-2xl">
          <span className="eyebrow !text-safety">{t.industries.eyebrow}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">
            {t.industries.title}
          </h2>
          <p className="mt-4 text-white/70 leading-relaxed">{t.industries.intro}</p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          {t.industries.items.map((name) => (
            <span
              key={name}
              className="rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/90"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
