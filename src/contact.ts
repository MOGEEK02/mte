import { select } from "./db";
import type { Lang } from "./i18n";
import { CONTACT } from "./site";
import { createStore } from "./store";

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
};

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

// CV links shown in the About section ("resume_links" table).
export type CvLinks = { fr: string; en: string };

export async function fetchCv(): Promise<CvLinks | undefined> {
  const [row] = await select<{ url_fr: string | null; url_en: string | null }>("resume_links", { select: "url_fr,url_en", limit: "1" });
  return row ? { fr: row.url_fr || "", en: row.url_en || "" } : undefined;
}

export const cvStore = createStore<CvLinks>({ key: "cv", fallback: { fr: "", en: "" }, load: fetchCv });
