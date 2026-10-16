import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, ImageUp, Plus, RotateCcw, Trash2, X } from "lucide-react";
import type { Lang } from "../i18n";
import { DEFAULT_POSTS, type BlogConfig, type CustomPost } from "../blog";
import { algeriaDay } from "../content";
import { compressImage } from "./image";
import { BUCKET, errorMessage, isMissingSetup, supabase } from "./supabase";
import { Button, Card, Field, inputClass, langProps, LangTabs, Loading, Notice, PageHeader, SaveBar, Toggle, useFlash, useUnsavedWarning } from "./ui";

const LANGS: Lang[] = ["fr", "en", "ar"];
const BY_SLUG = new Map(DEFAULT_POSTS.map((p) => [p.slug, p]));
const DEFAULT_SLUGS = new Set(DEFAULT_POSTS.map((p) => p.slug));
const perLang = <T,>(make: (l: Lang) => T) => Object.fromEntries(LANGS.map((l) => [l, make(l)])) as Record<Lang, T>;

type Fields = { title: string; description: string; body: string };
type Row = { slug: string; custom: boolean; date: string; hidden: boolean; cover: string; text: Record<Lang, Fields> };

const emptyText = (): Record<Lang, Fields> => perLang(() => ({ title: "", description: "", body: "" }));
const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

function toRows(cfg: BlogConfig): Row[] {
  const hidden = new Set(cfg.hidden ?? []);
  const rows: Row[] = [];
  for (const p of DEFAULT_POSTS) {
    rows.push({
      slug: p.slug,
      custom: false,
      date: p.date,
      hidden: hidden.has(p.slug),
      cover: cfg.covers?.[p.slug] ?? "",
      text: perLang((l) => ({
        title: cfg.text?.[p.slug]?.[l]?.title ?? "",
        description: cfg.text?.[p.slug]?.[l]?.description ?? "",
        body: cfg.text?.[p.slug]?.[l]?.body ?? "",
      })),
    });
  }
  for (const p of cfg.posts ?? []) {
    if (DEFAULT_SLUGS.has(p.slug)) continue;
    rows.push({
      slug: p.slug,
      custom: true,
      date: p.date || algeriaDay(),
      hidden: hidden.has(p.slug),
      cover: p.cover ?? "",
      text: perLang((l) => ({ title: p.title?.[l] ?? "", description: p.description?.[l] ?? "", body: p.body?.[l] ?? "" })),
    });
  }
  // Apply the saved display order; anything not listed keeps its natural position.
  const order = cfg.order ?? [];
  const rank = (slug: string) => { const i = order.indexOf(slug); return i === -1 ? Infinity : i; };
  return rows.map((r, i) => [r, i] as const).sort(([a, ia], [b, ib]) => (rank(a.slug) - rank(b.slug)) || (ia - ib)).map(([r]) => r);
}

function fromRows(rows: Row[]): BlogConfig {
  const cfg: BlogConfig = { order: rows.map((r) => r.slug) };
  const hidden = rows.filter((r) => r.hidden).map((r) => r.slug);
  if (hidden.length) cfg.hidden = hidden;

  const text: NonNullable<BlogConfig["text"]> = {};
  const covers: NonNullable<BlogConfig["covers"]> = {};
  const posts: CustomPost[] = [];

  for (const r of rows) {
    if (r.custom) {
      const map = (key: keyof Fields) => {
        const o: Partial<Record<Lang, string>> = {};
        for (const l of LANGS) if (r.text[l][key].trim()) o[l] = r.text[l][key].trim();
        return o;
      };
      posts.push({ slug: r.slug, date: r.date, cover: r.cover.trim() || undefined, title: map("title"), description: map("description"), body: map("body") });
    } else {
      const d = BY_SLUG.get(r.slug)!;
      const perL: Record<string, Partial<Fields>> = {};
      for (const l of LANGS) {
        const t = r.text[l];
        const over: Partial<Fields> = {};
        if (t.title.trim() && t.title.trim() !== d.title[l]) over.title = t.title.trim();
        if (t.description.trim() && t.description.trim() !== d.description[l]) over.description = t.description.trim();
        if (t.body.trim() && t.body.trim() !== d.body[l]) over.body = t.body.trim();
        if (Object.keys(over).length) perL[l] = over;
      }
      if (Object.keys(perL).length) text[r.slug] = perL as NonNullable<BlogConfig["text"]>[string];
      if (r.cover.trim()) covers[r.slug] = r.cover.trim();
    }
  }
  if (Object.keys(text).length) cfg.text = text;
  if (Object.keys(covers).length) cfg.covers = covers;
  if (posts.length) cfg.posts = posts;
  return cfg;
}

