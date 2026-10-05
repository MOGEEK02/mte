import { useLang } from "../i18n/LanguageProvider";

const BRANDS = [
  { src: "/images/Siemens_logo_16-9.png", name: "Siemens" },
  { src: "/images/Schneider-Electric-logo-jpg-.png", name: "Schneider Electric" },
  { src: "/images/ABB.png", name: "ABB" },
  { src: "/images/images.png", name: "Omron" },
  { src: "/images/fatek.png", name: "Fatek" },
  { src: "/images/arduino_pro_logo.jpg", name: "Arduino" },
];

export default function CompanyLogosShowcase() {
  const { t } = useLang();
  return (
    <section className="py-14 bg-slate-50 border-y border-slate-100">
      <div className="container-mte text-center">
        <span className="eyebrow">{t.brands.eyebrow}</span>
        <h2 className="mt-2 text-lg font-semibold text-slate-500">
          {t.brands.title}
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-8 sm:gap-x-16">
          {BRANDS.map((b) => (
            <img
              key={b.name}
              src={b.src}
              alt={`${b.name} – programmation & réparation automatisme, MTE Algérie`}
              title={b.name}
              className="h-9 sm:h-11 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
