import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, RotateCcw } from "lucide-react";
import type { Lang } from "../i18n";
import { DEFAULT_POSTS, type BlogConfig } from "../blog";
import { errorMessage, isMissingSetup, supabase } from "./supabase";
import { Button, Card, Field, inputClass, langProps, LangTabs, Loading, Notice, PageHeader, SaveBar, Toggle, useFlash, useUnsavedWarning } from "./ui";

const LANGS: Lang[] = ["fr", "en", "ar"];
const BY_SLUG = new Map(DEFAULT_POSTS.map((p) => [p.slug, p]));
const perLang = <T,>(make: (l: Lang) => T) => Object.fromEntries(LANGS.map((l) => [l, make(l)])) as Record<Lang, T>;

type Fields = { title: string; description: string; body: string };
type Row = { slug: string; hidden: boolean; text: Record<Lang, Fields> };

function toRows(cfg: BlogConfig): Row[] {
  const order = cfg.order ?? [];
  const slugs = [...order.filter((s) => BY_SLUG.has(s)), ...DEFAULT_POSTS.map((p) => p.slug).filter((s) => !order.includes(s))];
  const hidden = new Set(cfg.hidden ?? []);
  return slugs.map((slug) => ({
    slug,
    hidden: hidden.has(slug),
    text: perLang((l) => ({
      title: cfg.text?.[slug]?.[l]?.title ?? "",
      description: cfg.text?.[slug]?.[l]?.description ?? "",
      body: cfg.text?.[slug]?.[l]?.body ?? "",
    })),
  }));
}

function fromRows(rows: Row[]): BlogConfig {
  const text: NonNullable<BlogConfig["text"]> = {};
  for (const r of rows) {
    const d = BY_SLUG.get(r.slug)!;
    const perL: Record<string, Fields> = {};
    for (const l of LANGS) {
      const t = r.text[l];
      const over: Partial<Fields> = {};
      if (t.title.trim() && t.title.trim() !== d.title[l]) over.title = t.title.trim();
      if (t.description.trim() && t.description.trim() !== d.description[l]) over.description = t.description.trim();
      if (t.body.trim() && t.body.trim() !== d.body[l]) over.body = t.body.trim();
      if (Object.keys(over).length) perL[l] = over as Fields;
    }
    if (Object.keys(perL).length) text[r.slug] = perL;
  }
  const cfg: BlogConfig = { order: rows.map((r) => r.slug) };
  const hidden = rows.filter((r) => r.hidden).map((r) => r.slug);
  if (hidden.length) cfg.hidden = hidden;
  if (Object.keys(text).length) cfg.text = text;
  return cfg;
}

export default function BlogAdmin() {
  const flash = useFlash();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [lang, setLang] = useState<Lang>("fr");

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

  const changed = perLang((l) => rows.some((r) => [r.text[l].title, r.text[l].description, r.text[l].body].some((v) => v.trim())));

  const save = async () => {
    setBusy(true);
    const { error } = await supabase.from("site_content").upsert([{ key: "blog", value: result, updated_at: new Date().toISOString() }]);
    setBusy(false);
    if (error) return flash(errorMessage(error), "error");
    setSaved(JSON.stringify(result));
    flash("Blog enregistré : visible tout de suite par les visiteurs");
  };

  const lp = langProps(lang);

  return (
    <div className="pb-24">
      <PageHeader
        title="Blog"
        description="Les articles du blog : affichez-les ou masquez-les, changez l’ordre et modifiez leurs textes (titre, description, contenu) en FR / EN / AR. Le contenu est écrit en Markdown simple."
      />

      <div className="sticky top-0 z-30 -mx-4 mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <p className="text-sm font-medium text-slate-700">Articles en :</p>
        <LangTabs value={lang} onChange={setLang} changed={changed} />
      </div>

      <div className="mt-6 space-y-4">
        {rows.map((row, i) => {
          const d = BY_SLUG.get(row.slug)!;
          const t = row.text[lang];
          const hasOverride = [t.title, t.description, t.body].some((v) => v.trim());
          return (
            <Card
              key={row.slug}
              className={row.hidden ? "opacity-60" : ""}
              title={d.title.fr}
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
                <Field label="Titre" htmlFor={`b-${row.slug}-title`} hint={hasOverride ? undefined : "Vide = texte d’origine."}>
                  <input id={`b-${row.slug}-title`} {...lp} className={inputClass} value={t.title} placeholder={d.title[lang]} onChange={(e) => set((r) => void (r[i].text[lang].title = e.target.value))} />
                </Field>
                <Field label="Description (SEO)" htmlFor={`b-${row.slug}-desc`}>
                  <textarea id={`b-${row.slug}-desc`} {...lp} rows={2} maxLength={180} className={inputClass} value={t.description} placeholder={d.description[lang]} onChange={(e) => set((r) => void (r[i].text[lang].description = e.target.value))} />
                </Field>
                <Field label="Contenu (Markdown : ## titre, - liste, **gras**, [lien](/url))" htmlFor={`b-${row.slug}-body`}>
                  <textarea id={`b-${row.slug}-body`} {...lp} rows={14} className={`${inputClass} font-mono text-xs`} value={t.body} placeholder={d.body[lang]} onChange={(e) => set((r) => void (r[i].text[lang].body = e.target.value))} />
                </Field>
                {hasOverride && (
                  <div className="flex justify-end">
                    <Button size="sm" variant="ghost" onClick={() => set((r) => void (r[i].text[lang] = { title: "", description: "", body: "" }))}>
                      <RotateCcw className="size-3.5" /> Texte d’origine ({lang.toUpperCase()})
                    </Button>
                  </div>
                )}
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
