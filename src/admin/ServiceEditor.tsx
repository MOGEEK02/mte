import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImagePlus, Trash2 } from "lucide-react";
import { DEFAULT_SERVICES, fromRow, type ServiceRow } from "../services";
import { compressImage } from "./image";
import { slugify } from "./slug";
import { BUCKET, errorMessage, storagePath, supabase } from "./supabase";
import { Button, Field, inputClass, Loading, Notice, PageHeader, Toggle, useFlash } from "./ui";
import { AiAssist } from "./AiAssist";

type Form = {
  title: string;
  slug: string;
  summary: string;
  tagline: string;
  titleEn: string;
  summaryEn: string;
  taglineEn: string;
  titleAr: string;
  summaryAr: string;
  taglineAr: string;
  image: string;
  published: boolean;
};

const EMPTY: Form = { title: "", slug: "", summary: "", tagline: "", titleEn: "", summaryEn: "", taglineEn: "", titleAr: "", summaryAr: "", taglineAr: "", image: "", published: true };

/** Photos already on the site, to pick without uploading. */
const SITE_PHOTOS = [
  ...new Set([...DEFAULT_SERVICES.map((s) => s.image), "/images/web/capteurs.webp", "/images/web/hero.webp"]),
];

export default function ServiceEditor() {
  const { slug: param = "nouveau" } = useParams();
  const isNew = param === "nouveau";
  const navigate = useNavigate();
  const flash = useFlash();
  const [form, setForm] = useState<Form>(EMPTY);
  const [saved, setSaved] = useState(JSON.stringify(EMPTY));
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"" | "save" | "delete" | "upload">("");
  const fileInput = useRef<HTMLInputElement>(null);

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
        const r = data as ServiceRow;
        // English starts from the built-in translation when the database has none yet.
        const { en, ar } = fromRow(r);
        const f: Form = {
          title: r.title,
          slug: r.slug,
          summary: r.summary,
          tagline: r.tagline ?? "",
          titleEn: r.title_en ?? (en.title !== r.title ? en.title : ""),
          summaryEn: r.summary_en ?? (en.summary !== r.summary ? en.summary : ""),
          taglineEn: r.tagline_en ?? (en.tagline !== (r.tagline ?? "") ? en.tagline : ""),
          titleAr: r.title_ar ?? (ar.title !== r.title ? ar.title : ""),
          summaryAr: r.summary_ar ?? (ar.summary !== r.summary ? ar.summary : ""),
          taglineAr: r.tagline_ar ?? (ar.tagline !== (r.tagline ?? "") ? ar.tagline : ""),
          image: fromRow(r).image,
          published: r.published,
        };
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

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setBusy("upload");
    try {
      const blob = await compressImage(file, 1400);
      const path = `services/${form.slug || slugify(form.title) || "service"}-${Date.now()}.${blob.type === "image/webp" ? "webp" : "jpg"}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: blob.type, cacheControl: "31536000" });
      if (error) throw error;
      set("image", supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
    } catch (e) {
      flash(errorMessage(e as { message?: string; code?: string }) || "Image illisible", "error");
    } finally {
      setBusy("");
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const save = async () => {
    if (!form.title.trim()) return flash("Le titre est obligatoire.", "error");
    const slug = isNew ? slugify(form.slug || form.title) : param;
    if (!slug) return flash("Le titre doit contenir des lettres.", "error");
    setBusy("save");
    const before = JSON.parse(saved) as Form;
    const row = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      tagline: form.tagline.trim(),
      title_en: form.titleEn.trim(),
      summary_en: form.summaryEn.trim(),
      tagline_en: form.taglineEn.trim(),
      title_ar: form.titleAr.trim(),
      summary_ar: form.summaryAr.trim(),
      tagline_ar: form.taglineAr.trim(),
      image: form.image,
      published: form.published,
      updated_at: new Date().toISOString(),
    };
    let error;
    if (isNew) {
      const { data: last } = await supabase.from("services").select("sort_order").order("sort_order", { ascending: false }).limit(1);
      ({ error } = await supabase.from("services").insert({ ...row, slug, sort_order: (last?.[0]?.sort_order ?? 0) + 10 }));
    } else {
      ({ error } = await supabase.from("services").update(row).eq("slug", param));
    }
    setBusy("");
    if (error) return flash(errorMessage(error), "error");
    // An uploaded photo that was replaced is no longer used.
    const old = !isNew && before.image !== form.image ? storagePath(before.image) : null;
    if (old) await supabase.storage.from(BUCKET).remove([old]);
    flash("Service enregistré");
    setSaved(JSON.stringify(form));
    if (isNew) navigate(`/admin/services/${slug}`, { replace: true });
  };

  const remove = async () => {
    if (!window.confirm(`Supprimer le service « ${form.title} » ?`)) return;
    setBusy("delete");
    const { error } = await supabase.from("services").delete().eq("slug", param);
    if (error) {
      setBusy("");
      return flash(errorMessage(error), "error");
    }
    const path = storagePath(form.image);
    if (path) await supabase.storage.from(BUCKET).remove([path]);
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
        <PageHeader title={isNew ? "Nouveau service" : form.title || "Service"} description="Une carte de la section Services de la page d’accueil." />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <Field label="Titre *" htmlFor="s-title" action={<AiAssist value={form.title} onApply={(v) => set("title", v)} lang="fr" field="title" />}>
            <input id="s-title" className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="Texte" htmlFor="s-summary" action={<AiAssist value={form.summary} onApply={(v) => set("summary", v)} lang="fr" field="text" />} hint="Deux ou trois lignes : ce que vous faites et pour qui.">
            <textarea id="s-summary" rows={5} className={inputClass} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
          </Field>
          <Field label="Ligne du bas" htmlFor="s-tagline" action={<AiAssist value={form.tagline} onApply={(v) => set("tagline", v)} lang="fr" field="short" />} hint="Marques ou précision, ex. « ABB · Schneider · Siemens ».">
            <input id="s-tagline" className={inputClass} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </Field>
          <Toggle checked={form.published} onChange={(v) => set("published", v)} label={form.published ? "Visible sur le site" : "Masqué du site"} />
        </section>

        <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-start-1">
          <div>
            <h2 className="font-semibold text-navy-900">Version anglaise (/en)</h2>
            <p className="mt-0.5 text-xs text-slate-500">Affichée sur le site en anglais. Vide : le texte français est utilisé.</p>
          </div>
          <Field label="Title" htmlFor="s-title-en" action={<AiAssist value={form.titleEn} onApply={(v) => set("titleEn", v)} lang="en" field="title" source={form.title} />}>
            <input id="s-title-en" lang="en" className={inputClass} value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} placeholder={form.title} />
          </Field>
          <Field label="Text" htmlFor="s-summary-en" action={<AiAssist value={form.summaryEn} onApply={(v) => set("summaryEn", v)} lang="en" field="text" source={form.summary} />}>
            <textarea id="s-summary-en" lang="en" rows={4} className={inputClass} value={form.summaryEn} onChange={(e) => set("summaryEn", e.target.value)} />
          </Field>
          <Field label="Bottom line" htmlFor="s-tagline-en" action={<AiAssist value={form.taglineEn} onApply={(v) => set("taglineEn", v)} lang="en" field="short" source={form.tagline} />}>
            <input id="s-tagline-en" lang="en" className={inputClass} value={form.taglineEn} onChange={(e) => set("taglineEn", e.target.value)} placeholder={form.tagline} />
          </Field>
        </section>

        <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-start-1">
          <div>
            <h2 className="font-semibold text-navy-900">Version arabe (/ar)</h2>
            <p className="mt-0.5 text-xs text-slate-500">Affichée sur le site en arabe. Vide : le texte français est utilisé.</p>
          </div>
          <Field label="العنوان" htmlFor="s-title-ar" action={<AiAssist value={form.titleAr} onApply={(v) => set("titleAr", v)} lang="ar" field="title" source={form.title} />}>
            <input id="s-title-ar" lang="ar" dir="rtl" className={inputClass} value={form.titleAr} onChange={(e) => set("titleAr", e.target.value)} />
          </Field>
          <Field label="النص" htmlFor="s-summary-ar" action={<AiAssist value={form.summaryAr} onApply={(v) => set("summaryAr", v)} lang="ar" field="text" source={form.summary} />}>
            <textarea id="s-summary-ar" lang="ar" dir="rtl" rows={4} className={inputClass} value={form.summaryAr} onChange={(e) => set("summaryAr", e.target.value)} />
          </Field>
          <Field label="السطر السفلي" htmlFor="s-tagline-ar" action={<AiAssist value={form.taglineAr} onApply={(v) => set("taglineAr", v)} lang="ar" field="short" source={form.tagline} />}>
            <input id="s-tagline-ar" lang="ar" dir="rtl" className={inputClass} value={form.taglineAr} onChange={(e) => set("taglineAr", e.target.value)} placeholder={form.tagline} />
          </Field>
        </section>

        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 lg:self-start">
          <h2 className="text-sm font-medium text-slate-700">Photo</h2>
          <div className="aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
            {form.image ? (
              <img src={form.image} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-sm text-slate-400">Aucune photo</div>
            )}
          </div>
          <Button onClick={() => fileInput.current?.click()} loading={busy === "upload"} className="w-full">
            <ImagePlus className="size-4" /> Envoyer une photo
          </Button>
          <input ref={fileInput} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0])} />
          <div>
            <p className="text-xs text-slate-500">Ou choisir une photo du site :</p>
            <ul className="mt-2 grid grid-cols-4 gap-2">
              {SITE_PHOTOS.map((src) => (
                <li key={src}>
                  <button
                    type="button"
                    onClick={() => set("image", src)}
                    aria-label="Choisir cette photo"
                    className={`block aspect-[4/3] w-full overflow-hidden rounded-md ring-2 ${form.image === src ? "ring-brand" : "ring-transparent hover:ring-slate-300"}`}
                  >
                    <img src={src} alt="" loading="lazy" className="size-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Preview of the card */}
      <section className="mt-6">
        <h2 className="text-sm font-medium text-slate-700">Aperçu</h2>
        <div className="mt-3 max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="aspect-[16/10] bg-slate-100">{form.image && <img src={form.image} alt="" className="size-full object-cover" />}</div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-navy-900">{form.title || "Titre du service"}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{form.summary || "Texte du service."}</p>
            {form.tagline && <p className="mt-4 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">{form.tagline}</p>}
          </div>
        </div>
      </section>

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
            <Button variant="primary" onClick={save} loading={busy === "save"} disabled={busy !== "" || (!dirty && !isNew)}>
              {isNew ? "Créer le service" : "Enregistrer"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
