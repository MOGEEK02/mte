import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Megaphone, Plus, RotateCcw, Trash2 } from "lucide-react";
import { defaultAbout, siteTexts, type Announcement, type FaqItem, type SiteContent } from "../content";
import { DICT, type Lang } from "../i18n";
import { errorMessage, isMissingSetup, supabase } from "./supabase";
import { Button, Card, Field, inputClass, LangTabs, langProps, Loading, Notice, PageHeader, SaveBar, Toggle, useFlash, useUnsavedWarning } from "./ui";
import { AiAssist } from "./AiAssist";

const LANGS: Lang[] = ["fr", "en", "ar"];
const LANG_NAME: Record<Lang, string> = { fr: "Français", en: "Anglais", ar: "Arabe" };

/** What the form edits: the texts as shown on the site, in each language. */
type Draft = {
  announcement: Announcement;
  hero: Record<Lang, { eyebrow: string; title: string; text: string; checks: string[] }>;
  faq: Record<Lang, FaqItem[]>;
  reach: Record<Lang, { sectors: string; areas: string }>;
  about: Record<Lang, { title: string; paragraphs: string }>;
};

const NO_BANNER: Announcement = { enabled: false, tone: "info", link: "", until: "", text: {} };

const perLang = <T,>(make: (l: Lang) => T) => Object.fromEntries(LANGS.map((l) => [l, make(l)])) as Record<Lang, T>;
const splitLines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const splitParagraphs = (s: string) => s.split(/\n\s*\n/).map((x) => x.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean);
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

function toDraft(c: SiteContent): Draft {
  const texts = perLang((l) => siteTexts(l, c));
  return {
    announcement: { ...NO_BANNER, ...c.announcement, text: { ...c.announcement?.text } },
    hero: perLang((l) => ({ ...texts[l].hero, checks: [...texts[l].hero.checks] })),
    faq: perLang((l) => texts[l].faq.map((f) => ({ ...f }))),
    reach: perLang((l) => ({ sectors: texts[l].sectors.join("\n"), areas: texts[l].areas.join("\n") })),
    about: perLang((l) => ({ title: texts[l].about.title, paragraphs: texts[l].about.paragraphs.join("\n\n") })),
  };
}

/** Keeps only what differs from the built-in texts, so later improvements of those still apply. */
function fromDraft(d: Draft): Required<Omit<SiteContent, "store">> {
  const hero: SiteContent["hero"] = {};
  const faq: SiteContent["faq"] = {};
  const reach: SiteContent["reach"] = {};
  const about: SiteContent["about"] = {};
  for (const l of LANGS) {
    const t = DICT[l];
    const h = d.hero[l];
    const changedHero = {
      ...(h.eyebrow.trim() && h.eyebrow.trim() !== t.hero.eyebrow ? { eyebrow: h.eyebrow.trim() } : {}),
      ...(h.title.trim() && h.title.trim() !== t.hero.title ? { title: h.title.trim() } : {}),
      ...(h.text.trim() && h.text.trim() !== t.hero.text ? { text: h.text.trim() } : {}),
      ...(!same(h.checks.map((c) => c.trim()).filter(Boolean), t.hero.checks) && h.checks.some((c) => c.trim())
        ? { checks: h.checks.map((c) => c.trim()).filter(Boolean) }
        : {}),
    };
    if (Object.keys(changedHero).length) hero[l] = changedHero;

    const items = d.faq[l].map((f) => ({ q: f.q.trim(), a: f.a.trim() })).filter((f) => f.q || f.a);
    if (items.length && !same(items, t.faq.items)) faq[l] = items;

    const sectors = splitLines(d.reach[l].sectors);
    const areas = splitLines(d.reach[l].areas);
    const changedReach = {
      ...(sectors.length && !same(sectors, t.reach.sectors) ? { sectors } : {}),
      ...(areas.length && !same(areas, t.reach.areas) ? { areas } : {}),
    };
    if (Object.keys(changedReach).length) reach[l] = changedReach;

    const paragraphs = splitParagraphs(d.about[l].paragraphs);
    const title = d.about[l].title.trim();
    const changedAbout = {
      ...(title && title !== t.about.title ? { title } : {}),
      ...(paragraphs.length && !same(paragraphs, defaultAbout(l)) ? { paragraphs } : {}),
    };
    if (Object.keys(changedAbout).length) about[l] = changedAbout;
  }
  const a = d.announcement;
  const announcement: Announcement = {
    enabled: a.enabled,
    tone: a.tone,
    link: a.link.trim(),
    until: a.until,
    text: Object.fromEntries(LANGS.map((l) => [l, a.text[l]?.trim() ?? ""]).filter(([, v]) => v)),
  };
  return { announcement, hero, faq, reach, about };
}

