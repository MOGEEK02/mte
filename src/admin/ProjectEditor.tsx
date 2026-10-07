import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, Film, ImagePlus, Link2, Trash2, X } from "lucide-react";
import { stillImage, type PortfolioItem } from "../portfolio";
import { isVideoMedia } from "../utils/imageOptimizer";
import { compressImage } from "./image";
import { slugify } from "./slug";
import { BUCKET, errorMessage, storagePath, supabase } from "./supabase";
import { Button, Field, inputClass, Loading, Notice, PageHeader, Toggle, useFlash } from "./ui";
import { AiAssist } from "./AiAssist";

type MediaDraft = {
  key: string;
  id?: number;
  media_url: string;
  media_type: "image" | "video";
  /** Photo chosen on this device, uploaded on save. */
  file?: Blob;
  preview?: string;
};

type Form = {
  title: string;
  date: string;
  description: string;
  slug: string;
  titleEn: string;
  descriptionEn: string;
  titleAr: string;
  descriptionAr: string;
  published: boolean;
  featured: boolean;
};

const today = () => new Date().toISOString().slice(0, 10);
const newKey = () => Math.random().toString(36).slice(2);

function thumbFor(m: MediaDraft) {
  return m.preview ?? stillImage({ id: m.id ?? 0, media_url: m.media_url, media_type: m.media_type, sort_order: 0 });
}

