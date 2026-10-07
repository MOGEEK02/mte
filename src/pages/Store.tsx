import { useState } from "react";
import { PackageSearch, Store as StoreIcon } from "lucide-react";
import { useContact, whatsappLink } from "../contact";
import { contentStore, storeOpen } from "../content";
import { DICT, useLang, useT } from "../i18n";
import { categoryOf, CATEGORIES, formatPrice, productsStore, productText, type Category, type Product } from "../products";
import { BrandIcon } from "../ui/BrandIcon";
import { Seo } from "../ui/Seo";
import { storeMeta } from "../seo";

function ProductCard({ product }: { product: Product }) {
  const lang = useLang();
  const t = useT().store;
  const contact = useContact();
  const { name, description } = productText(product, lang);
  const translated = lang === "fr" || Boolean(product[`name_${lang}`]?.trim());
  const price = product.price_da != null ? formatPrice(product.price_da, lang) : null;
  const ref = product.reference.trim();
  const order = t.orderText([name, ref && `(${t.ref} ${ref})`, price && `– ${price}`].filter(Boolean).join(" "));
  return (
    <li className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="relative aspect-square bg-white">
        {product.image ? (
          <img src={product.image} alt={name} loading="lazy" referrerPolicy="no-referrer" className="size-full object-contain p-4" />
        ) : (
          <div className="flex size-full items-center justify-center bg-slate-50 text-slate-300">
            <PackageSearch className="size-12" />
          </div>
        )}
        <span className="absolute top-3 start-3 rounded bg-navy-950/80 px-2 py-1 text-[11px] font-semibold text-white">{t.conditions[product.condition] ?? t.conditions.new}</span>
      </div>
      <div className="flex flex-1 flex-col border-t border-slate-100 p-5" lang={translated ? undefined : "fr"} dir={translated ? undefined : "ltr"}>
        {(product.brand || ref) && (
          <p className="text-xs font-medium text-slate-500" lang={lang}>
            {[product.brand.trim(), ref && `${t.ref} ${ref}`].filter(Boolean).join(" · ")}
          </p>
        )}
        <h2 className="mt-1 font-semibold leading-snug text-navy-900">{name}</h2>
        {description && <p className="mt-2 line-clamp-4 text-sm leading-relaxed whitespace-pre-line text-slate-600">{description}</p>}
        <div className="mt-auto pt-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className={`text-lg font-bold ${price ? "text-navy-900" : "text-base text-slate-600"}`} lang={lang} dir={DICT[lang].dir}>
              {price ?? t.priceOnRequest}
            </p>
            <p lang={lang} className={`text-xs font-semibold ${product.in_stock ? "text-emerald-700" : "text-amber-700"}`}>
              {product.in_stock ? t.inStock : t.onOrder}
            </p>
          </div>
          <a
            href={whatsappLink(contact, order)}
            target="_blank"
            rel="noopener noreferrer"
            lang={lang}
            className="btn mt-4 w-full bg-[#25d366] text-white hover:bg-[#1ebe5b]"
          >
            <BrandIcon name="WhatsApp" className="size-4" />
            {t.order}
          </a>
        </div>
      </div>
    </li>
  );
}

function Catalogue({ products }: { products: Product[] }) {
  const t = useT().store;
  const [category, setCategory] = useState<Category | "all">("all");
  const present = CATEGORIES.filter((c) => products.some((p) => categoryOf(p) === c));
  const shown = category === "all" ? products : products.filter((p) => categoryOf(p) === category);
  return (
    <section className="bg-slate-50 py-14 sm:py-16">
      <div className="container-page">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {present.length > 1 ? (
            <ul className="flex flex-wrap gap-2">
              {(["all", ...present] as const).map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => setCategory(c)}
                    aria-pressed={category === c}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      category === c ? "bg-navy-900 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {c === "all" ? t.all : t.categories[c]}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <span />
          )}
          <p className="text-sm text-slate-500">{t.count(shown.length)}</p>
        </div>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ComingSoon() {
  const t = useT().store;
  const contact = useContact();
  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="container-page">
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xs sm:p-10">
          <span className="flex size-14 items-center justify-center rounded-full bg-brand/15 text-brand-600">
            <StoreIcon className="size-7" />
          </span>
          <p className="mt-5 inline-flex rounded-full bg-brand px-3 py-1 text-sm font-semibold text-navy-950">{t.soon}</p>
          <h2 className="mt-4 text-2xl font-bold text-navy-900">{t.text}</h2>
          <p className="mt-3 text-slate-600">{t.ctaText}</p>
          <a
            href={whatsappLink(contact, t.waText)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn mt-7 bg-[#25d366] text-white hover:bg-[#1ebe5b]"
          >
            <BrandIcon name="WhatsApp" className="size-4" />
            {t.cta}
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * Products from /admin → Boutique, ordered on WhatsApp. Until the store is opened there (or while
 * it has no product), a "coming soon" page kept out of search results.
 */
export default function Store() {
  const lang = useLang();
  const t = useT().store;
  const products = productsStore.use();
  const open = storeOpen(contentStore.use()) && products.length > 0;
  return (
    <>
      <Seo {...storeMeta(lang, open, products)} />
      <section className="bg-navy-950 pt-32 pb-14 sm:pt-36 sm:pb-16">
        <div className="container-page">
          <p className="eyebrow text-brand">{t.eyebrow}</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">{open ? t.openTitle : t.title}</h1>
          {open && <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">{t.openText}</p>}
        </div>
      </section>
      {open ? <Catalogue products={products} /> : <ComingSoon />}
    </>
  );
}