export default function ContentAdmin() {
  const flash = useFlash();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [lang, setLang] = useState<Lang>("fr");

  useEffect(() => {
    supabase
      .from("site_content")
      .select("key, value")
      .then(({ data, error }) => {
        if (error) return setError(isMissingSetup(error) ? "setup" : errorMessage(error));
        const content = Object.fromEntries((data ?? []).map((r) => [r.key, r.value])) as SiteContent;
        const d = toDraft(content);
        setDraft(d);
        setSaved(JSON.stringify(fromDraft(d)));
      });
  }, []);

  const result = useMemo(() => (draft ? fromDraft(draft) : null), [draft]);
  const dirty = Boolean(result && JSON.stringify(result) !== saved);
  useUnsavedWarning(dirty);

  if (error === "setup")
    return (
      <Notice>
        Pour modifier les textes du site, exécutez d’abord la section 12 de <code>supabase/admin.sql</code> dans Supabase → SQL Editor.
      </Notice>
    );
  if (error) return <Notice tone="error">{error}</Notice>;
  if (!draft || !result) return <Loading />;

  const set = (fn: (d: Draft) => void) =>
    setDraft((s) => {
      if (!s) return s;
      const next = structuredClone(s);
      fn(next);
      return next;
    });
  const changed = (block: "hero" | "faq" | "reach" | "about") => perLang((l) => Boolean(result[block][l]));
  const anyChanged = perLang((l) => (["hero", "faq", "reach", "about"] as const).some((b) => Boolean(result[b][l])));
  const reset = (block: "hero" | "faq" | "reach" | "about") =>
    set((d) => {
      const fresh = toDraft({});
      (d[block] as Record<Lang, unknown>)[lang] = (fresh[block] as Record<Lang, unknown>)[lang];
    });
  const resetButton = (block: "hero" | "faq" | "reach" | "about") =>
    changed(block)[lang] ? (
      <Button size="sm" variant="ghost" onClick={() => reset(block)} title="Revenir au texte d’origine pour cette langue">
        <RotateCcw className="size-3.5" /> Texte d’origine
      </Button>
    ) : null;

  const save = async () => {
    const a = draft.announcement;
    if (a.enabled && !LANGS.some((l) => a.text[l]?.trim())) return flash("Écrivez le texte du bandeau (au moins en français).", "error");
    if (a.link.trim() && !/^(\/|https?:\/\/)/.test(a.link.trim())) return flash("Le lien du bandeau doit commencer par / ou https://", "error");
    for (const l of LANGS) {
      if (draft.faq[l].some((f) => Boolean(f.q.trim()) !== Boolean(f.a.trim())))
        return flash(`FAQ (${LANG_NAME[l].toLowerCase()}) : chaque question doit avoir sa réponse.`, "error");
    }
    setBusy(true);
    const now = new Date().toISOString();
    const rows = (Object.keys(result) as (keyof typeof result)[]).map((key) => ({ key, value: result[key], updated_at: now }));
    const { error } = await supabase.from("site_content").upsert(rows);
    setBusy(false);
    if (error) return flash(errorMessage(error), "error");
    setSaved(JSON.stringify(result));
    flash("Textes enregistrés : visibles tout de suite par les visiteurs");
  };

  const a = draft.announcement;
  const hero = draft.hero[lang];
  const lp = langProps(lang);
  const t = DICT[lang];

  return (
    <div className="pb-24">
      <PageHeader
        title="Textes du site"
        description="Les textes de la page d’accueil, en français, anglais et arabe. Ce que vous ne modifiez pas garde le texte d’origine."
      />

      <Card
        className="mt-6"
        title="Bandeau d’annonce"
        description="Une ligne en haut de toutes les pages : fermeture pour congés, nouveau service, promotion… Les visiteurs peuvent la fermer."
        actions={<Toggle checked={a.enabled} onChange={(v) => set((d) => void (d.announcement.enabled = v))} label={a.enabled ? "Affiché" : "Masqué"} />}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {LANGS.map((l) => (
            <Field key={l} label={`Texte (${LANG_NAME[l].toLowerCase()})`} htmlFor={`b-${l}`} action={<AiAssist value={a.text[l] ?? ""} onApply={(v) => set((d) => void (d.announcement.text[l] = v))} lang={l} field="short" source={l === "fr" ? undefined : (a.text.fr ?? "")} />} className={l === "fr" ? "sm:col-span-2" : ""} hint={l === "fr" ? "Court : environ 80 caractères. Vide en anglais ou en arabe : le texte français est affiché." : undefined}>
              <input
                id={`b-${l}`}
                {...langProps(l)}
                maxLength={160}
                className={inputClass}
                value={a.text[l] ?? ""}
                onChange={(e) => set((d) => void (d.announcement.text[l] = e.target.value))}
                placeholder={l === "fr" ? "ex. Atelier fermé du 10 au 13 avril – urgences sur WhatsApp" : ""}
              />
            </Field>
          ))}
          <Field label="Lien (facultatif)" htmlFor="b-link" hint="Une page du site (/store, /#contact, /portfolio) ou une adresse https://">
            <input id="b-link" className={inputClass} value={a.link} onChange={(e) => set((d) => void (d.announcement.link = e.target.value))} placeholder="/#contact" />
          </Field>
          <Field label="Afficher jusqu’au (facultatif)" htmlFor="b-until" hint="Le bandeau disparaît seul après cette date.">
            <input id="b-until" type="date" className={inputClass} value={a.until} onChange={(e) => set((d) => void (d.announcement.until = e.target.value))} />
          </Field>
          <fieldset className="sm:col-span-2">
            <legend className="text-sm font-medium text-slate-700">Couleur</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  ["info", "Jaune – information", "bg-brand text-navy-950"],
                  ["alert", "Rouge – important", "bg-red-600 text-white"],
                ] as const
              ).map(([tone, label, color]) => (
                <button
                  key={tone}
                  type="button"
                  aria-pressed={a.tone === tone}
                  onClick={() => set((d) => void (d.announcement.tone = tone))}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium ring-offset-2 ${color} ${a.tone === tone ? "ring-2 ring-navy-900" : "opacity-60 hover:opacity-100"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        {(a.text.fr || a.text.en || a.text.ar) && (
          <div className={`mt-5 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${a.tone === "alert" ? "bg-red-600 text-white" : "bg-brand text-navy-950"} ${a.enabled ? "" : "opacity-50"}`}>
            <Megaphone className="size-4 shrink-0" />
            <span className="line-clamp-1">{a.text.fr || a.text.en || a.text.ar}</span>
          </div>
        )}
      </Card>

      <div className="sticky top-0 z-30 -mx-4 mt-8 flex flex-wrap items-center justify-between gap-3 border-y border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <p className="text-sm font-medium text-slate-700">Textes de la page d’accueil en :</p>
        <LangTabs value={lang} onChange={setLang} changed={anyChanged} />
      </div>

      <Card className="mt-6" title="Haut de la page d’accueil" description="Le grand titre sur la photo, le texte dessous et les trois points forts." actions={resetButton("hero")}>
        <div className="space-y-5">
          <Field label="Petite ligne au-dessus du titre" htmlFor="h-eyebrow" action={<AiAssist value={hero.eyebrow} onApply={(v) => set((d) => void (d.hero[lang].eyebrow = v))} lang={lang} field="short" source={lang === "fr" ? undefined : draft.hero.fr.eyebrow} />}>
            <input id="h-eyebrow" {...lp} className={inputClass} value={hero.eyebrow} onChange={(e) => set((d) => void (d.hero[lang].eyebrow = e.target.value))} placeholder={t.hero.eyebrow} />
          </Field>
          <Field label="Titre" htmlFor="h-title" action={<AiAssist value={hero.title} onApply={(v) => set((d) => void (d.hero[lang].title = v))} lang={lang} field="title" source={lang === "fr" ? undefined : draft.hero.fr.title} />}>
            <input id="h-title" {...lp} className={inputClass} value={hero.title} onChange={(e) => set((d) => void (d.hero[lang].title = e.target.value))} placeholder={t.hero.title} />
          </Field>
          <Field label="Texte" htmlFor="h-text" action={<AiAssist value={hero.text} onApply={(v) => set((d) => void (d.hero[lang].text = v))} lang={lang} field="text" source={lang === "fr" ? undefined : draft.hero.fr.text} />}>
            <textarea id="h-text" {...lp} rows={3} className={inputClass} value={hero.text} onChange={(e) => set((d) => void (d.hero[lang].text = e.target.value))} placeholder={t.hero.text} />
          </Field>
          <div className="grid gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Field key={i} label={`Point fort ${i + 1}`} htmlFor={`h-check-${i}`}>
                <input
                  id={`h-check-${i}`}
                  {...lp}
                  className={inputClass}
                  value={hero.checks[i] ?? ""}
                  onChange={(e) => set((d) => void (d.hero[lang].checks[i] = e.target.value))}
                  placeholder={t.hero.checks[i]}
                />
              </Field>
            ))}
          </div>
        </div>
      </Card>

      <Card
        className="mt-6"
        title="Questions fréquentes"
        description="Affichées sur l’accueil et transmises à Google (résultats enrichis) et aux assistants IA."
        actions={resetButton("faq")}
      >
        <ol className="space-y-4">
          {draft.faq[lang].map((f, i) => (
            <li key={i} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-slate-500">Question {i + 1}</span>
                  <AiAssist value={f.q} onApply={(v) => set((d) => void (d.faq[lang][i].q = v))} lang={lang} field="faq" source={lang === "fr" ? undefined : (draft.faq.fr[i]?.q ?? "")} />
                </span>
                <div className="flex">
                  <button type="button" aria-label="Monter" disabled={i === 0} onClick={() => set((d) => void d.faq[lang].splice(i - 1, 2, d.faq[lang][i], d.faq[lang][i - 1]))} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30">
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Descendre"
                    disabled={i === draft.faq[lang].length - 1}
                    onClick={() => set((d) => void d.faq[lang].splice(i, 2, d.faq[lang][i + 1], d.faq[lang][i]))}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                  <button type="button" aria-label="Supprimer la question" onClick={() => set((d) => void d.faq[lang].splice(i, 1))} className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <input
                aria-label={`Question ${i + 1}`}
                {...lp}
                className={`${inputClass} mt-2 font-medium`}
                value={f.q}
                onChange={(e) => set((d) => void (d.faq[lang][i].q = e.target.value))}
                placeholder="Question"
              />
              <textarea
                aria-label={`Réponse ${i + 1}`}
                {...lp}
                rows={3}
                className={`${inputClass} mt-2`}
                value={f.a}
                onChange={(e) => set((d) => void (d.faq[lang][i].a = e.target.value))}
                placeholder="Réponse"
              />
              <div className="mt-1 flex justify-end">
                <AiAssist value={f.a} onApply={(v) => set((d) => void (d.faq[lang][i].a = v))} lang={lang} field="faq" source={lang === "fr" ? undefined : (draft.faq.fr[i]?.a ?? "")} />
              </div>
            </li>
          ))}
        </ol>
        <Button className="mt-4" onClick={() => set((d) => void d.faq[lang].push({ q: "", a: "" }))}>
          <Plus className="size-4" /> Ajouter une question
        </Button>
      </Card>

      <Card className="mt-6" title="Secteurs et wilayas" description="Section « Zones et secteurs » de l’accueil. Une ligne par secteur ou par wilaya." actions={resetButton("reach")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Secteurs où vous intervenez" htmlFor="r-sectors" action={<AiAssist value={draft.reach[lang].sectors} onApply={(v) => set((d) => void (d.reach[lang].sectors = v))} lang={lang} field="short" source={lang === "fr" ? undefined : draft.reach.fr.sectors} />}>
            <textarea id="r-sectors" {...lp} rows={8} className={inputClass} value={draft.reach[lang].sectors} onChange={(e) => set((d) => void (d.reach[lang].sectors = e.target.value))} />
          </Field>
          <Field label="Wilayas desservies" htmlFor="r-areas" action={<AiAssist value={draft.reach[lang].areas} onApply={(v) => set((d) => void (d.reach[lang].areas = v))} lang={lang} field="short" source={lang === "fr" ? undefined : draft.reach.fr.areas} />} hint="Aussi transmises à Google comme zone d’intervention.">
            <textarea id="r-areas" {...lp} rows={8} className={inputClass} value={draft.reach[lang].areas} onChange={(e) => set((d) => void (d.reach[lang].areas = e.target.value))} />
          </Field>
        </div>
      </Card>

      <Card className="mt-6" title="À propos" description="Le titre et les paragraphes de la section « À propos » : présentation de MTE et de son équipe d’ingénieurs." actions={resetButton("about")}>
        <div className="space-y-5">
          <Field label="Titre" htmlFor="a-title" action={<AiAssist value={draft.about[lang].title} onApply={(v) => set((d) => void (d.about[lang].title = v))} lang={lang} field="title" source={lang === "fr" ? undefined : draft.about.fr.title} />}>
            <input id="a-title" {...lp} className={inputClass} value={draft.about[lang].title} onChange={(e) => set((d) => void (d.about[lang].title = e.target.value))} placeholder={t.about.title} />
          </Field>
          <Field label="Paragraphes" htmlFor="a-text" action={<AiAssist value={draft.about[lang].paragraphs} onApply={(v) => set((d) => void (d.about[lang].paragraphs = v))} lang={lang} field="text" source={lang === "fr" ? undefined : draft.about.fr.paragraphs} />} hint="Laissez une ligne vide entre deux paragraphes.">
            <textarea id="a-text" {...lp} rows={10} className={inputClass} value={draft.about[lang].paragraphs} onChange={(e) => set((d) => void (d.about[lang].paragraphs = e.target.value))} />
          </Field>
        </div>
      </Card>

      <SaveBar
        dirty={dirty}
        busy={busy}
        onSave={save}
        left={<span className="hidden text-xs text-slate-500 md:inline">Visiteurs : tout de suite. Google : après « Mettre à jour le site public » ou la nuit suivante.</span>}
      />
    </div>
  );
}
