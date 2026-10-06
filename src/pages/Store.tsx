import { Store as StoreIcon } from "lucide-react";
import { useContact, whatsappLink } from "../contact";
import { useLang, useT } from "../i18n";
import { BrandIcon } from "../ui/BrandIcon";
import { Seo } from "../ui/Seo";

/** Placeholder until the online store exists. Kept out of search results (noindex) until then. */
export default function Store() {
  const lang = useLang();
  const t = useT().store;
  const contact = useContact();
  return (
    <>
      <Seo lang={lang} path="/store" title={t.seoTitle} description={t.seoDescription} noindex />
      <section className="bg-navy-950 pt-32 pb-14 sm:pt-36 sm:pb-16">
        <div className="container-page">
          <p className="eyebrow text-brand">{t.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">{t.title}</h1>
        </div>
      </section>
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="container-page">
          <div className="mx-auto flex max-w-xl flex-col items-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xs sm:p-10">
            <span className="flex size-14 items-center justify-center rounded-full bg-brand/15 text-brand-600">
              <StoreIcon className="size-7" />
            </span>
            <p className="mt-5 inline-flex rounded-full bg-brand px-3 py-1 text-sm font-semibold text-navy-950">{t.soon}</p>
            <h2 className="mt-4 text-2xl font-bold text-navy-900">{t.text}</h2>
            <p className="mt-3 text-slate-600">{t.ctaText}</p>
            <a
              href={whatsappLink(contact, t.waText)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-7 bg-[#25d366] text-white hover:bg-[#1ebe5b]"
            >
              <BrandIcon name="WhatsApp" className="size-4" />
              {t.cta}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
