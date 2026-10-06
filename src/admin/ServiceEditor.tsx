import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowDown, ArrowLeft, ArrowUp, ExternalLink, Plus, Trash2, X } from "lucide-react";
import { ART_KINDS, type ArtKind, type ServiceRow } from "../services";
import { REQUEST_TYPES } from "../site";
import { ServiceArt } from "../ui/ServiceArt";
import { errorMessage, supabase } from "./supabase";
import { Button, Field, inputClass, Loading, Notice, PageHeader, Toggle, useFlash } from "./ui";

type Form = {
  title: string;
  slug: string;
  summary: string;
  art: ArtKind;
  intro: string;
  specialtiesTitle: string;
  specialties: string;
  sections: { key: string; title: string; text: string }[];
  keywords: string;
  requestType: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
};

const EMPTY: Form = {
  title: "",
  slug: "",
  summary: "",
  art: "ladder",
  intro: "",
  specialtiesTitle: "Ce que nous faisons",
  specialties: "",
  sections: [],
  keywords: "",
  requestType: REQUEST_TYPES[0],
  seoTitle: "",
  seoDescription: "",
  published: true,
};

const paragraphs = (text: string) => text.split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean);
const lines = (text: string) => text.split("\n").map((l) => l.trim()).filter(Boolean);
const key = () => Math.random().toString(36).slice(2);

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function toForm(r: ServiceRow): Form {
  return {
    title: r.title,
    slug: r.slug,
    summary: r.summary,
    art: r.art,
    intro: (r.intro ?? []).join("\n\n"),
    specialtiesTitle: r.specialties_title,
    specialties: (r.specialties ?? []).join("\n"),
    sections: (r.sections ?? []).map((s) => ({ key: key(), title: s.title, text: s.paragraphs.join("\n\n") })),
    keywords: (r.keywords ?? []).join(", "),
    requestType: r.request_type,
    seoTitle: r.seo_title,
    seoDescription: r.seo_description,
    published: r.published,
  };
}

function Counter({ value, max }: { value: string; max: number }) {
  return <span className={value.length > max ? "text-amber-700" : ""}>{value.length} / {max} caractères</span>;
}

