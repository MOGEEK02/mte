import { useEffect, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Info, Pencil, Plus, Star, Trash2 } from "lucide-react";
import type { Lang } from "../i18n";
import type { Testimonial } from "../testimonials";
import { errorMessage, isMissingSetup, supabase } from "./supabase";
import { Button, Card, Field, inputClass, langProps, Loading, Notice, PageHeader, Toggle, useFlash } from "./ui";

type Row = Testimonial & { published: boolean; sort_order: number };
type Form = { name: string; company: string; city: string; quote: string; lang: Lang; rating: number | null; published: boolean };

const EMPTY: Form = { name: "", company: "", city: "", quote: "", lang: "fr", rating: 5, published: true };
const LANG_LABEL: Record<Lang, string> = { fr: "Français", en: "Anglais", ar: "Arabe" };

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`size-3.5 ${n <= rating ? "text-brand" : "text-slate-200"}`} fill="currentColor" />
      ))}
    </span>
  );
}

function Editor({ initial, busy, onSave, onCancel }: { initial: Form; busy: boolean; onSave: (f: Form) => void; onCancel: () => void }) {
  const [f, setF] = useState<Form>(initial);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((s) => ({ ...s, [k]: v }));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSave(f);
  };
  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <Field label="Nom du client *" htmlFor="t-name" hint="Prénom et initiale suffisent, ex. « Karim B. ».">
        <input id="t-name" required maxLength={120} className={inputClass} value={f.name} onChange={(e) => set("name", e.target.value)} dir="auto" />
      </Field>
      <Field label="Entreprise" htmlFor="t-company">
        <input id="t-company" maxLength={160} className={inputClass} value={f.company} onChange={(e) => set("company", e.target.value)} dir="auto" />
      </Field>
      <Field label="Ville ou wilaya" htmlFor="t-city">
        <input id="t-city" maxLength={80} className={inputClass} value={f.city} onChange={(e) => set("city", e.target.value)} dir="auto" placeholder="ex. Blida" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Langue de l’avis" htmlFor="t-lang">
          <select id="t-lang" className={inputClass} value={f.lang} onChange={(e) => set("lang", e.target.value as Lang)}>
            {(Object.keys(LANG_LABEL) as Lang[]).map((l) => (
              <option key={l} value={l}>{LANG_LABEL[l]}</option>
            ))}
          </select>
        </Field>
        <Field label="Note" htmlFor="t-rating">
          <select id="t-rating" className={inputClass} value={f.rating ?? ""} onChange={(e) => set("rating", e.target.value ? Number(e.target.value) : null)}>
            <option value="">Sans note</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{"★".repeat(n)} ({n}/5)</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Avis *" htmlFor="t-quote" className="sm:col-span-2" hint="Les mots du client, tels qu’il les a écrits (WhatsApp, e-mail…). Affiché dans toutes les versions du site.">
        <textarea id="t-quote" required rows={4} maxLength={1500} className={inputClass} value={f.quote} onChange={(e) => set("quote", e.target.value)} {...langProps(f.lang)} />
      </Field>
      <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
        <Toggle checked={f.published} onChange={(v) => set("published", v)} label={f.published ? "Visible sur le site" : "Masqué du site"} />
        <div className="flex gap-2">
          <Button onClick={onCancel}>Annuler</Button>
          <Button type="submit" variant="primary" loading={busy}>
            Enregistrer l’avis
          </Button>
        </div>
      </div>
    </form>
  );
}

