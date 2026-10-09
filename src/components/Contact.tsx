import { Phone, MapPin } from "lucide-react";
import { useLang } from "../i18n/LanguageProvider";
import { SITE } from "../config";
import { WhatsappIcon } from "./icons";
import { trackWhatsApp } from "../utils/track";

export default function Contact() {
  const { t } = useLang();

  const cards = [
    {
      href: SITE.whatsapp,
      external: true,
      icon: <WhatsappIcon size={26} />,
      label: t.contact.whatsappLabel,
      value: SITE.phoneDisplay,
      desc: t.contact.whatsappDesc,
      accent: "text-emerald-600 bg-emerald-50",
    },
    {
      href: `tel:${SITE.phone}`,
      external: false,
      icon: <Phone size={26} />,
      label: t.contact.callLabel,
      value: SITE.phoneDisplay,
      desc: t.contact.callDesc,
      accent: "text-brand bg-brand/10",
    },
    {
      href: SITE.maps,
      external: true,
      icon: <MapPin size={26} />,
      label: t.contact.locationLabel,
      value: "",
      desc: t.contact.locationDesc,
      accent: "text-rose-600 bg-rose-50",
    },
  ];

  return (
    <section id="contact" className="py-20 sm:py-28 bg-white">
      <div className="container-mte">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">{t.contact.eyebrow}</span>
          <h2 className="section-title mt-3">{t.contact.title}</h2>
          <p className="mt-4 text-slate-600">{t.contact.subtitle}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <a
              key={i}
              href={c.href}
              {...(c.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              onClick={() => {
                if (c.href.includes("wa.me")) trackWhatsApp("contact");
              }}
              className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand/30"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full ${c.accent}`}
              >
                {c.icon}
              </span>
              <span className="mt-5 text-base font-bold text-ink">{c.label}</span>
              {c.value && (
                <span className="mt-1 text-sm font-semibold text-slate-700" dir="ltr">
                  {c.value}
                </span>
              )}
              <span className="mt-1 text-sm text-slate-500">{c.desc}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
