import { useState, type FormEvent } from "react";
import { Mail, Send } from "lucide-react";
import { CONTACT, EQUIPMENT_TYPES, whatsappUrl } from "../site";

type Fields = {
  name: string;
  company: string;
  phone: string;
  equipment: string;
  model: string;
  message: string;
  onSite: boolean;
};

const EMPTY: Fields = { name: "", company: "", phone: "", equipment: EQUIPMENT_TYPES[0], model: "", message: "", onSite: false };

function compose(f: Fields) {
  const details = [
    `Nom : ${f.name.trim()}`,
    f.company.trim() && `Entreprise : ${f.company.trim()}`,
    f.phone.trim() && `Téléphone : ${f.phone.trim()}`,
    `Équipement : ${f.equipment}`,
    f.model.trim() && `Marque / modèle : ${f.model.trim()}`,
    f.onSite && "Intervention sur site souhaitée",
  ].filter(Boolean);
  return ["Bonjour MTE, je souhaite un devis.", "", ...details, "", f.message.trim()].join("\n");
}

const input =
  "mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-ink shadow-xs placeholder:text-slate-400 focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20 focus:outline-none";
const label = "block text-sm font-medium text-slate-700";

/** Quote request. Nothing is stored: the message opens in WhatsApp (or the mail app). */
export function QuoteForm() {
  const [f, setF] = useState<Fields>(EMPTY);
  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => setF((s) => ({ ...s, [k]: v }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    window.open(whatsappUrl(compose(f)), "_blank", "noopener");
  };

  const mailHref = `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Demande de devis – ${f.equipment}`)}&body=${encodeURIComponent(compose(f))}`;

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h3 className="text-xl font-semibold text-navy-900">Demander un devis</h3>
      <p className="mt-1 text-sm text-slate-500">Décrivez la panne : nous vous répondons avec un diagnostic et un devis.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="q-name" className={label}>Nom *</label>
          <input id="q-name" required autoComplete="name" className={input} value={f.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label htmlFor="q-company" className={label}>Entreprise</label>
          <input id="q-company" autoComplete="organization" className={input} value={f.company} onChange={(e) => set("company", e.target.value)} />
        </div>
        <div>
          <label htmlFor="q-phone" className={label}>Téléphone</label>
          <input id="q-phone" type="tel" autoComplete="tel" inputMode="tel" className={input} value={f.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div>
          <label htmlFor="q-equipment" className={label}>Équipement</label>
          <select id="q-equipment" className={input} value={f.equipment} onChange={(e) => set("equipment", e.target.value)}>
            {EQUIPMENT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="q-model" className={label}>Marque et modèle</label>
          <input id="q-model" placeholder="ex. Schneider Altivar ATV320, 7,5 kW" className={input} value={f.model} onChange={(e) => set("model", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="q-message" className={label}>Description de la panne *</label>
          <textarea
            id="q-message"
            required
            rows={4}
            placeholder="Symptômes, code défaut affiché, depuis quand…"
            className={input}
            value={f.message}
            onChange={(e) => set("message", e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2.5 text-sm text-slate-700 sm:col-span-2">
          <input type="checkbox" className="size-4 accent-navy-900" checked={f.onSite} onChange={(e) => set("onSite", e.target.checked)} />
          Intervention sur site souhaitée
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn bg-[#25d366] text-white hover:bg-[#1ebe5b]">
          <Send className="size-4" />
          Envoyer via WhatsApp
        </button>
        <a href={mailHref} className="btn-outline">
          <Mail className="size-4" />
          Envoyer par e-mail
        </a>
      </div>
      <p className="mt-3 text-xs text-slate-400">Le message s’ouvre dans WhatsApp ou votre messagerie ; rien n’est enregistré sur ce site.</p>
    </form>
  );
}
