import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { SOCIAL } from "../site";
import { telHref, useContact, whatsappLink } from "../contact";
import { useServices } from "../services";
import { BrandIcon, type Brand } from "./BrandIcon";

const SOCIAL_LINKS: { name: Brand; href: string }[] = [
  { name: "LinkedIn", href: SOCIAL.linkedin },
  { name: "Facebook", href: SOCIAL.facebook },
  { name: "Instagram", href: SOCIAL.instagram },
  { name: "GitHub", href: SOCIAL.github },
];

export function Footer() {
  const { services } = useServices();
  const contact = useContact();
  const social = [{ name: "WhatsApp" as Brand, href: whatsappLink(contact) }, ...SOCIAL_LINKS];
  return (
    <footer className="bg-navy-950 text-slate-300">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <img src="/images/logo%20white.png" alt="MTE Industrial Electronics" width={900} height={384} className="h-10 w-auto" loading="lazy" />
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Automatisme industriel : programmation PLC et IHM, dépannage d’armoires et mise en service, à Médéa et partout en Algérie.
          </p>
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
          <h2 className="eyebrow text-brand">Services</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`} className="hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow text-brand">Navigation</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/#methode" className="hover:text-white">Méthode</Link></li>
            <li><Link to="/#a-propos" className="hover:text-white">À propos</Link></li>
            <li><Link to="/portfolio" className="hover:text-white">Réalisations</Link></li>
            <li><Link to="/#faq" className="hover:text-white">Questions fréquentes</Link></li>
            <li><Link to="/#contact" className="hover:text-white">Demander un devis</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="eyebrow text-brand">Contact</h2>
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
          <p>© {new Date().getFullYear()} MTE Industrial Electronics — Fekhar Moutie. Tous droits réservés.</p>
          <p>Médéa, Algérie</p>
        </div>
      </div>
    </footer>
  );
}
