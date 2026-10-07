/**
 * Visit statistics shown in /admin → Tableau de bord. Each page view and each WhatsApp, phone,
 * e-mail or quote-form contact is sent to /api/track: the page, the referring site (first page
 * of a visit only) and nothing else. No cookie and no identifier; the device type and country
 * are worked out on the server.
 */
export type TrackEvent = "view" | "whatsapp" | "call" | "email" | "quote";

const OFF_KEY = "mte-no-track";
const VISIT_KEY = "mte-visit";

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

/** First page of this visit (the tab's session); its referring site is kept. */
function firstOfVisit() {
  try {
    if (sessionStorage.getItem(VISIT_KEY)) return false;
    sessionStorage.setItem(VISIT_KEY, "1");
    return true;
  } catch {
    return false;
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
  const entry = type === "view" && firstOfVisit();
  const body = JSON.stringify({ type, path: location.pathname, entry, referrer: entry ? referrerHost() : "" });
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
