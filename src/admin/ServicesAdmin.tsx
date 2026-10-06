import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp, Pencil, Plus } from "lucide-react";
import { fromRow, type ServiceRow } from "../services";
import { errorMessage, supabase } from "./supabase";
import { Loading, Notice, PageHeader, Toggle, useFlash } from "./ui";

export default function ServicesAdmin() {
  const flash = useFlash();
  const [items, setItems] = useState<ServiceRow[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from("services")
      .select("slug, title, summary, tagline, image, sort_order, published")
      .order("sort_order")
      .then(({ data, error }) => (error ? setError(errorMessage(error)) : setItems(data as ServiceRow[])));
  }, []);

  const setPublished = async (s: ServiceRow, published: boolean) => {
    setItems((list) => list!.map((x) => (x.slug === s.slug ? { ...x, published } : x)));
    const { error } = await supabase.from("services").update({ published }).eq("slug", s.slug);
    if (error) {
      setItems((list) => list!.map((x) => (x.slug === s.slug ? { ...x, published: !published } : x)));
      return flash(errorMessage(error), "error");
    }
    flash(published ? "Service visible sur le site" : "Service masqué du site");
  };

  /** Swap with the neighbour, then store every position (10, 20, 30…). */
  const move = async (i: number, d: -1 | 1) => {
    const list = [...items!];
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    const ordered = list.map((s, k) => ({ ...s, sort_order: (k + 1) * 10 }));
    setItems(ordered);
    for (const s of ordered) {
      const { error } = await supabase.from("services").update({ sort_order: s.sort_order }).eq("slug", s.slug);
      if (error) return flash(errorMessage(error), "error");
    }
    flash("Ordre enregistré");
  };

  return (
    <div>
      <PageHeader
        title="Services"
        description="Les cartes de la section Services de la page d’accueil, dans cet ordre."
        actions={
          <Link to="/admin/services/nouveau" className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-navy-950 hover:bg-brand-600">
            <Plus className="size-4" /> Nouveau service
          </Link>
        }
      />
      {error && <div className="mt-6"><Notice tone="error">{error}</Notice></div>}
      {!items && !error && <Loading />}
      {items && (
        <ul className="mt-6 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {items.length === 0 && <li className="p-8 text-center text-sm text-slate-500">Aucun service.</li>}
          {items.map((s, i) => (
            <li key={s.slug} className="flex items-center gap-4 p-3 sm:p-4">
              <img src={fromRow(s).image} alt="" loading="lazy" className="h-14 w-20 shrink-0 rounded-md object-cover" />
              <div className="min-w-0 flex-1">
                <Link to={`/admin/services/${s.slug}`} className="font-medium text-navy-900 hover:underline">{s.title}</Link>
                <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{s.summary}</p>
              </div>
              <div className="hidden md:block">
                <Toggle checked={s.published} onChange={(v) => setPublished(s, v)} label="Visible" />
              </div>
              <div className="flex">
                <button type="button" aria-label="Monter" disabled={i === 0} onClick={() => move(i, -1)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30">
                  <ArrowUp className="size-4" />
                </button>
                <button type="button" aria-label="Descendre" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30">
                  <ArrowDown className="size-4" />
                </button>
              </div>
              <Link to={`/admin/services/${s.slug}`} aria-label="Modifier" className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-navy-900">
                <Pencil className="size-4" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
