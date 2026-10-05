import { Link } from "react-router-dom";
import { Phone, MapPin, Linkedin, Facebook, Instagram, Github } from "lucide-react";
import { useLang } from "../i18n/LanguageProvider";
import { SITE } from "../config";
import { WhatsappIcon } from "./icons";

export default function Footer() {
  const { lang, t } = useLang();
  const year = new Date().getFullYear();

  const socials = [
    { href: SITE.social.github, icon: <Github size={18} />, label: "GitHub" },
    { href: SITE.social.facebook, icon: <Facebook size={18} />, label: "Facebook" },
    { href: SITE.social.instagram, icon: <Instagram size={18} />, label: "Instagram" },
    { href: SITE.social.linkedin, icon: <Linkedin size={18} />, label: "LinkedIn" },
    { href: SITE.whatsapp, icon: <WhatsappIcon size={18} />, label: "WhatsApp" },
  ];

  return (
    <footer className="bg-ink text-white/80 pt-16 pb-8">
      <div className="container-mte grid gap-10 md:grid-cols-3">
        {/* Brand */}
        <div>
          <img
            src="/images/logo%20white.png"
            alt="MTE"
            className="h-11 w-auto object-contain"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            {t.footer.about}
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber">
            {t.footer.quickLinks}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to={`/${lang}/services`} className="hover:text-brand transition-colors">
                {t.nav.services}
              </Link>
            </li>
            <li>
              <Link to="/portfolio" className="hover:text-brand transition-colors">
                {t.nav.portfolio}
              </Link>
            </li>
            <li>
              <a href={`/${lang}#quote`} className="hover:text-brand transition-colors">
                {t.nav.quote}
              </a>
            </li>
            <li>
              <a href={`/${lang}#contact`} className="hover:text-brand transition-colors">
                {t.nav.contact}
              </a>
            </li>
          </ul>
        </div>

        {/* Contact + socials */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber">
            {t.footer.follow}
          </h3>
          <div className="mt-4 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-brand transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
          <div className="mt-5 space-y-2 text-sm text-white/60">
            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center gap-2 hover:text-brand transition-colors"
              dir="ltr"
            >
              <Phone size={16} /> {SITE.phoneDisplay}
            </a>
            <a
              href={SITE.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-brand transition-colors"
            >
              <MapPin size={16} /> {t.contact.locationLabel}
            </a>
          </div>
        </div>
      </div>

      <div className="container-mte mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/50">
        &copy; {year} MTE – {t.footer.tagline}. {t.footer.rights}
      </div>
    </footer>
  );
}
