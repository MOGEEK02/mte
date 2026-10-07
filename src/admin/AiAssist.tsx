import { useEffect, useRef, useState } from "react";
import { Languages, Loader2, PenLine, Sparkles, SpellCheck, Wand2, X } from "lucide-react";
import { aiErrorText, askAi, type AiField, type AiLang, type AiTask } from "./ai";
import { Button } from "./ui";

type Job = { task: AiTask; text: string; from: AiLang };
type State = { job: Job; status: "loading" } | { job: Job; status: "done" } | { job: Job; status: "error"; error: string };

const LANG_WORD: Record<AiLang, string> = { fr: "français", en: "anglais", ar: "arabe" };

/**
 * "IA" menu next to a field of /admin: correct, improve, write from keywords, or (for the English
 * and Arabic versions) translate the French text. The answer is shown first and replaces the
 * field only when accepted.
 */
export function AiAssist({
  value,
  onApply,
  lang,
  field,
  source,
}: {
  value: string;
  onApply: (text: string) => void;
  /** Language of this field. */
  lang: AiLang;
  field: AiField;
  /** French text to translate from (fields of the English and Arabic versions). */
  source?: string;
}) {
  const [menu, setMenu] = useState(false);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State | null>(null);
  const [draft, setDraft] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const empty = !value.trim();

  // The menu closes on a click elsewhere or Escape.
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setMenu(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const run = async (job: Job) => {
    setMenu(false);
    setState({ job, status: "loading" });
    setOpen(true);
    const result = await askAi({
      task: job.task,
      text: job.text,
      lang: job.from,
      target: job.task === "translate" ? lang : undefined,
      field,
    });
    if ("text" in result) {
      setDraft(result.text);
      setState({ job, status: "done" });
    } else {
      setState({ job, status: "error", error: result.error });
    }
  };

  const items: { label: string; icon: typeof Sparkles; disabled: boolean; job: Job }[] = [
    ...(source !== undefined
      ? [{ label: "Traduire depuis le français", icon: Languages, disabled: !source.trim(), job: { task: "translate" as const, text: source, from: "fr" as const } }]
      : []),
    { label: "Corriger les fautes", icon: SpellCheck, disabled: empty, job: { task: "correct", text: value, from: lang } },
    { label: "Améliorer la formulation", icon: Wand2, disabled: empty, job: { task: "improve", text: value, from: lang } },
    ...(source === undefined ? [{ label: "Rédiger à partir de mots-clés", icon: PenLine, disabled: empty, job: { task: "propose" as const, text: value, from: lang } }] : []),
  ];
  const titles: Record<AiTask, string> = {
    correct: "Texte corrigé",
    improve: "Texte amélioré",
    translate: `Traduction en ${LANG_WORD[lang]}`,
    propose: "Proposition",
    reply: "Réponse",
  };
  const rtl = (l: AiLang) => (l === "ar" ? "rtl" : "ltr");

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={menu}
        title="Assistant de rédaction (IA)"
        onClick={() => setMenu((m) => !m)}
        className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold text-violet-700 hover:bg-violet-50"
      >
        <Sparkles className="size-3.5" />
        IA
      </button>
      {menu && (
        <div role="menu" className="absolute top-full right-0 z-30 mt-1 w-64 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
          <p className="px-2.5 py-1.5 text-xs text-slate-500">
            {empty && source === undefined ? "Écrivez d’abord le texte ou quelques mots-clés" : "Assistant de rédaction (Gemini)"}
          </p>
          {items.map((it) => (
            <button
              key={it.label}
              type="button"
              role="menuitem"
              disabled={it.disabled}
              onClick={() => run(it.job)}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <it.icon className="size-4 text-slate-500" />
              {it.label}
            </button>
          ))}
        </div>
      )}

      {open && state && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/40 p-4" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="ai-title" className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="ai-title" className="flex items-center gap-2 font-semibold text-navy-900">
                  <Sparkles className="size-4 text-violet-600" />
                  {titles[state.job.task]}
                </h2>
                <p className="mt-1 text-xs text-slate-500">Seul ce texte est envoyé à Gemini (Google, gratuit).</p>
              </div>
              <button type="button" aria-label="Fermer" onClick={() => setOpen(false)} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X className="size-4" />
              </button>
            </div>
            {state.status === "loading" && (
              <p className="flex items-center gap-2 py-8 text-sm text-slate-500">
                <Loader2 className="size-4 animate-spin" /> Rédaction en cours…
              </p>
            )}
            {state.status === "error" && <p className="mt-4 rounded-md bg-red-50 px-3 py-2.5 text-sm text-red-700">{aiErrorText(state.error)}</p>}
            {state.status === "done" && (
              <div className="mt-4 space-y-3">
                <div className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  <span className="font-medium">{state.job.task === "translate" ? "Français" : "Avant"} : </span>
                  <span dir={rtl(state.job.from)} lang={state.job.from} className="whitespace-pre-line">
                    {state.job.text.length > 600 ? `${state.job.text.slice(0, 600)}…` : state.job.text}
                  </span>
                </div>
                <textarea
                  aria-label="Texte proposé"
                  rows={Math.min(14, Math.max(3, draft.split("\n").length + 1))}
                  dir={rtl(lang)}
                  lang={lang}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-ink focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15 focus:outline-none"
                  autoFocus
                />
                <p className="text-xs text-slate-500">Relisez et modifiez si besoin avant de l’utiliser.</p>
              </div>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <Button onClick={() => setOpen(false)}>Annuler</Button>
              {state.status === "error" && (
                <Button variant="dark" onClick={() => run(state.job)}>
                  Réessayer
                </Button>
              )}
              {state.status === "done" && (
                <Button
                  variant="primary"
                  disabled={!draft.trim()}
                  onClick={() => {
                    onApply(draft.trim());
                    setOpen(false);
                  }}
                >
                  Utiliser ce texte
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
