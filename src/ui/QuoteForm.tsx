import { useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useContact, whatsappLink } from "../contact";
import { useLang, useT, type Dict } from "../i18n";
import { BrandIcon } from "./BrandIcon";

type Fields = {
  name: string;
  company: string;
  phone: string;
  email: string;
  equipment: string;
  model: string;
  message: string;
  onSite: boolean;
};

function compose(f: Fields, t: Dict["form"]) {
  const L = t.waLabels;
  const details = [
    `${L.name} : ${f.name.trim()}`,
    f.company.trim() && `${L.company} : ${f.company.trim()}`,
    f.phone.trim() && `${L.phone} : ${f.phone.trim()}`,
    f.email.trim() && `${L.email} : ${f.email.trim()}`,
    `${L.type} : ${f.equipment}`,
    f.model.trim() && `${L.model} : ${f.model.trim()}`,
    f.onSite && L.onSite,
  ].filter(Boolean);
  return [t.waIntro, "", ...details, "", f.message.trim()].join("\n");
}

const input =
  "mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-ink shadow-xs placeholder:text-slate-400 focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20 focus:outline-none";
const label = "block text-sm font-medium text-slate-700";

type Status = "idle" | "sending" | "sent" | "error";

/** Quote request, saved and e-mailed to MTE by /api/quote. WhatsApp stays available as a direct alternative. */
export function QuoteForm() {
  const lang = useLang();
  const t = useT().form;
  const empty: Fields = { name: "", company: "", phone: "", email: "", equipment: t.types[0], model: "", message: "", onSite: false };
  const contact = useContact();
  const [f, setF] = useState<Fields>(empty);
  const [status, setStatus] = useState<Status>("idle");
  const [trap, setTrap] = useState("");
  const shownAt = useRef(0);
  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => setF((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!f.phone.trim() && !f.email.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, service: lang === "en" ? "Site (English)" : "", website: trap, elapsed: Date.now() - shownAt.current }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-start rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <CheckCircle2 className="size-10 text-emerald-600" />
        <h3 className="mt-4 text-xl font-semibold text-navy-900">{t.sentTitle}</h3>
        <p className="mt-2 text-slate-600">{t.sentText(f.name.trim().split(/\s+/)[0], Boolean(f.phone.trim()))}</p>
        <button
          type="button"
          onClick={() => {
            setF(empty);
            setStatus("idle");
          }}
          className="btn-outline mt-6"
        >
          {t.another}
        </button>
      </div>
    );
  }

  const noContact = !f.phone.trim() && !f.email.trim();

  return (
    <form
      onSubmit={onSubmit}
      onFocus={() => {
        if (!shownAt.current) shownAt.current = Date.now();
      }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <h3 className="text-xl font-semibold text-navy-900">{t.title}</h3>
      <p className="mt-1 text-sm text-slate-500">{t.intro}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="q-name" className={label}>{t.name}</label>
          <input id="q-name" required maxLength={120} autoComplete="name" className={input} value={f.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label htmlFor="q-company" className={label}>{t.company}</label>
          <input id="q-company" maxLength={160} autoComplete="organization" className={input} value={f.company} onChange={(e) => set("company", e.target.value)} />
        </div>
        <div>
          <label htmlFor="q-phone" className={label}>{t.phone}</label>
          <input id="q-phone" type="tel" maxLength={40} autoComplete="tel" inputMode="tel" className={input} value={f.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div>
          <label htmlFor="q-email" className={label}>{t.email}</label>
          <input id="q-email" type="email" maxLength={160} autoComplete="email" className={input} value={f.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <p className={`-mt-2 text-xs sm:col-span-2 ${noContact ? "text-slate-500" : "text-transparent"}`} aria-live="polite">
          {t.needContact}
        </p>
        <div>
          <label htmlFor="q-equipment" className={label}>{t.type}</label>
          <select id="q-equipment" className={input} value={f.equipment} onChange={(e) => set("equipment", e.target.value)}>
            {t.types.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="q-model" className={label}>{t.model}</label>
          <input id="q-model" maxLength={160} placeholder={t.modelPlaceholder} className={input} value={f.model} onChange={(e) => set("model", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="q-message" className={label}>{t.message}</label>
          <textarea
            id="q-message"
            required
            rows={4}
            maxLength={4000}
            placeholder={t.messagePlaceholder}
            className={input}
            value={f.message}
            onChange={(e) => set("message", e.target.value)}
          />
        </div>
        {/* Left empty by people; bots that fill every field are ignored by the server. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
          <label htmlFor="q-website">{t.honeypot}</label>
          <input id="q-website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </div>
        <label className="flex items-center gap-2.5 text-sm text-slate-700 sm:col-span-2">
          <input type="checkbox" className="size-4 accent-navy-900" checked={f.onSite} onChange={(e) => set("onSite", e.target.checked)} />
          {t.onSite}
        </label>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
          {t.error}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" disabled={status === "sending" || noContact} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
          {status === "sending" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {status === "sending" ? t.sending : t.send}
        </button>
        <a
          href={whatsappLink(contact, compose(f, t))}
          target="_blank"
          rel="noopener noreferrer"
          className={status === "error" ? "btn bg-[#25d366] text-white hover:bg-[#1ebe5b]" : "btn-outline"}
        >
          <BrandIcon name="WhatsApp" className="size-4" />
          {t.whatsapp}
        </a>
      </div>
    </form>
  );
}
