import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { SOCIAL } from "../site";
import { telHref, useContact, whatsappLink } from "../contact";
import { useServices } from "../services";
import { localePath, useLang, useT } from "../i18n";
import { BrandIcon, type Brand } from "./BrandIcon";

const SOCIAL_LINKS: { name: Brand; href: string }[] = [
  { name: "LinkedIn", href: SOCIAL.linkedin },
  { name: "Facebook", href: SOCIAL.facebook },
  { name: "Instagram", href: SOCIAL.instagram },
  { name: "GitHub", href: SOCIAL.github },
];

export function Footer() {
  const lang = useLang();
  const t = useT();
  const services = useServices(lang);
  const contact = useContact();
  const to = (path: string) => localePath(lang, path);
  const social = [{ name: "WhatsApp" as Brand, href: whatsappLink(contact) }, ...SOCIAL_LINKS];
  return (
    <footer className="bg-navy-950 text-slate-300">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <img src="/images/logo%20white.png" alt="MTE Industrial Electronics" width={900} height={384} className="h-10 w-auto" loading="lazy" />
          <p className="mt-4 text-sm leading-relaxed text-slate-400">{t.footer.text}</p>
          <ul className="mt-5 flex gap-3">
            {social.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex size-9 items-center justify-center rounded-md bg-white/5 text-slate-300 transition-colors hover:bg-brand hover:text-navy-950"
                >
                  <BrandIcon name={s.name} className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow text-brand">{t.footer.services}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link to={to("/#services")} className="hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow text-brand">{t.footer.navigation}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to={to("/#methode")} className="hover:text-white">{t.nav.method}</Link></li>
            <li><Link to={to("/#a-propos")} className="hover:text-white">{t.nav.about}</Link></li>
            <li><Link to={to("/portfolio")} className="hover:text-white">{t.nav.work}</Link></li>
            <li><Link to={to("/#faq")} className="hover:text-white">{t.footer.faq}</Link></li>
            <li><Link to={to("/#contact")} className="hover:text-white">{t.nav.quote}</Link></li>
            <li>
              <Link to={localePath(lang === "fr" ? "en" : "fr", "/")} hrefLang={lang === "fr" ? "en" : "fr"} className="hover:text-white">
                {lang === "fr" ? "English" : "Français"}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="eyebrow text-brand">{t.footer.contact}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={telHref(contact.phone)} className="flex items-start gap-2.5 hover:text-white">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand" />
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="flex items-start gap-2.5 break-all hover:text-white">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand" />
                {contact.email}
              </a>
            </li>
            <li>
              <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 hover:text-white">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                {contact.address}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-slate-500 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} MTE Industrial Electronics — Fekhar Moutie. {t.footer.rights}</p>
          <p>{t.footer.place}</p>
        </div>
      </div>
    </footer>
  );
}
