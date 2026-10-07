import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Info, Plus, X } from "lucide-react";
import { fromContactRow, SOCIAL_KEYS, whatsappDigits, type ContactRow, type Social, type SocialKey } from "../contact";
import { BrandIcon, type Brand } from "../ui/BrandIcon";
import { errorMessage, supabase } from "./supabase";
import { Button, Field, inputClass, Loading, Notice, PageHeader, Toggle, useFlash } from "./ui";

type Form = Omit<ContactRow, "social" | "whatsapp_button"> & {
  hours_en: string;
  hours_ar: string;
  notify: string[];
  cvFr: string;
  cvEn: string;
  social: Social;
  whatsappButton: boolean;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_OK = /^https?:\/\/\S+$/i;

const NETWORKS: Record<SocialKey, { brand: Brand; label: string; example: string }> = {
  facebook: { brand: "Facebook", label: "Facebook", example: "https://www.facebook.com/votre-page" },
  instagram: { brand: "Instagram", label: "Instagram", example: "https://www.instagram.com/votre-compte" },
  linkedin: { brand: "LinkedIn", label: "LinkedIn", example: "https://www.linkedin.com/in/votre-profil" },
  youtube: { brand: "YouTube", label: "YouTube", example: "https://www.youtube.com/@votre-chaine" },
  tiktok: { brand: "TikTok", label: "TikTok", example: "https://www.tiktok.com/@votre-compte" },
  github: { brand: "GitHub", label: "GitHub", example: "https://github.com/votre-compte" },
};

export default function Settings() {
  const flash = useFlash();
  const [form, setForm] = useState<Form | null>(null);
  const [saved, setSaved] = useState("");
  const [cvId, setCvId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  // Social links and the WhatsApp button need section 12 of supabase/admin.sql.
  const [hasSocial, setHasSocial] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("admin_settings").select("notify_emails").eq("id", 1).maybeSingle(),
      supabase.from("resume_links").select("id, url_fr, url_en").order("id").limit(1).maybeSingle(),
    ]).then(([site, admin, cv]) => {
      const err = site.error ?? admin.error;
      if (err) return setError(errorMessage(err));
      // Start from what the site shows today when a field was never set.
      const shown = fromContactRow(site.data ?? {});
      const f: Form = {
        email: site.data?.email ?? shown.email,
        phone: site.data?.phone ?? shown.phone,
        whatsapp: site.data?.whatsapp ?? shown.whatsapp,
        address: site.data?.address ?? shown.address,
        map_url: site.data?.map_url ?? shown.mapUrl,
        hours: site.data?.hours ?? shown.hours,
        hours_en: site.data?.hours_en ?? shown.hoursEn,
        hours_ar: site.data?.hours_ar ?? shown.hoursAr,
        notify: admin.data?.notify_emails ?? [],
        cvFr: cv.data?.url_fr ?? "",
        cvEn: cv.data?.url_en ?? "",
        social: { ...shown.social },
        whatsappButton: shown.whatsappButton,
      };
      setHasSocial(Boolean(site.data && "social" in site.data));
      setCvId(cv.data?.id ?? null);
      setForm(f);
      setSaved(JSON.stringify(f));
    });
  }, []);

  const dirty = useMemo(() => form !== null && JSON.stringify(form) !== saved, [form, saved]);
  if (error) return <Notice tone="error">{error}</Notice>;
  if (!form) return <Loading />;

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((s) => (s ? { ...s, [k]: v } : s));

  const addEmail = () => {
    const e = newEmail.trim().toLowerCase();
    if (!EMAIL.test(e)) return flash("Adresse e-mail invalide.", "error");
    if (!form.notify.includes(e)) set("notify", [...form.notify, e]);
    setNewEmail("");
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL.test(form.email.trim())) return flash("L’e-mail affiché sur le site est invalide.", "error");
    if (form.notify.length === 0) return flash("Gardez au moins une adresse pour recevoir les demandes.", "error");
    const badLink = SOCIAL_KEYS.find((k) => form.social[k].trim() && !URL_OK.test(form.social[k].trim()));
    if (badLink) return flash(`Lien ${NETWORKS[badLink].label} invalide : il doit commencer par https://`, "error");
    setBusy(true);
    const now = new Date().toISOString();
    const site = await supabase.from("site_settings").upsert({
      id: 1,
      email: form.email.trim(),
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim(),
      address: form.address.trim(),
      map_url: form.map_url.trim(),
      hours: form.hours.trim(),
      hours_en: form.hours_en.trim(),
      hours_ar: form.hours_ar.trim(),
      ...(hasSocial
        ? {
            social: Object.fromEntries(SOCIAL_KEYS.map((k) => [k, form.social[k].trim()])),
            whatsapp_button: form.whatsappButton,
          }
        : {}),
      updated_at: now,
    });
    const admin = await supabase.from("admin_settings").upsert({ id: 1, notify_emails: form.notify, updated_at: now });
    const cvRow = { url_fr: form.cvFr.trim() || null, url_en: form.cvEn.trim() || null, updated_at: now };
    const cv = cvId ? await supabase.from("resume_links").update(cvRow).eq("id", cvId) : await supabase.from("resume_links").insert(cvRow);
    setBusy(false);
    const err = site.error ?? admin.error ?? cv.error;
    if (err) return flash(errorMessage(err), "error");
    setSaved(JSON.stringify(form));
    flash("Paramètres enregistrés");
  };

  const wa = whatsappDigits(form.whatsapp || form.phone);

  return (
    <form onSubmit={save} className="pb-24">
      <PageHeader title="Paramètres" description="Coordonnées affichées sur le site et adresses qui reçoivent les demandes de devis." />

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="font-semibold text-navy-900">Coordonnées affichées sur le site</h2>
        <p className="mt-1 text-xs text-slate-500">En-tête, pied de page, page contact et boutons WhatsApp.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="E-mail de contact" htmlFor="c-email" className="sm:col-span-2">
            <input id="c-email" type="email" required className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Téléphone" htmlFor="c-phone">
            <input id="c-phone" type="tel" className={inputClass} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+213 778 46 16 82" />
          </Field>
          <Field label="WhatsApp" htmlFor="c-wa" hint={wa ? <>Lien : wa.me/{wa}</> : "Vide : le numéro de téléphone."}>
            <input id="c-wa" type="tel" className={inputClass} value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="Même numéro que le téléphone" />
          </Field>
          <Field label="Adresse" htmlFor="c-address" className="sm:col-span-2">
            <input id="c-address" className={inputClass} value={form.address} onChange={(e) => set("address", e.target.value)} />
          </Field>
          <Field label="Lien Google Maps" htmlFor="c-map" hint="Dans Google Maps : Partager → Copier le lien.">
            <input id="c-map" type="url" className={inputClass} value={form.map_url} onChange={(e) => set("map_url", e.target.value)} />
          </Field>
          <Field label="Horaires" htmlFor="c-hours">
            <input id="c-hours" className={inputClass} value={form.hours} onChange={(e) => set("hours", e.target.value)} />
          </Field>
          <Field label="Horaires (anglais)" htmlFor="c-hours-en">
            <input id="c-hours-en" lang="en" className={inputClass} value={form.hours_en} onChange={(e) => set("hours_en", e.target.value)} placeholder="Saturday – Thursday, 8 am – 5 pm" />
          </Field>
          <Field label="Horaires (arabe)" htmlFor="c-hours-ar">
            <input id="c-hours-ar" lang="ar" dir="rtl" className={inputClass} value={form.hours_ar} onChange={(e) => set("hours_ar", e.target.value)} placeholder="من السبت إلى الخميس، 8:00 – 17:00" />
          </Field>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="font-semibold text-navy-900">Réseaux sociaux et WhatsApp</h2>
        <p className="mt-1 text-xs text-slate-500">Icônes du pied de page, et liens donnés à Google pour reconnaître votre entreprise. Un champ vide n’est pas affiché.</p>
        {!hasSocial ? (
          <div className="mt-4">
            <Notice>Exécutez la section 12 de <code>supabase/admin.sql</code> dans Supabase pour modifier ces liens et le bouton WhatsApp.</Notice>
          </div>
        ) : (
          <>
            <div className="mt-4 rounded-lg bg-slate-50 p-4">
              <Toggle checked={form.whatsappButton} onChange={(v) => set("whatsappButton", v)} label="Bouton WhatsApp rond en bas de chaque page" />
              <p className="mt-1.5 ps-11 text-xs text-slate-500">Le moyen le plus rapide pour un client de vous écrire depuis son téléphone.</p>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {SOCIAL_KEYS.map((k) => (
                <Field key={k} label={NETWORKS[k].label} htmlFor={`c-social-${k}`}>
                  <div className="relative">
                    <BrandIcon name={NETWORKS[k].brand} className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id={`c-social-${k}`}
                      type="url"
                      className={`${inputClass} pl-9`}
                      value={form.social[k]}
                      onChange={(e) => set("social", { ...form.social, [k]: e.target.value })}
                      placeholder={NETWORKS[k].example}
                    />
                  </div>
                </Field>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="font-semibold text-navy-900">Recevoir les demandes de devis</h2>
        <p className="mt-1 text-xs text-slate-500">Chaque nouvelle demande est envoyée à ces adresses, et reste toujours visible dans Demandes.</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {form.notify.map((e) => (
            <li key={e} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 py-1 pr-1.5 pl-3 text-sm text-slate-800">
              {e}
              <button type="button" aria-label={`Retirer ${e}`} onClick={() => set("notify", form.notify.filter((x) => x !== e))} className="rounded-full p-0.5 text-slate-500 hover:bg-slate-200 hover:text-red-600">
                <X className="size-3.5" />
              </button>
            </li>
          ))}
          {form.notify.length === 0 && <li className="text-sm text-amber-700">Aucune adresse.</li>}
        </ul>
        <div className="mt-3 flex max-w-md gap-2">
          <input
            type="email"
            aria-label="Ajouter une adresse"
            placeholder="ajouter@gmail.com"
            className={inputClass}
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEmail())}
          />
          <Button onClick={addEmail} disabled={!newEmail.trim()}>
            <Plus className="size-4" /> Ajouter
          </Button>
        </div>
        <div className="mt-4 flex gap-2.5 rounded-lg bg-sky-50 px-4 py-3 text-xs leading-relaxed text-sky-900">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>
            Tant qu’aucun nom de domaine n’est vérifié dans Resend, seuls les envois vers l’adresse du compte Resend
            (moutie225@gmail.com) arrivent. Pour recevoir aussi sur une autre boîte, activez le transfert dans Gmail
            (Paramètres → Transfert et POP/IMAP), ou vérifiez votre domaine dans Resend.
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="font-semibold text-navy-900">CV (section À propos)</h2>
        <p className="mt-1 text-xs text-slate-500">Liens vers vos CV (Google Drive, PDF…). Vide : le bouton n’est pas affiché.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="CV en français" htmlFor="c-cvfr">
            <input id="c-cvfr" type="url" className={inputClass} value={form.cvFr} onChange={(e) => set("cvFr", e.target.value)} placeholder="https://…" />
          </Field>
          <Field label="CV en anglais" htmlFor="c-cven">
            <input id="c-cven" type="url" className={inputClass} value={form.cvEn} onChange={(e) => set("cvEn", e.target.value)} placeholder="https://…" />
          </Field>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur lg:left-60">
        <div className="mx-auto flex max-w-5xl items-center justify-end gap-3 px-4 py-3 sm:px-6 lg:px-10">
          {dirty && <span className="hidden text-sm text-amber-700 sm:inline">Modifications non enregistrées</span>}
          <Button type="submit" variant="primary" loading={busy} disabled={!dirty}>
            Enregistrer
          </Button>
        </div>
      </div>
    </form>
  );
}
