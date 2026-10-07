import { select } from "./db";
import { DICT, type Lang } from "./i18n";
import { createStore } from "./store";

/** Store products, edited in /admin → Boutique ("products" table). Ordered through WhatsApp. */
export const CATEGORIES = ["plc", "hmi", "drive", "board", "power", "sensor", "other"] as const;
export type Category = (typeof CATEGORIES)[number];
export const CONDITIONS = ["new", "used", "refurbished"] as const;
export type Condition = (typeof CONDITIONS)[number];

export type Product = {
  id: number;
  name: string;
  name_en: string;
  name_ar: string;
  description: string;
  description_en: string;
  description_ar: string;
  category: string;
  brand: string;
  reference: string;
  condition: Condition;
  /** Dinars; null: price on request. */
  price_da: number | null;
  in_stock: boolean;
  image: string;
  published?: boolean;
  sort_order?: number;
};

export const categoryOf = (p: Pick<Product, "category">): Category =>
  (CATEGORIES as readonly string[]).includes(p.category) ? (p.category as Category) : "other";

/** Name and description in the page's language (French when not translated). */
export function productText(p: Product, lang: Lang) {
  if (lang === "fr") return { name: p.name.trim(), description: p.description.trim() };
  return {
    name: p[`name_${lang}`]?.trim() || p.name.trim(),
    description: p[`description_${lang}`]?.trim() || p.description.trim(),
  };
}

/** "45 000 DA" / "45,000 DA" / "45 000 دج". */
export function formatPrice(da: number, lang: Lang) {
  const n = new Intl.NumberFormat(DICT[lang].dateLocale, { maximumFractionDigits: 0 }).format(da);
  return lang === "ar" ? `${n} دج` : `${n} DA`;
}

export function fetchProducts(): Promise<Product[]> {
  return select<Product>("products", { select: "*", published: "eq.true", order: "sort_order.asc,id.desc" });
}

export const productsStore = createStore<Product[]>({ key: "products", fallback: [], load: fetchProducts });