export default function ProjectEditor() {
  const { id = "nouveau" } = useParams();
  const isNew = id === "nouveau";
  const navigate = useNavigate();
  const flash = useFlash();

  const [original, setOriginal] = useState<PortfolioItem | null>(null);
  const [form, setForm] = useState<Form>({ title: "", date: today(), description: "", slug: "", titleEn: "", descriptionEn: "", titleAr: "", descriptionAr: "", published: true, featured: false });
  const [media, setMedia] = useState<MediaDraft[]>([]);
  const [saved, setSaved] = useState<string>("");
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"" | "save" | "delete">("");
  const [link, setLink] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const snapshot = (f: Form, m: MediaDraft[]) => JSON.stringify([f, m.map((x) => x.key)]);

  useEffect(() => {
    if (isNew) {
      setSaved(snapshot({ title: "", date: today(), description: "", slug: "", titleEn: "", descriptionEn: "", titleAr: "", descriptionAr: "", published: true, featured: false }, []));
      return;
    }
    supabase
      .from("portfolio")
      .select("*, portfolio_media(id, media_url, media_type, sort_order)")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error }) => {
        setLoading(false);
        if (error) return setError(errorMessage(error));
        if (!data) return setError("Projet introuvable.");
        const p = data as PortfolioItem;
        const f: Form = {
          title: p.title ?? "",
          date: (p.created_at ?? "").slice(0, 10) || today(),
          description: p.description ?? "",
          slug: p.slug ?? "",
          titleEn: p.title_en ?? "",
          descriptionEn: p.description_en ?? "",
          titleAr: p.title_ar ?? "",
          descriptionAr: p.description_ar ?? "",
          published: p.published !== false,
          featured: Boolean(p.featured),
        };
        const m: MediaDraft[] = [...(p.portfolio_media ?? [])]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((x) => ({ key: `db-${x.id}`, id: x.id, media_url: x.media_url, media_type: isVideoMedia(x.media_url, x.media_type) ? "video" : "image" }));
        setOriginal(p);
        setForm(f);
        setMedia(m);
        setSaved(snapshot(f, m));
      });
  }, [id, isNew]);

  const dirty = useMemo(() => saved !== "" && snapshot(form, media) !== saved, [form, media, saved]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((s) => ({ ...s, [k]: v }));

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const drafts: MediaDraft[] = [];
    for (const file of Array.from(files).slice(0, 20)) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const blob = await compressImage(file);
        drafts.push({ key: newKey(), media_url: "", media_type: "image", file: blob, preview: URL.createObjectURL(blob) });
      } catch {
        flash(`Image illisible : ${file.name}`, "error");
      }
    }
    setMedia((s) => [...s, ...drafts]);
    if (fileInput.current) fileInput.current.value = "";
  };

  const addLink = () => {
    const url = link.trim();
    if (!/^https?:\/\//i.test(url)) return flash("Collez un lien complet (https://…)", "error");
    setMedia((s) => [...s, { key: newKey(), media_url: url, media_type: isVideoMedia(url) ? "video" : "image" }]);
    setLink("");
  };

  const move = (i: number, d: -1 | 1) =>
    setMedia((s) => {
      const j = i + d;
      if (j < 0 || j >= s.length) return s;
      const next = [...s];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const save = async () => {
    if (!form.title.trim()) return flash("Le titre est obligatoire.", "error");
    const slug = slugify(form.slug || form.titleEn || form.title);
    if (!slug) return flash("Adresse de la page invalide.", "error");
    setBusy("save");
    try {
      const keptDate = original && original.created_at.slice(0, 10) === form.date;
      const row = {
        title: form.title.trim(),
        description: form.description.trim(),
        slug,
        title_en: form.titleEn.trim() || null,
        description_en: form.descriptionEn.trim() || null,
        title_ar: form.titleAr.trim() || null,
        description_ar: form.descriptionAr.trim() || null,
        created_at: keptDate ? original!.created_at : `${form.date}T12:00:00Z`,
        published: form.published,
        featured: form.featured,
        updated_at: new Date().toISOString(),
      };
      let projectId = original?.id;
      if (projectId) {
        const { error } = await supabase.from("portfolio").update(row).eq("id", projectId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("portfolio").insert(row).select("id").single();
        if (error) throw error;
        projectId = data.id as number;
      }

      // Upload new photos.
      const uploaded: MediaDraft[] = [];
      for (const m of media) {
        if (!m.file) {
          uploaded.push(m);
          continue;
        }
        const ext = m.file.type === "image/webp" ? "webp" : "jpg";
        const path = `${projectId}/${Date.now()}-${newKey()}.${ext}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, m.file, { contentType: m.file.type, cacheControl: "31536000" });
        if (error) throw error;
        uploaded.push({ ...m, media_url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl, file: undefined });
      }

      // Media rows: remove, reorder, add.
      const before = original?.portfolio_media ?? [];
      const removed = before.filter((b) => !uploaded.some((m) => m.id === b.id));
      if (removed.length) {
        const { error } = await supabase.from("portfolio_media").delete().in("id", removed.map((r) => r.id));
        if (error) throw error;
        const paths = removed.map((r) => storagePath(r.media_url)).filter((p): p is string => Boolean(p));
        if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
      }
      for (const [i, m] of uploaded.entries()) {
        if (m.id) {
          const was = before.find((b) => b.id === m.id);
          if (was?.sort_order !== i) {
            const { error } = await supabase.from("portfolio_media").update({ sort_order: i }).eq("id", m.id);
            if (error) throw error;
          }
        }
      }
      const added = uploaded.map((m, i) => ({ m, i })).filter(({ m }) => !m.id);
      if (added.length) {
        const { error } = await supabase
          .from("portfolio_media")
          .insert(added.map(({ m, i }) => ({ portfolio_id: projectId, media_url: m.media_url, media_type: m.media_type, sort_order: i })));
        if (error) throw error;
      }

      flash("Projet enregistré");
      setForm((f) => ({ ...f, slug }));
      setSaved(snapshot({ ...form, slug }, media));
      if (isNew) navigate(`/admin/realisations/${projectId}`, { replace: true });
      else {
        // Reload to pick up the new media ids.
        const { data } = await supabase.from("portfolio").select("*, portfolio_media(id, media_url, media_type, sort_order)").eq("id", projectId).single();
        if (data) {
          const p = data as PortfolioItem;
          const m: MediaDraft[] = [...p.portfolio_media]
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((x) => ({ key: `db-${x.id}`, id: x.id, media_url: x.media_url, media_type: isVideoMedia(x.media_url, x.media_type) ? "video" : "image" }));
          setOriginal(p);
          setMedia(m);
          setSaved(snapshot(form, m));
        }
      }
    } catch (e) {
      const err = e as { message?: string; code?: string };
      flash(err.code === "23505" ? "Cette adresse est déjà utilisée par un autre projet : modifiez-la." : errorMessage(err), "error");
    } finally {
      setBusy("");
    }
  };

  const remove = async () => {
    if (!original || !window.confirm(`Supprimer définitivement « ${original.title} » et ses photos ?`)) return;
    setBusy("delete");
    try {
      const { error: e1 } = await supabase.from("portfolio_media").delete().eq("portfolio_id", original.id);
      if (e1) throw e1;
      const { data: files } = await supabase.storage.from(BUCKET).list(String(original.id));
      if (files?.length) await supabase.storage.from(BUCKET).remove(files.map((f) => `${original.id}/${f.name}`));
      const { error: e2 } = await supabase.from("portfolio").delete().eq("id", original.id);
      if (e2) throw e2;
      flash("Projet supprimé");
      setSaved(snapshot(form, media));
      navigate("/admin/realisations");
    } catch (e) {
      flash(errorMessage(e as { message?: string; code?: string }), "error");
      setBusy("");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Notice tone="error">{error}</Notice>;

  return (
    <div className="pb-24">
      <Link to="/admin/realisations" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900">
        <ArrowLeft className="size-4" /> Réalisations
      </Link>
      <div className="mt-3">
        <PageHeader
          title={isNew ? "Nouveau projet" : form.title || "Projet"}
          actions={
            !isNew && (
              <a href={`/portfolio/${original?.slug || id}`} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50">
                <ExternalLink className="size-4" /> Voir sur le site
              </a>
            )
          }
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <Field label="Titre *" htmlFor="p-title" action={<AiAssist value={form.title} onApply={(v) => set("title", v)} lang="fr" field="title" />}>
            <input id="p-title" className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="ex. Rétrofit automate S7-300 vers S7-1200 – ligne d’embouteillage" />
          </Field>
          <Field label="Description" htmlFor="p-desc" action={<AiAssist value={form.description} onApply={(v) => set("description", v)} lang="fr" field="text" />} hint="Ce qui a été fait, le matériel, le résultat. Les #mots-clés en fin de texte s’affichent comme étiquettes.">
            <textarea id="p-desc" rows={10} className={inputClass} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </Field>
          <div className="border-t border-slate-200 pt-5">
            <h2 className="font-semibold text-navy-900">Version anglaise (/en)</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Traduction affichée sur le site en anglais. Vide : la page anglaise montre le texte français et renvoie Google vers la page française.
            </p>
          </div>
          <Field label="Title" htmlFor="p-title-en" action={<AiAssist value={form.titleEn} onApply={(v) => set("titleEn", v)} lang="en" field="title" source={form.title} />}>
            <input id="p-title-en" lang="en" className={inputClass} value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} />
          </Field>
          <Field label="Description" htmlFor="p-desc-en" action={<AiAssist value={form.descriptionEn} onApply={(v) => set("descriptionEn", v)} lang="en" field="text" source={form.description} />}>
            <textarea id="p-desc-en" lang="en" rows={8} className={inputClass} value={form.descriptionEn} onChange={(e) => set("descriptionEn", e.target.value)} />
          </Field>
          <div className="border-t border-slate-200 pt-5">
            <h2 className="font-semibold text-navy-900">Version arabe (/ar)</h2>
            <p className="mt-0.5 text-xs text-slate-500">Vide : la page arabe montre le texte français et renvoie Google vers la page française.</p>
          </div>
          <Field label="العنوان" htmlFor="p-title-ar" action={<AiAssist value={form.titleAr} onApply={(v) => set("titleAr", v)} lang="ar" field="title" source={form.title} />}>
            <input id="p-title-ar" lang="ar" dir="rtl" className={inputClass} value={form.titleAr} onChange={(e) => set("titleAr", e.target.value)} />
          </Field>
          <Field label="الوصف" htmlFor="p-desc-ar" action={<AiAssist value={form.descriptionAr} onApply={(v) => set("descriptionAr", v)} lang="ar" field="text" source={form.description} />}>
            <textarea id="p-desc-ar" lang="ar" dir="rtl" rows={8} className={inputClass} value={form.descriptionAr} onChange={(e) => set("descriptionAr", e.target.value)} />
          </Field>
        </section>

        <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 lg:self-start">
          <Toggle checked={form.published} onChange={(v) => set("published", v)} label={form.published ? "Visible sur le site" : "Masqué du site"} />
          <Toggle checked={form.featured} onChange={(v) => set("featured", v)} label="Afficher dans « Interventions récentes »" />
          <Field label="Date d’intervention" htmlFor="p-date">
            <input id="p-date" type="date" className={inputClass} value={form.date} onChange={(e) => set("date", e.target.value || today())} />
          </Field>
          <Field
            label="Adresse de la page"
            htmlFor="p-slug"
            hint="Vide : créée à partir du titre anglais (ou français). Les anciens liens /portfolio/numéro continuent de fonctionner, mais changer une adresse casse les liens déjà partagés avec elle."
          >
            <div className="flex items-center rounded-md border border-slate-300 bg-slate-50 pl-3 text-sm text-slate-500 focus-within:border-navy-700">
              /portfolio/
              <input
                id="p-slug"
                className="min-w-0 flex-1 rounded-r-md bg-white px-2 py-2 font-mono text-xs text-ink outline-none"
                value={form.slug}
                placeholder={slugify(form.titleEn || form.title)}
                onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              />
            </div>
          </Field>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-navy-900">Photos et vidéos</h2>
            <p className="text-xs text-slate-500">La première sert d’image principale. Les photos sont réduites avant l’envoi.</p>
          </div>
          <Button onClick={() => fileInput.current?.click()}>
            <ImagePlus className="size-4" /> Ajouter des photos
          </Button>
          <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
        </div>

        {media.length === 0 ? (
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="mt-4 flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 py-10 text-sm text-slate-500 hover:border-slate-400"
          >
            <ImagePlus className="size-6" /> Choisir des photos
          </button>
        ) : (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {media.map((m, i) => {
              const thumb = thumbFor(m);
              return (
                <li key={m.key} className={`group relative overflow-hidden rounded-lg border bg-slate-100 ${i === 0 ? "border-brand ring-2 ring-brand" : "border-slate-200"}`}>
                  <div className="aspect-[4/3]">
                    {thumb ? (
                      <img src={thumb} alt="" referrerPolicy="no-referrer" className="size-full object-cover" />
                    ) : (
                      <div className="flex size-full items-center justify-center text-slate-400"><Film className="size-6" /></div>
                    )}
                  </div>
                  {m.media_type === "video" && (
                    <span className="absolute top-1.5 left-1.5 rounded bg-navy-950/75 px-1.5 py-0.5 text-[10px] font-semibold text-white">Vidéo</span>
                  )}
                  {i === 0 && <span className="absolute bottom-1.5 left-1.5 rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-navy-950">Principale</span>}
                  {m.file && <span className="absolute top-1.5 right-9 rounded bg-sky-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">Nouveau</span>}
                  <button
                    type="button"
                    aria-label="Retirer"
                    onClick={() => setMedia((s) => s.filter((x) => x.key !== m.key))}
                    className="absolute top-1.5 right-1.5 rounded-full bg-white/90 p-1 text-slate-700 shadow hover:bg-white hover:text-red-600"
                  >
                    <X className="size-3.5" />
                  </button>
                  <div className="absolute right-1.5 bottom-1.5 flex gap-1">
                    <button type="button" aria-label="Avant" disabled={i === 0} onClick={() => move(i, -1)} className="rounded-full bg-white/90 p-1 text-slate-700 shadow disabled:opacity-30">
                      <ChevronLeft className="size-3.5" />
                    </button>
                    <button type="button" aria-label="Après" disabled={i === media.length - 1} onClick={() => move(i, 1)} className="rounded-full bg-white/90 p-1 text-slate-700 shadow disabled:opacity-30">
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              aria-label="Lien d’une vidéo ou d’une image"
              placeholder="Ou collez un lien : YouTube, Imgur, fichier .mp4…"
              className={`${inputClass} pl-9`}
              value={link}
              onChange={(e) => setLink(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLink())}
            />
          </div>
          <Button onClick={addLink} disabled={!link.trim()}>Ajouter</Button>
        </div>
      </section>

      {/* Save bar */}
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
              {isNew ? "Créer le projet" : "Enregistrer"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
