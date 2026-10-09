import { track } from "@vercel/analytics";

/**
 * Lightweight, SSR-safe analytics event helper (Vercel Web Analytics).
 * Use for conversion tracking: WhatsApp clicks, quote submissions, calls.
 * If Google Analytics (gtag) is added later, it is forwarded automatically.
 */
export function trackEvent(name: string, props?: Record<string, string>) {
  if (typeof window === "undefined") return;
  try {
    track(name, props);
  } catch {
    /* ignore */
  }
  try {
    const w = window as unknown as { gtag?: (...a: unknown[]) => void };
    if (typeof w.gtag === "function") {
      w.gtag("event", name, props ?? {});
    }
  } catch {
    /* ignore */
  }
}

export const trackWhatsApp = (location: string) =>
  trackEvent("whatsapp_click", { location });
