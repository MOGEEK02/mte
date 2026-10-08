/**
 * Visit statistics shown in /admin → Tableau de bord. Each page view and each WhatsApp, phone,
 * e-mail or quote-form contact is sent to /api/track: the page, its number in the visit, the site
 * the visit came from and, on the first page, whether this browser has been here before. No cookie
 * and no identifier; the device, browser and approximate place are worked out on the server.
 */
export type TrackEvent = "view" | "whatsapp" | "call" | "email" | "quote";

const OFF_KEY = "mte-no-track";
const VISIT_KEY = "mte-visit";
const SOURCE_KEY = "mte-source";
const SEEN_KEY = "mte-seen";

/**
 * The admin's own visits are not counted on a device where /admin was opened ("1"), unless
 * switched back on from the dashboard ("0").
 */
export function trackingOff(): boolean {
  try {
    return localStorage.getItem(OFF_KEY) === "1";
  } catch {
    return false;
  }
}

export function setTrackingOff(off: boolean) {
  try {
    localStorage.setItem(OFF_KEY, off ? "1" : "0");
  } catch {
    // Storage unavailable: nothing to remember.
  }
}

/** First time /admin is opened on this device: stop counting its visits. */
export function excludeThisDevice() {
  try {
    if (localStorage.getItem(OFF_KEY) === null) localStorage.setItem(OFF_KEY, "1");
  } catch {
    // Storage unavailable.
  }
}

function blocked() {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return trackingOff() || nav.doNotTrack === "1" || nav.globalPrivacyControl === true || /^(localhost|127\.|\[::1\])/.test(location.hostname);
}

/** Number of the page in this visit (the tab's session): 1 for the first one, 0 if unknown. */
function pageOfVisit(next: boolean) {
  try {
    const n = Number(sessionStorage.getItem(VISIT_KEY)) || 0;
    if (!next) return n;
    sessionStorage.setItem(VISIT_KEY, String(n + 1));
    return n + 1;
  } catch {
    return 0;
  }
}

/** Whether this browser has visited the site before (a yes/no flag, nothing that identifies it). */
function seenBefore() {
  try {
    const seen = localStorage.getItem(SEEN_KEY) === "1";
    if (!seen) localStorage.setItem(SEEN_KEY, "1");
    return seen;
  } catch {
    return false;
  }
}

/** The site this visit came from, kept for the contacts made during the visit. */
function visitSource(entry: boolean) {
  try {
    if (entry) sessionStorage.setItem(SOURCE_KEY, referrerHost());
    return sessionStorage.getItem(SOURCE_KEY) ?? "";
  } catch {
    return entry ? referrerHost() : "";
  }
}

function referrerHost() {
  try {
    const host = document.referrer ? new URL(document.referrer).hostname : "";
    return host && host !== location.hostname ? host : "";
  } catch {
    return "";
  }
}

export function track(type: TrackEvent) {
  if (typeof window === "undefined" || blocked()) return;
  const page = pageOfVisit(type === "view");
  const entry = type === "view" && page === 1;
  const body = JSON.stringify({
    type,
    path: location.pathname,
    entry,
    page,
    referrer: entry || type !== "view" ? visitSource(entry) : "",
    returning: entry ? seenBefore() : undefined,
  });
  try {
    if (navigator.sendBeacon?.("/api/track", body)) return;
  } catch {
    // Fall back to fetch below.
  }
  fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
}

/** WhatsApp, phone and e-mail links anywhere on the page. */
export function contactType(href: string): TrackEvent | null {
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)) return "whatsapp";
  if (/^tel:/i.test(href)) return "call";
  if (/^mailto:/i.test(href)) return "email";
  return null;
}
