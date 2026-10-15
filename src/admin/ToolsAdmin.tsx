import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, RotateCcw } from "lucide-react";
import type { Lang } from "../i18n";
import { TOOLS, type ToolsConfig } from "../tools";
import { errorMessage, isMissingSetup, supabase } from "./supabase";
import { Button, Card, Field, inputClass, langProps, LangTabs, Loading, Notice, PageHeader, SaveBar, Toggle, useFlash, useUnsavedWarning } from "./ui";

const LANGS: Lang[] = ["fr", "en", "ar"];
const BY_SLUG = new Map(TOOLS.map((t) => [t.slug, t]));
const perLang = <T,>(make: (l: Lang) => T) => Object.fromEntries(LANGS.map((l) => [l, make(l)])) as Record<Lang, T>;

type Fields = { title: string; tagline: string; intro: string };
type Row = { slug: string; hidden: boolean; text: Record<Lang, Fields> };

function toRows(cfg: ToolsConfig): Row[] {
  const order = cfg.order ?? [];
  const slugs = [...order.filter((s) => BY_SLUG.has(s)), ...TOOLS.map((t) => t.slug).filter((s) => !order.includes(s))];
  const hidden = new Set(cfg.hidden ?? []);
  return slugs.map((slug) => ({
    slug,
    hidden: hidden.has(slug),
    text: perLang((l) => ({
      title: cfg.text?.[slug]?.[l]?.title ?? "",
      tagline: cfg.text?.[slug]?.[l]?.tagline ?? "",
      intro: cfg.text?.[slug]?.[l]?.intro ?? "",
    })),
  }));
}

/** Keep only what differs from the built-in text, so later improvements still apply. */
function fromRows(rows: Row[]): ToolsConfig {
  const text: NonNullable<ToolsConfig["text"]> = {};
  for (const r of rows) {
    const d = BY_SLUG.get(r.slug)!;
    const perL: Record<string, Fields> = {};
    for (const l of LANGS) {
      const t = r.text[l];
      const over: Partial<Fields> = {};
      if (t.title.trim() && t.title.trim() !== d.title[l]) over.title = t.title.trim();
      if (t.tagline.trim() && t.tagline.trim() !== d.tagline[l]) over.tagline = t.tagline.trim();
      if (t.intro.trim() && t.intro.trim() !== d.intro[l]) over.intro = t.intro.trim();
      if (Object.keys(over).length) perL[l] = over as Fields;
    }
    if (Object.keys(perL).length) text[r.slug] = perL;
  }
  const cfg: ToolsConfig = { order: rows.map((r) => r.slug) };
  const hidden = rows.filter((r) => r.hidden).map((r) => r.slug);
  if (hidden.length) cfg.hidden = hidden;
  if (Object.keys(text).length) cfg.text = text;
  return cfg;
}

export default function ToolsAdmin() {
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
      .eq("key", "tools")
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) return setError(isMissingSetup(error) ? "setup" : errorMessage(error));
        const r = toRows((data?.value ?? {}) as ToolsConfig);
        setRows(r);
        setSaved(JSON.stringify(fromRows(r)));
      });
  }, []);

  const result = useMemo(() => (rows ? fromRows(rows) : null), [rows]);
  const dirty = Boolean(result && JSON.stringify(result) !== saved);
  useUnsavedWarning(dirty);

  if (error === "setup") return <Notice>Pour gérer les outils, exécutez d’abord la section 12 de <code>supabase/admin.sql</code> dans Supabase → SQL Editor.</Notice>;
  if (error) return <Notice tone="error">{error}</Notice>;
  if (!rows || !result) return <Loading />;

  const set = (fn: (r: Row[]) => void) =>
    setRows((s) => {
      if (!s) return s;
      const n = structuredClone(s);
      fn(n);
      return n;
    });

  const changed = perLang((l) => rows.some((r) => [r.text[l].title, r.text[l].tagline, r.text[l].intro].some((v) => v.trim())));

  const save = async () => {
    setBusy(true);
    const { error } = await supabase.from("site_content").upsert([{ key: "tools", value: result, updated_at: new Date().toISOString() }]);
    setBusy(false);
    if (error) return flash(errorMessage(error), "error");
    setSaved(JSON.stringify(result));
    flash("Outils enregistrés : visibles tout de suite par les visiteurs");
  };

  const lp = langProps(lang);

  return (
    <div className="pb-24">
      <PageHeader
        title="Outils de calcul"
        description="Les calculateurs de la page /outils : affichez-les ou masquez-les, changez l’ordre et modifiez leurs textes. Les calculs restent intégrés au site."
      />

      <div className="sticky top-0 z-30 -mx-4 mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <p className="text-sm font-medium text-slate-700">Textes des outils en :</p>
        <LangTabs value={lang} onChange={setLang} changed={changed} />
      </div>

      <div className="mt-6 space-y-4">
        {rows.map((row, i) => {
          const d = BY_SLUG.get(row.slug)!;
          const t = row.text[lang];
          const hasOverride = [t.title, t.tagline, t.intro].some((v) => v.trim());
          return (
            <Card
              key={row.slug}
              className={row.hidden ? "opacity-60" : ""}
              title={d.title.fr}
              description={<span className="font-mono text-[11px]">/outils/{row.slug}</span>}
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
                <Field label="Nom affiché" htmlFor={`t-${row.slug}-title`} hint={hasOverride ? undefined : "Vide = texte d’origine."}>
                  <input id={`t-${row.slug}-title`} {...lp} className={inputClass} value={t.title} placeholder={d.title[lang]} onChange={(e) => set((r) => void (r[i].text[lang].title = e.target.value))} />
                </Field>
                <Field label="Accroche (sous le nom)" htmlFor={`t-${row.slug}-tag`}>
                  <input id={`t-${row.slug}-tag`} {...lp} className={inputClass} value={t.tagline} placeholder={d.tagline[lang]} onChange={(e) => set((r) => void (r[i].text[lang].tagline = e.target.value))} />
                </Field>
                <Field label="Introduction (haut de la page)" htmlFor={`t-${row.slug}-intro`}>
                  <textarea id={`t-${row.slug}-intro`} {...lp} rows={3} className={inputClass} value={t.intro} placeholder={d.intro[lang]} onChange={(e) => set((r) => void (r[i].text[lang].intro = e.target.value))} />
                </Field>
                {hasOverride && (
                  <div className="flex justify-end">
                    <Button size="sm" variant="ghost" onClick={() => set((r) => void (r[i].text[lang] = { title: "", tagline: "", intro: "" }))}>
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