export default function ReviewsAdmin() {
  const flash = useFlash();
  const [items, setItems] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("*")
      .order("sort_order")
      .order("id")
      .then(({ data, error }) => (error ? setError(isMissingSetup(error) ? "setup" : errorMessage(error)) : setItems(data as Row[])));
  }, []);

  if (error === "setup")
    return (
      <div>
        <PageHeader title="Avis clients" />
        <div className="mt-6">
          <Notice>
            Pour ajouter des avis, exécutez d’abord la section 12 de <code>supabase/admin.sql</code> dans Supabase → SQL Editor.
          </Notice>
        </div>
      </div>
    );

  const save = async (f: Form) => {
    const row = {
      name: f.name.trim(),
      company: f.company.trim(),
      city: f.city.trim(),
      quote: f.quote.trim(),
      lang: f.lang,
      rating: f.rating,
      published: f.published,
      updated_at: new Date().toISOString(),
    };
    if (!row.name || !row.quote) return flash("Le nom et l’avis sont obligatoires.", "error");
    setBusy(true);
    if (editing === "new") {
      const sort_order = Math.max(0, ...(items ?? []).map((r) => r.sort_order)) + 10;
      const { data, error } = await supabase.from("testimonials").insert({ ...row, sort_order }).select().single();
      setBusy(false);
      if (error) return flash(errorMessage(error), "error");
      setItems((s) => [...(s ?? []), data as Row]);
      flash("Avis ajouté");
    } else if (editing) {
      const { error } = await supabase.from("testimonials").update(row).eq("id", editing.id);
      setBusy(false);
      if (error) return flash(errorMessage(error), "error");
      setItems((s) => s!.map((r) => (r.id === editing.id ? { ...r, ...row } : r)));
      flash("Avis enregistré");
    }
    setEditing(null);
  };

  const setPublished = async (r: Row, published: boolean) => {
    setItems((s) => s!.map((x) => (x.id === r.id ? { ...x, published } : x)));
    const { error } = await supabase.from("testimonials").update({ published, updated_at: new Date().toISOString() }).eq("id", r.id);
    if (error) {
      setItems((s) => s!.map((x) => (x.id === r.id ? { ...x, published: !published } : x)));
      return flash(errorMessage(error), "error");
    }
    flash(published ? "Avis visible sur le site" : "Avis masqué du site");
  };

  const move = async (i: number, d: -1 | 1) => {
    const list = [...items!];
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    const ordered = list.map((r, k) => ({ ...r, sort_order: (k + 1) * 10 }));
    setItems(ordered);
    const now = new Date().toISOString();
    for (const r of ordered) {
      const { error } = await supabase.from("testimonials").update({ sort_order: r.sort_order, updated_at: now }).eq("id", r.id);
      if (error) return flash(errorMessage(error), "error");
    }
    flash("Ordre enregistré");
  };

  const remove = async (r: Row) => {
    if (!window.confirm(`Supprimer l’avis de ${r.name} ?`)) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", r.id);
    if (error) return flash(errorMessage(error), "error");
    setItems((s) => s!.filter((x) => x.id !== r.id));
    flash("Avis supprimé");
  };

  return (
    <div>
      <PageHeader
        title="Avis clients"
        description="Section « Ce que disent nos clients » de l’accueil, dans cet ordre. Elle n’apparaît qu’avec au moins un avis visible."
        actions={
          <Button variant="primary" onClick={() => setEditing("new")} disabled={editing !== null}>
            <Plus className="size-4" /> Ajouter un avis
          </Button>
        }
      />
      <div className="mt-6 flex gap-2.5 rounded-lg bg-sky-50 px-4 py-3 text-xs leading-relaxed text-sky-900">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>Publiez uniquement de vrais avis, avec l’accord du client. Une capture d’écran du message d’origine, gardée de votre côté, peut servir de preuve.</p>
      </div>

      {editing !== null && (
        <Card className="mt-6" title={editing === "new" ? "Nouvel avis" : `Modifier l’avis de ${editing.name}`}>
          <Editor
            key={editing === "new" ? "new" : editing.id}
            initial={editing === "new" ? EMPTY : { ...editing, rating: editing.rating ?? null }}
            busy={busy}
            onSave={save}
            onCancel={() => setEditing(null)}
          />
        </Card>
      )}

      {error && <div className="mt-6"><Notice tone="error">{error}</Notice></div>}
      {!items && !error && <Loading />}
      {items && (
        <ul className="mt-6 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {items.length === 0 && <li className="p-8 text-center text-sm text-slate-500">Aucun avis pour l’instant. Ajoutez le premier avec le bouton ci-dessus.</li>}
          {items.map((r, i) => (
            <li key={r.id} className={`flex items-start gap-4 p-4 ${r.published ? "" : "bg-slate-50"}`}>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-navy-900" dir="auto">{r.name}</span>
                  {r.rating ? <Stars rating={r.rating} /> : null}
                  <span className="rounded bg-slate-100 px-1.5 text-[10px] font-semibold text-slate-500 uppercase">{r.lang}</span>
                  {!r.published && <span className="rounded bg-slate-200 px-1.5 text-[10px] font-semibold text-slate-600">Masqué</span>}
                </div>
                {(r.company || r.city) && <p className="text-xs text-slate-500" dir="auto">{[r.company, r.city].filter(Boolean).join(" · ")}</p>}
                <p className="mt-1.5 line-clamp-3 text-sm text-slate-600" {...langProps(r.lang)}>{r.quote}</p>
              </div>
              <div className="hidden pt-1 md:block">
                <Toggle checked={r.published} onChange={(v) => setPublished(r, v)} label="Visible" />
              </div>
              <div className="flex shrink-0 flex-wrap justify-end">
                <button type="button" aria-label="Monter" disabled={i === 0} onClick={() => move(i, -1)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30">
                  <ArrowUp className="size-4" />
                </button>
                <button type="button" aria-label="Descendre" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30">
                  <ArrowDown className="size-4" />
                </button>
                <button type="button" aria-label="Modifier" onClick={() => setEditing(r)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-navy-900">
                  <Pencil className="size-4" />
                </button>
                <button type="button" aria-label="Supprimer" onClick={() => remove(r)} className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
