import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLang } from "../i18n/LanguageProvider";
import { SITE } from "../config";
import { WhatsappIcon } from "./icons";

export default function Hero() {
  const { t } = useLang();

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center bg-ink bg-cover bg-center"
      style={{ backgroundImage: "url(/images/backg.png)" }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink/95 via-ink/85 to-ink/70" />

      <div className="container-mte relative z-10 pt-28 pb-16 w-full">
        <div className="max-w-3xl">
          <span className="inline-block rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-amber backdrop-blur-sm">
            {t.hero.badge}
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-white">
            {t.hero.title}{" "}
            <span className="text-brand">{t.hero.titleAccent}</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-white/80">
            {t.hero.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <WhatsappIcon size={18} />
              {t.hero.ctaPrimary}
            </a>
            <Link to="/portfolio" className="btn-ghost">
              {t.hero.ctaSecondary}
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* trust indicators */}
          <div className="mt-14 grid grid-cols-3 gap-6 max-w-xl border-t border-white/10 pt-8">
            {[
              { v: t.hero.stat1Value, l: t.hero.stat1 },
              { v: t.hero.stat2Value, l: t.hero.stat2 },
              { v: t.hero.stat3Value, l: t.hero.stat3 },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-base sm:text-xl font-extrabold text-amber">
                  {s.v}
                </div>
                <div className="mt-1 text-xs sm:text-sm text-white/60">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
