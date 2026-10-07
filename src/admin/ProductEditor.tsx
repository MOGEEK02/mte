import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImagePlus, PackageSearch, Trash2, X } from "lucide-react";
import { DICT } from "../i18n";
import { CATEGORIES, CONDITIONS, formatPrice, type Category, type Condition, type Product } from "../products";
import { BrandIcon } from "../ui/BrandIcon";
import { compressImage } from "./image";
import { slugify } from "./slug";
import { BUCKET, errorMessage, isMissingSetup, storagePath, supabase } from "./supabase";
import { Button, Card, Field, inputClass, langProps, Loading, Notice, PageHeader, SaveBar, Toggle, useFlash, useUnsavedWarning } from "./ui";
import { AiAssist } from "./AiAssist";

type Form = {
  name: string;
  description: string;
  nameEn: string;
  descriptionEn: string;
  nameAr: string;
  descriptionAr: string;
  category: Category;
  brand: string;
  reference: string;
  condition: Condition;
  /** Dinars as typed; empty: price on request. */
  price: string;
  inStock: boolean;
  image: string;
  published: boolean;
};

const EMPTY: Form = {
  name: "",
  description: "",
  nameEn: "",
  descriptionEn: "",
  nameAr: "",
  descriptionAr: "",
  category: "drive",
  brand: "",
  reference: "",
  condition: "new",
  price: "",
  inStock: true,
  image: "",
  published: true,
};

const t = DICT.fr.store;

