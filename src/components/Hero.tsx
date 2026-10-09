import { Check } from "lucide-react";
import { useLang } from "../i18n/LanguageProvider";
import { SITE } from "../config";
import { WhatsappIcon } from "./icons";
import { trackWhatsApp } from "../utils/track";

export default function Hero() {
  const { t } = useLang();

  return (
    <section
      id="home"
      className="relative flex items-center bg-ink bg-cover bg-center min-h-[94vh]"
      style={{ backgroundImage: "url(/images/backg.png)" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/92 to-ink/70" />
      {/* safety stripe accent */}
      <div className="hazard absolute left-0 top-0 h-1.5 w-full opacity-80" />

      <div className="container-mte relative z-10 pt-32 pb-16 w-full">
        <div className="max-w-3xl">
          <span className="inline-block border-s-2 border-brand ps-3 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-safety">
            {t.hero.badge}
          </span>

          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase leading-[0.98] tracking-tight text-white">
            {t.hero.title}
            <span className="block text-brand">{t.hero.titleAccent}</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-white/80">
            {t.hero.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp("hero")} className="btn-wa">
              <WhatsappIcon size={18} />
              {t.hero.ctaPrimary}
            </a>
            <a href="#quote" className="btn-primary">
              {t.hero.ctaQuote}
            </a>
          </div>

          {/* concrete trust chips (no vanity numbers) */}
          <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 max-w-2xl border-t border-white/10 pt-7">
            {t.hero.chips.map((chip) => (
              <li key={chip} className="flex items-center gap-2.5 text-sm font-medium text-white/85">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/20 text-brand">
                  <Check size={13} strokeWidth={3} />
                </span>
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
