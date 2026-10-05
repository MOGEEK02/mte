import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Linkedin, Facebook, Github } from "lucide-react";
import { supabase } from "../utils/supabase";
import { useLang } from "../i18n/LanguageProvider";
import { SITE } from "../config";
import { WhatsappIcon } from "./icons";

export default function AboutUs() {
  const { lang, t } = useLang();
  const [cv, setCv] = useState({ en: "", fr: "" });

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("resume_links")
        .select("*")
        .single();
      if (active && !error && data) {
        setCv({ en: data.url_en || "", fr: data.url_fr || "" });
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="about" className="py-20 sm:py-28 bg-white">
      <div className="container-mte grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Portrait */}
        <div className="relative">
          <div className="absolute -inset-3 rounded-3xl bg-brand/10 -z-10" />
          <img
            src="/images/moutie.png"
            alt="Fekhar Moutie – ingénieur en automatisme et électronique, Algérie"
            className="w-full rounded-2xl object-cover shadow-xl"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div>
          <span className="eyebrow">{t.about.eyebrow}</span>
          <h2 className="section-title mt-3">{t.about.title}</h2>

          <div className="mt-6 space-y-4 text-slate-600 leading-relaxed">
            <p dangerouslySetInnerHTML={{ __html: t.about.p1 }} />
            <p dangerouslySetInnerHTML={{ __html: t.about.p2 }} />
            <p>{t.about.p3}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/portfolio" className="btn-primary">
              {t.about.ctaPortfolio}
              <ArrowRight size={18} />
            </Link>
            {cv.fr && (
              <a
                href={cv.fr}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <FileText size={18} />
                {t.about.cvFr}
              </a>
            )}
            {cv.en && (
              <a
                href={cv.en}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <FileText size={18} />
                {t.about.cvEn}
              </a>
            )}
          </div>

          {/* Socials */}
          <div className="mt-8 flex items-center gap-4 text-slate-400">
            <a
              href={SITE.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-brand transition-colors"
            >
              <Linkedin size={22} />
            </a>
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-brand transition-colors"
            >
              <Facebook size={22} />
            </a>
            <a
              href={SITE.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-brand transition-colors"
            >
              <Github size={22} />
            </a>
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hover:text-brand transition-colors"
              lang={lang}
            >
              <WhatsappIcon size={22} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
