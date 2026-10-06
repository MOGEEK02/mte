import { useSyncExternalStore } from "react";
import { select } from "./db";
import { CONTACT } from "./site";

/** Contact details shown on the site, edited in /admin → Paramètres ("site_settings" table). */
export type Contact = {
  email: string;
  phone: string;
  /** Number used for WhatsApp links; the phone number when empty. */
  whatsapp: string;
  address: string;
  mapUrl: string;
  hours: string;
};

export type ContactRow = { email: string; phone: string; whatsapp: string; address: string; map_url: string; hours: string };

const DEFAULTS: Contact = {
  email: CONTACT.email,
  phone: CONTACT.phoneDisplay,
  whatsapp: CONTACT.phoneDisplay,
  address: CONTACT.address,
  mapUrl: CONTACT.mapUrl,
  hours: CONTACT.hours,
};

/** Fills empty fields from the built-in details, so a blank field never breaks a link. */
export function fromContactRow(r: Partial<ContactRow>): Contact {
  return {
    email: r.email?.trim() || DEFAULTS.email,
    phone: r.phone?.trim() || DEFAULTS.phone,
    whatsapp: r.whatsapp?.trim() || r.phone?.trim() || DEFAULTS.whatsapp,
    address: r.address?.trim() || DEFAULTS.address,
    mapUrl: r.map_url?.trim() || DEFAULTS.mapUrl,
    hours: r.hours?.trim() || DEFAULTS.hours,
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

// --- Live value: last known copy first (browser cache or built-in), then the database. ---

const CACHE_KEY = "mte-contact-v1";

function readCache(): Contact | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Contact) : null;
  } catch {
    return null;
  }
}

let snapshot: Contact = readCache() ?? DEFAULTS;
const listeners = new Set<() => void>();
let started = false;

function load() {
  if (started) return;
  started = true;
  select<ContactRow>("site_settings", { select: "email,phone,whatsapp,address,map_url,hours", id: "eq.1" }).then(([row]) => {
    if (!row) return;
    snapshot = fromContactRow(row);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(snapshot));
    } catch {
      // Storage unavailable: fetched again next visit.
    }
    listeners.forEach((l) => l());
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useContact(): Contact {
  load();
  return useSyncExternalStore(subscribe, () => snapshot, () => snapshot);
}
