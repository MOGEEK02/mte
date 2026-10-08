import { select } from "./db";
import type { Lang } from "./i18n";
import { CONTACT, SOCIAL } from "./site";
import { createStore } from "./store";

/** Social networks shown in the footer and given to search engines; an empty link is hidden. */
export const SOCIAL_KEYS = ["facebook", "instagram", "linkedin", "youtube", "tiktok", "github"] as const;
export type SocialKey = (typeof SOCIAL_KEYS)[number];
export type Social = Record<SocialKey, string>;

export const DEFAULT_SOCIAL: Social = {
  facebook: SOCIAL.facebook,
  instagram: SOCIAL.instagram,
  linkedin: SOCIAL.linkedin,
  youtube: "",
  tiktok: "",
  github: SOCIAL.github,
};

/** Contact details shown on the site, edited in /admin → Paramètres ("site_settings" table). */
export type Contact = {
  email: string;
  phone: string;
  /** Number used for WhatsApp links; the phone number when empty. */
  whatsapp: string;
  address: string;
  mapUrl: string;
  hours: string;
  hoursEn: string;
  hoursAr: string;
  social: Social;
  /** Round WhatsApp button in the corner of every page. */
  whatsappButton: boolean;
};

export type ContactRow = {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  map_url: string;
  hours: string;
  hours_en?: string;
  hours_ar?: string;
  /** Set once saved from /admin (empty object before: the built-in links). */
  social?: Partial<Social> | null;
  whatsapp_button?: boolean;
};

export const DEFAULT_CONTACT: Contact = {
  email: CONTACT.email,
  phone: CONTACT.phoneDisplay,
  whatsapp: CONTACT.phoneDisplay,
  address: CONTACT.address,
  mapUrl: CONTACT.mapUrl,
  hours: CONTACT.hours,
  hoursEn: CONTACT.hoursEn,
  hoursAr: CONTACT.hoursAr,
  social: DEFAULT_SOCIAL,
  whatsappButton: true,
};

/** Saved links, keeping only web addresses. */
function socialFrom(saved: Partial<Social> | null | undefined): Social {
  if (!saved || Object.keys(saved).length === 0) return DEFAULT_SOCIAL;
  const out = { ...DEFAULT_SOCIAL };
  for (const k of SOCIAL_KEYS) {
    const v = saved[k]?.trim() ?? "";
    out[k] = /^https?:\/\/\S+$/i.test(v) ? v : "";
  }
  return out;
}

/** Fills empty fields from the built-in details, so a blank field never breaks a link. */
export function fromContactRow(r: Partial<ContactRow>): Contact {
  const D = DEFAULT_CONTACT;
  return {
    email: r.email?.trim() || D.email,
    phone: r.phone?.trim() || D.phone,
    whatsapp: r.whatsapp?.trim() || r.phone?.trim() || D.whatsapp,
    address: r.address?.trim() || D.address,
    mapUrl: r.map_url?.trim() || D.mapUrl,
    hours: r.hours?.trim() || D.hours,
    hoursEn: r.hours_en?.trim() || D.hoursEn,
    hoursAr: r.hours_ar?.trim() || D.hoursAr,
    social: socialFrom(r.social),
    whatsappButton: r.whatsapp_button ?? true,
  };
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** International digits for wa.me: "0550 12 34 56" → "213550123456". */
export function whatsappDigits(phone: string) {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0")) d = `213${d.slice(1)}`;
  return d;
}

export function whatsappLink(contact: Contact, text?: string) {
  return `https://wa.me/${whatsappDigits(contact.whatsapp)}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export async function fetchContact(): Promise<Contact | undefined> {
  const [row] = await select<ContactRow>("site_settings", { select: "*", id: "eq.1" });
  return row ? fromContactRow(row) : undefined;
}

export const contactStore = createStore<Contact>({ key: "contact", fallback: DEFAULT_CONTACT, load: fetchContact });

export function useContact(): Contact {
  return contactStore.use();
}

export function hoursFor(contact: Contact, lang: Lang) {
  return lang === "en" ? contact.hoursEn : lang === "ar" ? contact.hoursAr : contact.hours;
}