export default function BlogAdmin() {
  const flash = useFlash();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>("fr");
  const fileInputs = useRef(new Map<string, HTMLInputElement>());

  useEffect(() => {
    supabase
      .from("site_content")
      .select("value")
      .eq("key", "blog")
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) return setError(isMissingSetup(error) ? "setup" : errorMessage(error));
        const r = toRows((data?.value ?? {}) as BlogConfig);
        setRows(r);
        setSaved(JSON.stringify(fromRows(r)));
      });
  }, []);

  const result = useMemo(() => (rows ? fromRows(rows) : null), [rows]);
  const dirty = Boolean(result && JSON.stringify(result) !== saved);
  useUnsavedWarning(dirty);

  if (error === "setup") return <Notice>Pour gérer le blog, exécutez d’abord la section 12 de <code>supabase/admin.sql</code> dans Supabase → SQL Editor.</Notice>;
  if (error) return <Notice tone="error">{error}</Notice>;
  if (!rows || !result) return <Loading />;

  const set = (fn: (r: Row[]) => void) =>
    setRows((s) => {
      if (!s) return s;
      const n = structuredClone(s);
      fn(n);
      return n;
    });

  const addPost = () => {
    const used = new Set(rows.map((r) => r.slug));
    let slug = "nouvel-article";
    for (let i = 2; used.has(slug); i++) slug = `nouvel-article-${i}`;
    set((r) => r.push({ slug, custom: true, date: algeriaDay(), hidden: true, cover: "", text: emptyText() }));
    flash("Nouvel article ajouté (masqué). Remplissez-le, puis affichez-le.");
  };

  const uploadCover = async (slug: string, file: File | undefined) => {
    if (!file) return;
    setUploading(slug);
    try {
      const blob = await compressImage(file, 1600);
      const path = `blog/${slug}-${Date.now()}.${blob.type === "image/webp" ? "webp" : "jpg"}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: blob.type, cacheControl: "31536000" });
      if (error) throw error;
      const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      set((r) => { const row = r.find((x) => x.slug === slug); if (row) row.cover = url; });
    } catch (e) {
      flash(errorMessage(e as { message?: string; code?: string }) || "Image illisible", "error");
    } finally {
      setUploading(null);
    }
  };

  const validate = (): string | null => {
    const slugs = new Set<string>();
    for (const r of rows) {
      if (!r.custom) continue;
      if (!/^[a-z0-9-]+$/.test(r.slug)) return `Adresse d’article invalide : « ${r.slug} ». Utilisez des lettres, chiffres et tirets.`;
      if (DEFAULT_SLUGS.has(r.slug)) return `L’adresse « ${r.slug} » est réservée à un article intégré. Choisissez-en une autre.`;
      if (slugs.has(r.slug)) return `Deux articles ont la même adresse : « ${r.slug} ».`;
      slugs.add(r.slug);
      if (!r.text.fr.title.trim()) return `Un nouvel article n’a pas de titre en français (adresse « ${r.slug} »).`;
      if (!r.text.fr.body.trim()) return `L’article « ${r.text.fr.title.trim() || r.slug} » n’a pas de contenu en français.`;
    }
    return null;
  };

  const save = async () => {
    const problem = validate();
    if (problem) return flash(problem, "error");
    setBusy(true);
    const { error } = await supabase.from("site_content").upsert([{ key: "blog", value: result, updated_at: new Date().toISOString() }]);
    setBusy(false);
    if (error) return flash(errorMessage(error), "error");
    setSaved(JSON.stringify(result));
    flash("Blog enregistré : visible tout de suite par les visiteurs");
  };

  const changed = perLang((l) => rows.some((r) => [r.text[l].title, r.text[l].description, r.text[l].body].some((v) => v.trim())));
  const lp = langProps(lang);

  return (
    <div className="pb-24">
      <PageHeader
        title="Blog"
        description="Gérez tous vos articles : créez-en, modifiez le texte et l’image de couverture, affichez/masquez, réordonnez et supprimez. Les trois articles intégrés peuvent être modifiés et masqués, mais pas supprimés. Contenu en Markdown simple."
        actions={<Button onClick={addPost}><Plus className="size-4" /> Nouvel article</Button>}
      />

      <div className="sticky top-0 z-30 -mx-4 mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <p className="text-sm font-medium text-slate-700">Articles en :</p>
        <LangTabs value={lang} onChange={setLang} changed={changed} />
      </div>

      <div className="mt-6 space-y-4">
        {rows.map((row, i) => {
          const d = BY_SLUG.get(row.slug);
          const t = row.text[lang];
          const hasOverride = [t.title, t.description, t.body].some((v) => v.trim());
          const titleForHeader = row.custom ? (row.text.fr.title.trim() || "Nouvel article") : d!.title.fr;
          return (
            <Card
              key={row.slug}
              className={row.hidden ? "opacity-60" : ""}
              title={
                <span className="flex items-center gap-2">
                  {titleForHeader}
                  {row.custom && <span className="rounded bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand">Mon article</span>}
                </span>
              }
              description={
                <a href={`/blog/${row.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-mono text-[11px] hover:text-navy-700">
                  /blog/{row.slug} <ExternalLink className="size-3" />
                </a>
              }
              actions={
                <div className="flex items-center gap-1">
                  <button type="button" aria-label="Monter" disabled={i === 0} onClick={() => set((r) => void r.splice(i - 1, 2, r[i], r[i - 1]))} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30">
                    <ArrowUp className="size-4" />
                  </button>
                  <button type="button" aria-label="Descendre" disabled={i === rows.length - 1} onClick={() => set((r) => void r.splice(i, 2, r[i + 1], r[i]))} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30">
                    <ArrowDown className="size-4" />
                  </button>
                  <span className="mx-1 h-5 w-px bg-slate-200" />
                  <Toggle checked={!row.hidden} onChange={(v) => set((r) => void (r[i].hidden = !v))} label={row.hidden ? "Masqué" : "Affiché"} />
                </div>
              }
            >
              <div className="space-y-4">
                {/* Shared settings: address + date (custom only) */}
                {row.custom && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Adresse (URL)" htmlFor={`b-${row.slug}-slug`} hint="Lettres, chiffres et tirets. Évitez de la changer après publication.">
                      <input
                        id={`b-${row.slug}-slug`}
                        className={`${inputClass} font-mono text-xs`}
                        value={row.slug}
                        onChange={(e) => set((r) => void (r[i].slug = e.target.value))}
                        onBlur={(e) => set((r) => void (r[i].slug = slugify(e.target.value) || r[i].slug))}
                      />
                    </Field>
                    <Field label="Date de publication" htmlFor={`b-${row.slug}-date`}>
                      <input id={`b-${row.slug}-date`} type="date" className={inputClass} value={row.date} onChange={(e) => set((r) => void (r[i].date = e.target.value))} />
                    </Field>
                  </div>
                )}

                {/* Cover image (shared across languages) */}
                <div>
                  <p className="mb-1.5 text-sm font-medium text-slate-700">Image de couverture</p>
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-400">
                      {row.cover ? <img src={row.cover} alt="" className="size-full object-cover" /> : "Aucune"}
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" loading={uploading === row.slug} onClick={() => fileInputs.current.get(row.slug)?.click()}>
                          <ImageUp className="size-3.5" /> {row.cover ? "Changer" : "Ajouter"}
                        </Button>
                        {row.cover && (
                          <Button size="sm" variant="ghost" onClick={() => set((r) => void (r[i].cover = ""))}>
                            <X className="size-3.5" /> Retirer
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">Réduite automatiquement. Format paysage conseillé (16/9).</p>
                    </div>
                    <input
                      ref={(el) => { if (el) fileInputs.current.set(row.slug, el); else fileInputs.current.delete(row.slug); }}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => { uploadCover(row.slug, e.target.files?.[0]); e.target.value = ""; }}
                    />
                  </div>
                </div>

                <Field label="Titre" htmlFor={`b-${row.slug}-title`} hint={row.custom || hasOverride ? undefined : "Vide = texte d’origine."}>
                  <input id={`b-${row.slug}-title`} {...lp} className={inputClass} value={t.title} placeholder={d?.title[lang]} onChange={(e) => set((r) => void (r[i].text[lang].title = e.target.value))} />
                </Field>
                <Field label="Description (SEO)" htmlFor={`b-${row.slug}-desc`}>
                  <textarea id={`b-${row.slug}-desc`} {...lp} rows={2} maxLength={180} className={inputClass} value={t.description} placeholder={d?.description[lang]} onChange={(e) => set((r) => void (r[i].text[lang].description = e.target.value))} />
                </Field>
                <Field label="Contenu (Markdown : ## titre, - liste, **gras**, [lien](/url), ![image](url))" htmlFor={`b-${row.slug}-body`}>
                  <textarea id={`b-${row.slug}-body`} {...lp} rows={14} className={`${inputClass} font-mono text-xs`} value={t.body} placeholder={d?.body[lang]} onChange={(e) => set((r) => void (r[i].text[lang].body = e.target.value))} />
                </Field>

                <div className="flex items-center justify-between">
                  {row.custom ? (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => { if (window.confirm(`Supprimer définitivement l’article « ${titleForHeader} » ?`)) set((r) => void r.splice(i, 1)); }}
                    >
                      <Trash2 className="size-3.5" /> Supprimer
                    </Button>
                  ) : <span />}
                  {!row.custom && hasOverride && (
                    <Button size="sm" variant="ghost" onClick={() => set((r) => void (r[i].text[lang] = { title: "", description: "", body: "" }))}>
                      <RotateCcw className="size-3.5" /> Texte d’origine ({lang.toUpperCase()})
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <SaveBar
        dirty={dirty}
        busy={busy}
        onSave={save}
        left={<span className="hidden text-xs text-slate-500 md:inline">Visiteurs : tout de suite. Google : après « Mettre à jour le site public ».</span>}
      />
    </div>
  );
}
