import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, FileText, FolderKanban, Inbox, Loader2, MessageSquareQuote, Search, ShoppingBag, Users, Wrench, X } from "lucide-react";
import { supabase } from "./supabase";

type Hit = { group: Group; id: string; title: string; subtitle: string; to: string };
type Group = "document" | "client" | "catalog" | "request" | "project" | "product" | "review" | "service";
type Billing = "ok" | "login" | "unavailable";

const GROUPS: { key: Group; label: string; icon: typeof Search }[] = [
  { key: "document", label: "Factures, devis et bons", icon: FileText },
  { key: "client", label: "Clients", icon: Users },
  { key: "catalog", label: "Catalogue", icon: BookOpen },
  { key: "request", label: "Demandes de devis", icon: Inbox },
  { key: "project", label: "Réalisations", icon: FolderKanban },
  { key: "product", label: "Boutique", icon: ShoppingBag },
  { key: "review", label: "Avis clients", icon: MessageSquareQuote },
  { key: "service", label: "Services", icon: Wrench },
];

/** Safe inside a PostgREST "or" filter. */
const clean = (q: string) => q.replace(/[,()*%\\:"]/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);
const anyOf = (columns: string[], q: string) => columns.map((c) => `${c}.ilike."%${q}%"`).join(",");
const day = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

/** Website data (this admin's database). Tables not created yet are skipped. */
async function searchSite(q: string): Promise<Hit[]> {
  const [requests, projects, products, reviews, services] = await Promise.all([
    supabase
      .from("quote_requests")
      .select("id, name, company, request_type, created_at")
      .or(anyOf(["name", "company", "phone", "email", "equipment", "request_type", "message", "notes"], q))
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("portfolio").select("id, title, created_at").or(anyOf(["title", "title_en", "title_ar", "description", "slug"], q)).order("created_at", { ascending: false }).limit(5),
    supabase.from("products").select("id, name, brand, reference").or(anyOf(["name", "brand", "reference", "description", "name_ar"], q)).limit(5),
    supabase.from("testimonials").select("id, name, quote").or(anyOf(["name", "company", "city", "quote"], q)).limit(3),
    supabase.from("services").select("slug, title").or(anyOf(["title", "summary", "tagline"], q)).limit(3),
  ]);
  const hits: Hit[] = [];
  for (const r of requests.data ?? [])
    hits.push({ group: "request", id: `r${r.id}`, title: r.name, subtitle: [day(r.created_at), r.company, r.request_type].filter(Boolean).join(" · "), to: `/admin/demandes?id=${r.id}` });
  for (const p of projects.data ?? []) hits.push({ group: "project", id: `p${p.id}`, title: p.title, subtitle: day(p.created_at), to: `/admin/realisations/${p.id}` });
  for (const p of products.data ?? [])
    hits.push({ group: "product", id: `s${p.id}`, title: p.name, subtitle: [p.brand, p.reference].filter(Boolean).join(" · "), to: `/admin/boutique/${p.id}` });
  for (const r of reviews.data ?? [])
    hits.push({ group: "review", id: `a${r.id}`, title: r.name, subtitle: r.quote.length > 70 ? `${r.quote.slice(0, 70)}…` : r.quote, to: "/admin/avis" });
  for (const s of services.data ?? []) hits.push({ group: "service", id: `v${s.slug}`, title: s.title, subtitle: "", to: `/admin/services/${s.slug}` });
  return hits;
}

/** Invoicing app (/gestion): its own session cookie on this site. */
async function searchBilling(q: string): Promise<{ hits: Hit[]; status: Billing }> {
  try {
    const res = await fetch(`/gestion/api/search?q=${encodeURIComponent(q)}`, { headers: { Accept: "application/json" } });
    if (res.status === 401 || res.status === 403) return { hits: [], status: "login" };
    const json = res.ok ? ((await res.json().catch(() => null)) as { results?: { kind: Group; id: string; title: string; subtitle: string; href: string }[] } | null) : null;
    if (!json?.results) return { hits: [], status: "unavailable" };
    return {
      status: "ok",
      hits: json.results.map((r) => ({ group: r.kind, id: `${r.kind}-${r.id}`, title: r.title, subtitle: r.subtitle, to: `/admin/gestion${r.href}` })),
    };
  } catch {
    return { hits: [], status: "unavailable" };
  }
}

/** One search box for everything: invoicing (documents, clients, catalogue) and website (requests, projects…). Ctrl+K. */
export function SearchPalette({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [billing, setBilling] = useState<Billing>("ok");
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const run = useRef(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (open) requestAnimationFrame(() => input.current?.focus());
  }, [open]);

  // Searches 250 ms after the last key; an older, slower answer never replaces a newer one.
  useEffect(() => {
    const q = clean(query);
    if (q.length < 2) {
      setHits([]);
      setBusy(false);
      return;
    }
    const n = ++run.current;
    setBusy(true);
    const timer = window.setTimeout(async () => {
      const [site, bill] = await Promise.all([searchSite(q), searchBilling(q)]);
      if (n !== run.current) return;
      setHits([...bill.hits, ...site]);
      setBilling(bill.status);
      setActive(0);
      setBusy(false);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  const ordered = useMemo(() => GROUPS.flatMap((g) => hits.filter((h) => h.group === g.key)), [hits]);
  const go = (hit: Hit | undefined) => {
    if (!hit) return;
    setOpen(false);
    navigate(hit.to);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, ordered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(ordered[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-left text-sm text-slate-400 transition-colors hover:bg-white/10 hover:text-white ${className}`}
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1 truncate">Rechercher…</span>
        <kbd className="hidden rounded border border-white/15 px-1.5 text-[10px] text-slate-500 lg:inline">Ctrl K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center bg-navy-950/50 p-3 pt-[10vh]" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label="Rechercher partout" className="flex max-h-[75dvh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-200 px-4">
              {busy ? <Loader2 className="size-5 shrink-0 animate-spin text-slate-400" /> : <Search className="size-5 shrink-0 text-slate-400" />}
              <input
                ref={input}
                type="text"
                enterKeyHint="search"
                autoComplete="off"
                aria-label="Rechercher partout"
                placeholder="Facture, client, article, demande, réalisation…"
                className="h-14 flex-1 bg-transparent text-base text-ink placeholder:text-slate-400 focus:outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                role="combobox"
                aria-expanded={ordered.length > 0}
                aria-controls="search-results"
                aria-activedescendant={ordered[active] ? `hit-${ordered[active].id}` : undefined}
              />
              <button type="button" aria-label="Fermer" onClick={() => setOpen(false)} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X className="size-5" />
              </button>
            </div>

            <div id="search-results" role="listbox" className="overflow-y-auto p-2">
              {clean(query).length < 2 ? (
                <p className="px-3 py-6 text-center text-sm text-slate-500">
                  Tapez au moins 2 lettres : numéro de facture, nom de client, article du catalogue, machine…
                </p>
              ) : !busy && ordered.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-slate-500">Rien trouvé pour « {clean(query)} ».</p>
              ) : (
                GROUPS.map((g) => {
                  const rows = ordered.filter((h) => h.group === g.key);
                  if (!rows.length) return null;
                  return (
                    <div key={g.key} className="mb-2">
                      <p className="flex items-center gap-1.5 px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                        <g.icon className="size-3.5" /> {g.label}
                      </p>
                      {rows.map((h) => {
                        const i = ordered.indexOf(h);
                        return (
                          <button
                            key={h.id}
                            id={`hit-${h.id}`}
                            type="button"
                            role="option"
                            aria-selected={i === active}
                            onMouseEnter={() => setActive(i)}
                            onClick={() => go(h)}
                            className={`block w-full rounded-md px-3 py-2 text-left ${i === active ? "bg-navy-900 text-white" : "text-slate-800 hover:bg-slate-100"}`}
                          >
                            <span className="block truncate text-sm font-medium" dir="auto">{h.title}</span>
                            {h.subtitle && <span className={`block truncate text-xs ${i === active ? "text-slate-300" : "text-slate-500"}`} dir="auto">{h.subtitle}</span>}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {billing !== "ok" && clean(query).length >= 2 && (
              <p className="border-t border-slate-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900">
                {billing === "login" ? (
                  <>
                    Factures et clients non inclus : connectez-vous d’abord à la{" "}
                    <button type="button" className="font-semibold underline" onClick={() => go({ group: "document", id: "login", title: "", subtitle: "", to: "/admin/gestion" })}>
                      Facturation
                    </button>
                    .
                  </>
                ) : (
                  "La facturation ne répond pas : seules les données du site sont affichées."
                )}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