export default function ServiceEditor() {
  const { slug: param = "nouveau" } = useParams();
  const isNew = param === "nouveau";
  const navigate = useNavigate();
  const flash = useFlash();
  const [form, setForm] = useState<Form>(EMPTY);
  const [saved, setSaved] = useState(JSON.stringify(EMPTY));
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"" | "save" | "delete">("");

  useEffect(() => {
    if (isNew) return;
    supabase
      .from("services")
      .select("*")
      .eq("slug", param)
      .maybeSingle()
      .then(({ data, error }) => {
        setLoading(false);
        if (error) return setError(errorMessage(error));
        if (!data) return setError("Service introuvable.");
        const f = toForm(data as ServiceRow);
        setForm(f);
        setSaved(JSON.stringify(f));
      });
  }, [param, isNew]);

  const dirty = useMemo(() => JSON.stringify(form) !== saved, [form, saved]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((s) => ({ ...s, [k]: v }));
  const setTitle = (title: string) => setForm((s) => ({ ...s, title, slug: isNew && !slugTouched ? slugify(title) : s.slug }));
  const setSection = (i: number, patch: Partial<Form["sections"][number]>) =>
    setForm((s) => ({ ...s, sections: s.sections.map((x, k) => (k === i ? { ...x, ...patch } : x)) }));
  const moveSection = (i: number, d: -1 | 1) =>
    setForm((s) => {
      const j = i + d;
      if (j < 0 || j >= s.sections.length) return s;
      const next = [...s.sections];
      [next[i], next[j]] = [next[j], next[i]];
      return { ...s, sections: next };
    });

  const save = async () => {
    if (!form.title.trim()) return flash("Le titre est obligatoire.", "error");
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(form.slug)) return flash("Adresse invalide : lettres minuscules, chiffres et tirets.", "error");
    setBusy("save");
    const row = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      art: form.art,
      intro: paragraphs(form.intro),
      specialties_title: form.specialtiesTitle.trim() || "Ce que nous faisons",
      specialties: lines(form.specialties),
      sections: form.sections
        .map((s) => ({ title: s.title.trim(), paragraphs: paragraphs(s.text) }))
        .filter((s) => s.title || s.paragraphs.length),
      keywords: form.keywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean),
      request_type: form.requestType,
      seo_title: form.seoTitle.trim(),
      seo_description: form.seoDescription.trim(),
      published: form.published,
      updated_at: new Date().toISOString(),
    };
    let error;
    if (isNew) {
      const { data: last } = await supabase.from("services").select("sort_order").order("sort_order", { ascending: false }).limit(1);
      ({ error } = await supabase.from("services").insert({ ...row, slug: form.slug, sort_order: (last?.[0]?.sort_order ?? 0) + 10 }));
    } else {
      ({ error } = await supabase.from("services").update(row).eq("slug", param));
    }
    setBusy("");
    if (error) return flash(errorMessage(error), "error");
    flash("Service enregistré");
    setSaved(JSON.stringify(form));
    if (isNew) navigate(`/admin/services/${form.slug}`, { replace: true });
  };

  const remove = async () => {
    if (!window.confirm(`Supprimer le service « ${form.title} » ? Sa page disparaîtra du site.`)) return;
    setBusy("delete");
    await supabase.from("portfolio").update({ service_slug: null }).eq("service_slug", param);
    const { error } = await supabase.from("services").delete().eq("slug", param);
    if (error) {
      setBusy("");
      return flash(errorMessage(error), "error");
    }
    flash("Service supprimé");
    setSaved(JSON.stringify(form));
    navigate("/admin/services");
  };

  if (loading) return <Loading />;
  if (error) return <Notice tone="error">{error}</Notice>;

  return (
    <div className="pb-24">
      <Link to="/admin/services" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900">
        <ArrowLeft className="size-4" /> Services
      </Link>
      <div className="mt-3">
        <PageHeader
          title={isNew ? "Nouveau service" : form.title || "Service"}
          actions={
            !isNew && (
              <a href={`/services/${param}`} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50">
                <ExternalLink className="size-4" /> Voir la page
              </a>
            )
          }
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <Field label="Titre *" htmlFor="s-title">
              <input id="s-title" className={inputClass} value={form.title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <Field
              label="Adresse de la page"
              htmlFor="s-slug"
              hint={isNew ? "Choisie à la création, elle ne change plus ensuite (les liens partagés restent valides)." : "L’adresse ne change pas après la création."}
            >
              <div className="flex items-center rounded-md border border-slate-300 bg-slate-50 pl-3 text-sm text-slate-500 focus-within:border-navy-700">
                /services/
                <input
                  id="s-slug"
                  disabled={!isNew}
                  className="min-w-0 flex-1 bg-white px-2 py-2 font-mono text-sm text-ink outline-none disabled:bg-slate-50 disabled:text-slate-500"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", slugify(e.target.value));
                  }}
                />
              </div>
            </Field>
            <Field label="Résumé" htmlFor="s-summary" hint="Affiché sur la carte du service et en haut de sa page.">
              <textarea id="s-summary" rows={3} className={inputClass} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
            </Field>
            <Field label="Introduction" htmlFor="s-intro" hint="Laissez une ligne vide entre deux paragraphes.">
              <textarea id="s-intro" rows={7} className={inputClass} value={form.intro} onChange={(e) => set("intro", e.target.value)} />
            </Field>
          </section>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-navy-900">Sections de la page</h2>
              <Button size="sm" onClick={() => set("sections", [...form.sections, { key: key(), title: "", text: "" }])}>
                <Plus className="size-3.5" /> Ajouter une section
              </Button>
            </div>
            {form.sections.length === 0 && <p className="text-sm text-slate-500">Aucune section.</p>}
            {form.sections.map((s, i) => (
              <div key={s.key} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-2">
                  <input aria-label="Titre de la section" placeholder="Titre de la section" className={`${inputClass} font-medium`} value={s.title} onChange={(e) => setSection(i, { title: e.target.value })} />
                  <button type="button" aria-label="Monter" disabled={i === 0} onClick={() => moveSection(i, -1)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30"><ArrowUp className="size-4" /></button>
                  <button type="button" aria-label="Descendre" disabled={i === form.sections.length - 1} onClick={() => moveSection(i, 1)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30"><ArrowDown className="size-4" /></button>
                  <button type="button" aria-label="Supprimer la section" onClick={() => set("sections", form.sections.filter((x) => x.key !== s.key))} className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><X className="size-4" /></button>
                </div>
                <textarea aria-label="Texte de la section" rows={4} className={`${inputClass} mt-2`} value={s.text} onChange={(e) => setSection(i, { text: e.target.value })} />
              </div>
            ))}
          </section>

          <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="font-semibold text-navy-900">Référencement Google</h2>
            <Field label="Titre pour Google" htmlFor="s-seo-title" hint={<><Counter value={form.seoTitle} max={65} /> — vide : « {form.title || "Titre"} | MTE Algérie »</>}>
              <input id="s-seo-title" className={inputClass} value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
            </Field>
            <Field label="Description pour Google" htmlFor="s-seo-desc" hint={<><Counter value={form.seoDescription} max={160} /> — vide : le résumé</>}>
              <textarea id="s-seo-desc" rows={3} className={inputClass} value={form.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} />
            </Field>
          </section>
        </div>

        <div className="space-y-6 lg:self-start">
          <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <Toggle checked={form.published} onChange={(v) => set("published", v)} label={form.published ? "Visible sur le site" : "Masqué du site"} />
            <Field label="Illustration" htmlFor="s-art">
              <select id="s-art" className={inputClass} value={form.art} onChange={(e) => set("art", e.target.value as ArtKind)}>
                {ART_KINDS.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </Field>
            <ServiceArt kind={form.art} className="aspect-[5/3] rounded-lg" />
          </section>
          <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <Field label="Titre de la liste" htmlFor="s-spec-title">
              <input id="s-spec-title" className={inputClass} value={form.specialtiesTitle} onChange={(e) => set("specialtiesTitle", e.target.value)} />
            </Field>
            <Field label="Points de la liste" htmlFor="s-spec" hint="Un point par ligne.">
              <textarea id="s-spec" rows={7} className={inputClass} value={form.specialties} onChange={(e) => set("specialties", e.target.value)} />
            </Field>
            <Field label="Type de besoin du formulaire" htmlFor="s-req" hint="Présélectionné dans le formulaire de devis de cette page.">
              <select id="s-req" className={inputClass} value={form.requestType} onChange={(e) => set("requestType", e.target.value)}>
                {REQUEST_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Mots-clés" htmlFor="s-kw" hint="Séparés par des virgules. Servent à proposer des réalisations liées à ce service.">
              <input id="s-kw" className={inputClass} value={form.keywords} onChange={(e) => set("keywords", e.target.value)} />
            </Field>
          </section>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur lg:left-60">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <div>
            {!isNew && (
              <Button variant="danger" onClick={remove} loading={busy === "delete"} disabled={busy === "save"}>
                <Trash2 className="size-4" /> <span className="hidden sm:inline">Supprimer</span>
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {dirty && <span className="hidden text-sm text-amber-700 sm:inline">Modifications non enregistrées</span>}
            <Button variant="primary" onClick={save} loading={busy === "save"} disabled={busy === "delete" || (!dirty && !isNew)}>
              {isNew ? "Créer le service" : "Enregistrer"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
