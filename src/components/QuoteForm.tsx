import { useState } from "react";
import { Phone, Send } from "lucide-react";
import { useLang } from "../i18n/LanguageProvider";
import { SITE } from "../config";
import { WhatsappIcon } from "./icons";
import { trackEvent, trackWhatsApp } from "../utils/track";

const waNumber = SITE.phone.replace(/[^0-9]/g, "");

export default function QuoteForm() {
  const { t } = useLang();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    equipment: t.quote.equipmentOptions[0],
    message: "",
  });

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      t.quote.waIntro,
      `${t.quote.name}: ${form.name}`,
      `${t.quote.phone}: ${form.phone}`,
      `${t.quote.city}: ${form.city}`,
      `${t.quote.equipment}: ${form.equipment}`,
      `${t.quote.message}: ${form.message}`,
    ];
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
    trackEvent("quote_submit", { equipment: form.equipment });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const field =
    "w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-ink placeholder-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

  return (
    <section id="quote" className="py-20 sm:py-28 bg-ink text-white">
      <div className="container-mte grid lg:grid-cols-2 gap-12 items-start">
        {/* Left: pitch + quick contact */}
        <div>
          <span className="eyebrow !text-safety">{t.quote.eyebrow}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">
            {t.quote.title}
          </h2>
          <p className="mt-4 text-white/75 leading-relaxed max-w-md">{t.quote.subtitle}</p>

          <div className="mt-8 space-y-3">
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp("quote")} className="btn-wa w-full sm:w-auto">
              <WhatsappIcon size={18} />
              {t.contact.whatsappLabel} · {SITE.phoneDisplay}
            </a>
            <a href={`tel:${SITE.phone}`} className="flex items-center gap-2 text-white/80 hover:text-brand transition-colors" dir="ltr">
              <Phone size={18} className="text-brand" />
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>

        {/* Right: form card */}
        <form onSubmit={submit} className="rounded-lg bg-white p-6 sm:p-8 shadow-2xl">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                {t.quote.name}
              </label>
              <input required value={form.name} onChange={set("name")} className={field} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                {t.quote.phone}
              </label>
              <input required value={form.phone} onChange={set("phone")} className={field} dir="ltr" inputMode="tel" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                {t.quote.city}
              </label>
              <input value={form.city} onChange={set("city")} className={field} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                {t.quote.equipment}
              </label>
              <select value={form.equipment} onChange={set("equipment")} className={field}>
                {t.quote.equipmentOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
              {t.quote.message}
            </label>
            <textarea required rows={4} value={form.message} onChange={set("message")} className={field} />
          </div>
          <button type="submit" className="btn-wa mt-6 w-full">
            <Send size={17} />
            {t.quote.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
