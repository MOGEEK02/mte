import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, ImageOff, Pencil, Plus, Search, Star } from "lucide-react";
import { coverImage, formatDate, type PortfolioItem } from "../portfolio";
import { errorMessage, supabase } from "./supabase";
import { inputClass, Loading, Notice, PageHeader, Toggle, useFlash } from "./ui";

export default function Projects() {
  const flash = useFlash();
  const [items, setItems] = useState<PortfolioItem[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [show, setShow] = useState<"tous" | "publies" | "masques">("tous");

  useEffect(() => {
    supabase
      .from("portfolio")
      .select("*, portfolio_media(id, media_url, media_type, sort_order)")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => (error ? setError(errorMessage(error)) : setItems(data as PortfolioItem[])));
  }, []);

  const setFeatured = async (item: PortfolioItem, featured: boolean) => {
    setItems((s) => s!.map((p) => (p.id === item.id ? { ...p, featured } : p)));
    const { error } = await supabase.from("portfolio").update({ featured }).eq("id", item.id);
    if (error) {
      setItems((s) => s!.map((p) => (p.id === item.id ? { ...p, featured: !featured } : p)));
      return flash(errorMessage(error), "error");
    }
    flash(featured ? "Affiché dans « Interventions récentes »" : "Retiré de « Interventions récentes »");
  };

  const setPublished = async (item: PortfolioItem, published: boolean) => {
    setItems((s) => s!.map((p) => (p.id === item.id ? { ...p, published } : p)));
    const { error } = await supabase.from("portfolio").update({ published }).eq("id", item.id);
    if (error) {
      setItems((s) => s!.map((p) => (p.id === item.id ? { ...p, published: !published } : p)));
      return flash(errorMessage(error), "error");
    }
    flash(published ? "Projet visible sur le site" : "Projet masqué du site");
  };

  const q = query.trim().toLowerCase();
  const shown = (items ?? []).filter(
    (p) =>
      (show === "tous" || (show === "publies") === (p.published !== false)) &&
      (!q || `${p.title} ${p.description}`.toLowerCase().includes(q)),
  );

  return (
    <div>
      <PageHeader
        title="Réalisations"
        description="★ = affiché dans « Interventions récentes » sur l’accueil (les 3 plus récents marqués ; aucun marqué : les 3 derniers projets)."
        actions={
          <Link to="/admin/realisations/nouveau" className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-navy-950 hover:bg-brand-600">
            <Plus className="size-4" /> Nouveau projet
          </Link>
        }
      />
      {error && <div className="mt-6"><Notice tone="error">{error}</Notice></div>}
      {!items && !error && <Loading />}
      {items && (
        <>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="relative min-w-56 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <input type="search" placeholder="Rechercher un projet" aria-label="Rechercher" className={`${inputClass} pl-9`} value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <select aria-label="Afficher" className={`${inputClass} w-auto`} value={show} onChange={(e) => setShow(e.target.value as typeof show)}>
              <option value="tous">Tous ({items.length})</option>
              <option value="publies">Visibles ({items.filter((p) => p.published !== false).length})</option>
              <option value="masques">Masqués ({items.filter((p) => p.published === false).length})</option>
            </select>
          </div>

          <ul className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {shown.length === 0 && <li className="p-8 text-center text-sm text-slate-500">Aucun projet.</li>}
            {shown.map((p) => {
              const cover = coverImage(p);
              return (
                <li key={p.id} className="flex items-center gap-4 p-3 sm:p-4">
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100">
                    {cover ? (
                      <img src={cover} alt="" loading="lazy" referrerPolicy="no-referrer" className="size-full object-cover" />
                    ) : (
                      <div className="flex size-full items-center justify-center text-slate-300"><ImageOff className="size-5" /></div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link to={`/admin/realisations/${p.id}`} className="line-clamp-1 font-medium text-navy-900 hover:underline">{p.title}</Link>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatDate(p.created_at)} · {p.portfolio_media?.length ?? 0} média(s)
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <Toggle checked={p.published !== false} onChange={(v) => setPublished(p, v)} label="Visible" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setFeatured(p, !p.featured)}
                    aria-pressed={Boolean(p.featured)}
                    title={p.featured ? "Retirer de « Interventions récentes »" : "Afficher dans « Interventions récentes »"}
                    className={`rounded-md p-2 transition-colors ${p.featured ? "text-brand-600 hover:bg-amber-50" : "text-slate-300 hover:bg-slate-100 hover:text-slate-500"}`}
                  >
                    <Star className="size-5" fill={p.featured ? "currentColor" : "none"} />
                  </button>
                  <a href={`/portfolio/${p.slug || p.id}`} target="_blank" rel="noopener" aria-label="Voir sur le site" className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                    <ExternalLink className="size-4" />
                  </a>
                  <Link to={`/admin/realisations/${p.id}`} aria-label="Modifier" className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-navy-900">
                    <Pencil className="size-4" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
