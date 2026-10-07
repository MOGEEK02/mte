import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp, ExternalLink, PackageSearch, Pencil, Plus } from "lucide-react";
import { DICT } from "../i18n";
import { categoryOf, formatPrice, type Product } from "../products";
import { errorMessage, isMissingSetup, supabase } from "./supabase";
import { Card, Loading, Notice, PageHeader, Toggle, useFlash } from "./ui";

type Row = Product & { published: boolean; sort_order: number };

const t = DICT.fr.store;

export default function StoreAdmin() {
  const flash = useFlash();
  const [items, setItems] = useState<Row[] | null>(null);
  const [open, setOpen] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      supabase.from("products").select("*").order("sort_order").order("id", { ascending: false }),
      supabase.from("site_content").select("value").eq("key", "store").maybeSingle(),
    ]).then(([products, store]) => {
      const err = products.error ?? store.error;
      if (err) return setError(isMissingSetup(err) ? "setup" : errorMessage(err));
      setItems(products.data as Row[]);
      setOpen((store.data?.value as { open?: boolean } | undefined)?.open === true);
    });
  }, []);

  if (error === "setup")
    return (
      <div>
        <PageHeader title="Boutique" />
        <div className="mt-6">
          <Notice>
            Pour gérer la boutique, exécutez d’abord la section 12 de <code>supabase/admin.sql</code> dans Supabase → SQL Editor.
          </Notice>
        </div>
      </div>
    );

  const setStoreOpen = async (value: boolean) => {
    setOpen(value);
    const { error } = await supabase.from("site_content").upsert({ key: "store", value: { open: value }, updated_at: new Date().toISOString() });
    if (error) {
      setOpen(!value);
      return flash(errorMessage(error), "error");
    }
    flash(value ? "Boutique ouverte" : "Boutique fermée : « Bientôt disponible »");
  };

  const update = async (p: Row, patch: Partial<Row>, done: string) => {
    setItems((s) => s!.map((x) => (x.id === p.id ? { ...x, ...patch } : x)));
    const { error } = await supabase.from("products").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", p.id);
    if (error) {
      setItems((s) => s!.map((x) => (x.id === p.id ? p : x)));
      return flash(errorMessage(error), "error");
    }
    flash(done);
  };

  /** Swap with the neighbour, then store every position (10, 20, 30…). */
  const move = async (i: number, d: -1 | 1) => {
    const list = [...items!];
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    const ordered = list.map((p, k) => ({ ...p, sort_order: (k + 1) * 10 }));
    setItems(ordered);
    const now = new Date().toISOString();
    for (const p of ordered) {
      const { error } = await supabase.from("products").update({ sort_order: p.sort_order, updated_at: now }).eq("id", p.id);
      if (error) return flash(errorMessage(error), "error");
    }
    flash("Ordre enregistré");
  };

  const visible = items?.filter((p) => p.published).length ?? 0;

  return (
    <div>
      <PageHeader
        title="Boutique"
        description="Vos produits, commandés par WhatsApp (pas de paiement en ligne). Ordre d’affichage : celui de la liste."
        actions={
          <Link to="/admin/boutique/nouveau" className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-navy-950 hover:bg-brand-600">
            <Plus className="size-4" /> Nouveau produit
          </Link>
        }
      />
      {error && <div className="mt-6"><Notice tone="error">{error}</Notice></div>}
      {(!items || open === null) && !error && <Loading />}
      {items && open !== null && (
        <>
          <Card
            className="mt-6"
            title="Boutique en ligne"
            description={
              open
                ? "Ouverte : la page Boutique montre vos produits visibles, avec un bouton « Commander sur WhatsApp ». Elle apparaît dans Google après la mise à jour du site public."
                : "Fermée : la page Boutique affiche « Bientôt disponible » et reste hors de Google. Préparez vos produits, puis ouvrez-la."
            }
            actions={<Toggle checked={open} onChange={setStoreOpen} label={open ? "Ouverte" : "Fermée"} />}
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <span className="text-slate-600">
                {visible} produit(s) visible(s) sur {items.length}
              </span>
              <a href="/store" target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 font-medium text-navy-900 hover:underline">
                <ExternalLink className="size-4" /> Voir la page Boutique
              </a>
            </div>
            {open && visible === 0 && (
              <div className="mt-4">
                <Notice>Aucun produit visible : la page affiche encore « Bientôt disponible ». Ajoutez un produit ou rendez-en un visible.</Notice>
              </div>
            )}
          </Card>

          <ul className="mt-6 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {items.length === 0 && (
              <li className="p-8 text-center text-sm text-slate-500">
                Aucun produit. <Link to="/admin/boutique/nouveau" className="font-medium text-navy-900 underline">Ajouter le premier</Link>
              </li>
            )}
            {items.map((p, i) => (
              <li key={p.id} className={`flex items-center gap-4 p-3 sm:p-4 ${p.published ? "" : "bg-slate-50"}`}>
                <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-100 bg-white">
                  {p.image ? <img src={p.image} alt="" loading="lazy" className="size-full object-contain" /> : <PackageSearch className="size-6 text-slate-300" />}
                </div>
                <div className="min-w-0 flex-1">
                  <Link to={`/admin/boutique/${p.id}`} className="line-clamp-1 font-medium text-navy-900 hover:underline">
                    {p.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {t.categories[categoryOf(p)]} · {t.conditions[p.condition] ?? p.condition} ·{" "}
                    <span className="font-medium text-slate-700">{p.price_da != null ? formatPrice(p.price_da, "fr") : t.priceOnRequest}</span>
                    {!p.published && " · masqué"}
                  </p>
                </div>
                <div className="hidden items-center gap-5 lg:flex">
                  <Toggle
                    checked={p.in_stock}
                    onChange={(v) => update(p, { in_stock: v }, v ? "Marqué en stock" : "Marqué sur commande")}
                    label={p.in_stock ? "En stock" : "Sur commande"}
                  />
                  <Toggle checked={p.published} onChange={(v) => update(p, { published: v }, v ? "Produit visible" : "Produit masqué")} label="Visible" />
                </div>
                <div className="flex">
                  <button type="button" aria-label="Monter" disabled={i === 0} onClick={() => move(i, -1)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30">
                    <ArrowUp className="size-4" />
                  </button>
                  <button type="button" aria-label="Descendre" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30">
                    <ArrowDown className="size-4" />
                  </button>
                </div>
                <Link to={`/admin/boutique/${p.id}`} aria-label="Modifier" className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-navy-900">
                  <Pencil className="size-4" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