export default function ProductEditor() {
  const { id: param = "nouveau" } = useParams();
  const isNew = param === "nouveau";
  const navigate = useNavigate();
  const flash = useFlash();
  const [form, setForm] = useState<Form>(EMPTY);
  const [saved, setSaved] = useState(JSON.stringify(EMPTY));
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"" | "save" | "delete" | "upload">("");
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew) return;
    supabase
      .from("products")
      .select("*")
      .eq("id", Number(param) || -1)
      .maybeSingle()
      .then(({ data, error }) => {
        setLoading(false);
        if (error) return setError(isMissingSetup(error) ? "La boutique n’est pas encore préparée : exécutez la section 12 de supabase/admin.sql." : errorMessage(error));
        if (!data) return setError("Produit introuvable.");
        const p = data as Product & { published: boolean };
        const f: Form = {
          name: p.name,
          description: p.description,
          nameEn: p.name_en,
          descriptionEn: p.description_en,
          nameAr: p.name_ar,
          descriptionAr: p.description_ar,
          category: (CATEGORIES as readonly string[]).includes(p.category) ? (p.category as Category) : "other",
          brand: p.brand,
          reference: p.reference,
          condition: p.condition,
          price: p.price_da != null ? String(p.price_da) : "",
          inStock: p.in_stock,
          image: p.image,
          published: p.published,
        };
        setForm(f);
        setSaved(JSON.stringify(f));
      });
  }, [param, isNew]);

  const dirty = useMemo(() => JSON.stringify(form) !== saved, [form, saved]);
  useUnsavedWarning(dirty);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((s) => ({ ...s, [k]: v }));

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setBusy("upload");
    try {
      const blob = await compressImage(file, 1200);
      const path = `products/${slugify(form.name) || "produit"}-${Date.now()}.${blob.type === "image/webp" ? "webp" : "jpg"}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: blob.type, cacheControl: "31536000" });
      if (error) throw error;
      set("image", supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
    } catch (e) {
      flash(errorMessage(e as { message?: string; code?: string }) || "Image illisible", "error");
    } finally {
      setBusy("");
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  // Dinars have no decimals in practice: "45 000", "45.000" and "45,000" all mean 45000.
  const priceText = form.price.trim();
  const priceValid = priceText === "" || (/^[\d\s.,]+$/.test(priceText) && /\d/.test(priceText));
  const price = priceText === "" || !priceValid ? null : Number(priceText.replace(/\D/g, ""));

  const save = async () => {
    if (!form.name.trim()) return flash("Le nom du produit est obligatoire.", "error");
    if (!priceValid) return flash("Prix invalide : un nombre en dinars, ou vide pour « Prix sur demande ».", "error");
    setBusy("save");
    const before = JSON.parse(saved) as Form;
    const row = {
      name: form.name.trim(),
      description: form.description.trim(),
      name_en: form.nameEn.trim(),
      description_en: form.descriptionEn.trim(),
      name_ar: form.nameAr.trim(),
      description_ar: form.descriptionAr.trim(),
      category: form.category,
      brand: form.brand.trim(),
      reference: form.reference.trim(),
      condition: form.condition,
      price_da: price,
      in_stock: form.inStock,
      image: form.image,
      published: form.published,
      updated_at: new Date().toISOString(),
    };
    let newId: number | null = null;
    let error;
    if (isNew) {
      const { data: last } = await supabase.from("products").select("sort_order").order("sort_order", { ascending: false }).limit(1);
      const res = await supabase
        .from("products")
        .insert({ ...row, sort_order: (last?.[0]?.sort_order ?? 0) + 10 })
        .select("id")
        .single();
      error = res.error;
      newId = (res.data as { id: number } | null)?.id ?? null;
    } else {
      ({ error } = await supabase.from("products").update(row).eq("id", Number(param)));
    }
    setBusy("");
    if (error) return flash(errorMessage(error), "error");
    // A photo that was replaced is no longer used.
    const old = !isNew && before.image !== form.image ? storagePath(before.image) : null;
    if (old) await supabase.storage.from(BUCKET).remove([old]);
    flash("Produit enregistré");
    setSaved(JSON.stringify(form));
    if (isNew && newId) navigate(`/admin/boutique/${newId}`, { replace: true });
  };

  const remove = async () => {
    if (!window.confirm(`Supprimer le produit « ${form.name} » ?`)) return;
    setBusy("delete");
    const { error } = await supabase.from("products").delete().eq("id", Number(param));
    if (error) {
      setBusy("");
      return flash(errorMessage(error), "error");
    }
    const path = storagePath(form.image);
    if (path) await supabase.storage.from(BUCKET).remove([path]);
    flash("Produit supprimé");
    setSaved(JSON.stringify(form));
    navigate("/admin/boutique");
  };

  if (loading) return <Loading />;
  if (error) return <Notice tone="error">{error}</Notice>;

  return (
    <div className="pb-24">
      <Link to="/admin/boutique" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900">
        <ArrowLeft className="size-4" /> Boutique
      </Link>
      <div className="mt-3">
        <PageHeader title={isNew ? "Nouveau produit" : form.name || "Produit"} description="Une carte de la page Boutique, avec un bouton « Commander sur WhatsApp »." />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card title="Produit">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nom *" htmlFor="p-name" action={<AiAssist value={form.name} onApply={(v) => set("name", v)} lang="fr" field="title" />} className="sm:col-span-2">
                <input id="p-name" maxLength={160} className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="ex. Variateur Schneider Altivar ATV320 2,2 kW" />
              </Field>
              <Field label="Description" htmlFor="p-desc" action={<AiAssist value={form.description} onApply={(v) => set("description", v)} lang="fr" field="text" />} className="sm:col-span-2" hint="Caractéristiques, compatibilité, garantie…">
                <textarea id="p-desc" rows={5} className={inputClass} value={form.description} onChange={(e) => set("description", e.target.value)} />
              </Field>
              <Field label="Catégorie" htmlFor="p-cat">
                <select id="p-cat" className={inputClass} value={form.category} onChange={(e) => set("category", e.target.value as Category)}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{t.categories[c]}</option>
                  ))}
                </select>
              </Field>
              <Field label="État" htmlFor="p-cond">
                <select id="p-cond" className={inputClass} value={form.condition} onChange={(e) => set("condition", e.target.value as Condition)}>
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>{t.conditions[c]}</option>
                  ))}
                </select>
              </Field>
              <Field label="Marque" htmlFor="p-brand">
                <input id="p-brand" maxLength={80} className={inputClass} value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Siemens, Schneider, ABB…" />
              </Field>
              <Field label="Référence" htmlFor="p-ref">
                <input id="p-ref" maxLength={80} className={inputClass} value={form.reference} onChange={(e) => set("reference", e.target.value)} placeholder="ex. ATV320U22N4B" dir="ltr" />
              </Field>
              <Field label="Prix (DA)" htmlFor="p-price" hint={priceValid ? "Vide : « Prix sur demande »." : <span className="text-red-600">Un nombre en dinars, sans lettres.</span>}>
                <input id="p-price" inputMode="numeric" className={inputClass} value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="ex. 45000" dir="ltr" />
              </Field>
              <div className="flex flex-col justify-center gap-3 pt-1">
                <Toggle checked={form.inStock} onChange={(v) => set("inStock", v)} label={form.inStock ? "En stock" : "Sur commande"} />
                <Toggle checked={form.published} onChange={(v) => set("published", v)} label={form.published ? "Visible dans la boutique" : "Masqué"} />
              </div>
            </div>
          </Card>

          <Card title="Version anglaise (/en)" description="Vide : le texte français est affiché.">
            <div className="space-y-5">
              <Field label="Name" htmlFor="p-name-en" action={<AiAssist value={form.nameEn} onApply={(v) => set("nameEn", v)} lang="en" field="title" source={form.name} />}>
                <input id="p-name-en" {...langProps("en")} className={inputClass} value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} placeholder={form.name} />
              </Field>
              <Field label="Description" htmlFor="p-desc-en" action={<AiAssist value={form.descriptionEn} onApply={(v) => set("descriptionEn", v)} lang="en" field="text" source={form.description} />}>
                <textarea id="p-desc-en" {...langProps("en")} rows={4} className={inputClass} value={form.descriptionEn} onChange={(e) => set("descriptionEn", e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card title="Version arabe (/ar)" description="Vide : le texte français est affiché.">
            <div className="space-y-5">
              <Field label="الاسم" htmlFor="p-name-ar" action={<AiAssist value={form.nameAr} onApply={(v) => set("nameAr", v)} lang="ar" field="title" source={form.name} />}>
                <input id="p-name-ar" {...langProps("ar")} className={inputClass} value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} />
              </Field>
              <Field label="الوصف" htmlFor="p-desc-ar" action={<AiAssist value={form.descriptionAr} onApply={(v) => set("descriptionAr", v)} lang="ar" field="text" source={form.description} />}>
                <textarea id="p-desc-ar" {...langProps("ar")} rows={4} className={inputClass} value={form.descriptionAr} onChange={(e) => set("descriptionAr", e.target.value)} />
              </Field>
            </div>
          </Card>
        </div>

        <div className="space-y-6 lg:self-start">
          <Card title="Photo" description="Fond clair de préférence ; la photo est affichée en entier.">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-white">
              {form.image ? <img src={form.image} alt="" className="size-full object-contain p-3" /> : <PackageSearch className="size-12 text-slate-300" />}
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => fileInput.current?.click()} loading={busy === "upload"} className="flex-1">
                <ImagePlus className="size-4" /> {form.image ? "Changer la photo" : "Envoyer une photo"}
              </Button>
              {form.image && (
                <Button variant="ghost" onClick={() => set("image", "")} aria-label="Retirer la photo" title="Retirer la photo">
                  <X className="size-4" />
                </Button>
              )}
            </div>
            <input ref={fileInput} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0])} />
          </Card>

          <section>
            <h2 className="text-sm font-medium text-slate-700">Aperçu</h2>
            <div className="mt-3 max-w-xs overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
              <div className="relative flex aspect-square items-center justify-center bg-white">
                {form.image ? <img src={form.image} alt="" className="size-full object-contain p-4" /> : <PackageSearch className="size-10 text-slate-300" />}
                <span className="absolute top-3 left-3 rounded bg-navy-950/80 px-2 py-1 text-[11px] font-semibold text-white">{t.conditions[form.condition]}</span>
              </div>
              <div className="border-t border-slate-100 p-5">
                {(form.brand || form.reference) && (
                  <p className="text-xs font-medium text-slate-500">{[form.brand.trim(), form.reference.trim() && `${t.ref} ${form.reference.trim()}`].filter(Boolean).join(" · ")}</p>
                )}
                <h3 className="mt-1 font-semibold text-navy-900">{form.name || "Nom du produit"}</h3>
                {form.description && <p className="mt-2 line-clamp-3 text-sm text-slate-600">{form.description}</p>}
                <div className="mt-4 flex items-baseline justify-between">
                  <p className="text-lg font-bold text-navy-900">{price !== null ? formatPrice(price, "fr") : t.priceOnRequest}</p>
                  <p className={`text-xs font-semibold ${form.inStock ? "text-emerald-700" : "text-amber-700"}`}>{form.inStock ? t.inStock : t.onOrder}</p>
                </div>
                <span className="mt-3 flex items-center justify-center gap-2 rounded-md bg-[#25d366] px-3 py-2 text-sm font-semibold text-white">
                  <BrandIcon name="WhatsApp" className="size-4" /> {t.order}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <SaveBar
        dirty={dirty || isNew}
        busy={busy === "save"}
        onSave={save}
        label={isNew ? "Créer le produit" : "Enregistrer"}
        left={
          !isNew && (
            <Button variant="danger" onClick={remove} loading={busy === "delete"} disabled={busy === "save"}>
              <Trash2 className="size-4" /> <span className="hidden sm:inline">Supprimer</span>
            </Button>
          )
        }
      />
    </div>
  );
}
