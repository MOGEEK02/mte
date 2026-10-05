import { useLang } from "../i18n/LanguageProvider";

export default function Process() {
  const { t } = useLang();

  return (
    <section id="process" className="py-20 sm:py-28 bg-ink text-white">
      <div className="container-mte">
        <div className="max-w-2xl">
          <span className="eyebrow">{t.process.eyebrow}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t.process.title}
          </h2>
          <p className="mt-4 text-white/70 leading-relaxed">{t.process.intro}</p>
        </div>

        <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {t.process.steps.map((step, i) => (
            <li key={step.title} className="relative">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-white">
                  {i + 1}
                </span>
                {i < t.process.steps.length - 1 && (
                  <span className="hidden lg:block h-px flex-1 bg-white/15" />
                )}
              </div>
              <h3 className="mt-4 text-base font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
