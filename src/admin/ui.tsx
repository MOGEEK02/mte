import { createContext, useCallback, useContext, useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";

// Small building blocks for the admin pages.

const BUTTON = {
  primary: "bg-brand text-navy-950 hover:bg-brand-600",
  dark: "bg-navy-900 text-white hover:bg-navy-800",
  outline: "border border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
} as const;

export function Button({
  variant = "outline",
  size = "md",
  loading,
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof BUTTON; size?: "sm" | "md"; loading?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-700 disabled:cursor-not-allowed disabled:opacity-50 ${
        size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-4 py-2.5 text-sm"
      } ${BUTTON[variant]} ${className}`}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

export const inputClass =
  "block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-ink shadow-xs placeholder:text-slate-400 focus:border-navy-700 focus:ring-2 focus:ring-navy-700/15 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500";

export function Field({
  label,
  hint,
  htmlFor,
  children,
  className = "",
  action,
}: {
  label: string;
  hint?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
  /** Small control at the end of the label row (the writing assistant). */
  action?: ReactNode;
}) {
  const labelEl = (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
      {label}
    </label>
  );
  return (
    <div className={className}>
      {action ? (
        <div className="flex min-h-5 items-center justify-between gap-2">
          {labelEl}
          {action}
        </div>
      ) : (
        labelEl
      )}
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function Toggle({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label?: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2.5 text-sm text-slate-700 disabled:opacity-50"
    >
      <span className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-emerald-500" : "bg-slate-300"}`}>
        <span className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4.5" : "translate-x-0.5"}`} />
      </span>
      {label}
    </button>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "error"; children: ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={`flex gap-2.5 rounded-lg px-4 py-3 text-sm ${tone === "error" ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-900"}`}
    >
      <TriangleAlert className="mt-0.5 size-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex items-center gap-2 py-16 text-sm text-slate-500">
      <Loader2 className="size-4 animate-spin" />
      Chargement…
    </div>
  );
}

// --- Short confirmation messages ("Enregistré") ---

type Flash = { id: number; text: string; tone: "ok" | "error" };
const FlashContext = createContext<(text: string, tone?: Flash["tone"]) => void>(() => {});

export function FlashProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Flash[]>([]);
  const flash = useCallback((text: string, tone: Flash["tone"] = "ok") => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { id, text, tone }]);
    setTimeout(() => setItems((s) => s.filter((f) => f.id !== id)), tone === "error" ? 6000 : 3000);
  }, []);
  return (
    <FlashContext.Provider value={flash}>
      {children}
      <div aria-live="polite" className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
        {items.map((f) => (
          <div
            key={f.id}
            className={`flex max-w-sm items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
              f.tone === "ok" ? "bg-navy-900 text-white" : "bg-red-600 text-white"
            }`}
          >
            {f.tone === "ok" ? <CheckCircle2 className="size-4 text-emerald-300" /> : <TriangleAlert className="size-4" />}
            {f.text}
          </div>
        ))}
      </div>
    </FlashContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFlash() {
  return useContext(FlashContext);
}

/** "12 mars 2026, 14:05" */
// eslint-disable-next-line react-refresh/only-export-components
export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// --- Pieces shared by the editing pages ---

export function Card({ title, description, actions, children, className = "" }: { title: string; description?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-5 sm:p-6 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-navy-900">{title}</h2>
          {description && <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>}
        </div>
        {actions}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export type AdminLang = "fr" | "en" | "ar";
const LANG_TABS: { code: AdminLang; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
];

/** French / English / Arabic switch; a dot marks the languages whose text was changed. */
export function LangTabs({ value, onChange, changed }: { value: AdminLang; onChange: (l: AdminLang) => void; changed?: Partial<Record<AdminLang, boolean>> }) {
  return (
    <div role="tablist" aria-label="Langue" className="inline-flex rounded-lg bg-slate-100 p-1">
      {LANG_TABS.map((l) => (
        <button
          key={l.code}
          type="button"
          role="tab"
          aria-selected={value === l.code}
          onClick={() => onChange(l.code)}
          className={`relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            value === l.code ? "bg-white text-navy-900 shadow-xs" : "text-slate-600 hover:text-navy-900"
          }`}
        >
          {l.label}
          {changed?.[l.code] && <span title="Texte modifié" className="absolute top-1 right-1 size-1.5 rounded-full bg-brand-600" />}
        </button>
      ))}
    </div>
  );
}

/** lang and dir attributes for a field written in this language. */
// eslint-disable-next-line react-refresh/only-export-components
export const langProps = (l: AdminLang) => ({ lang: l, dir: l === "ar" ? ("rtl" as const) : ("ltr" as const) });

/** Bar fixed at the bottom of an editing page. */
export function SaveBar({ dirty, busy, onSave, label = "Enregistrer", left }: { dirty: boolean; busy: boolean; onSave?: () => void; label?: string; left?: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur lg:left-60">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
        <div>{left}</div>
        <div className="flex items-center gap-3">
          {dirty && <span className="hidden text-sm text-amber-700 sm:inline">Modifications non enregistrées</span>}
          <Button type={onSave ? "button" : "submit"} variant="primary" loading={busy} disabled={!dirty} onClick={onSave}>
            {label}
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Asks before leaving the page with unsaved changes. */
// eslint-disable-next-line react-refresh/only-export-components
export function useUnsavedWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
}
