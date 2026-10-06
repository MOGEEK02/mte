import { useSyncExternalStore } from "react";

/**
 * Data embedded in pre-rendered pages (scripts/prerender.mjs), so the browser starts with
 * exactly what the HTML shows. Keys match the stores below.
 */
export type PageData = Record<string, unknown>;

declare global {
  interface Window {
    __MTE_DATA__?: PageData;
  }
}

const isServer = typeof window === "undefined";

function readCache<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * A value shared by the whole site: starts from the page's embedded data, the browser cache or
 * the built-in fallback, then refreshes once from the database. On the server it only holds
 * what the pre-renderer gives it (prime) and never fetches.
 */
export function createStore<T>(opts: { key: string; fallback: T; load: () => Promise<T | undefined> }) {
  const embedded = !isServer ? (window.__MTE_DATA__?.[opts.key] as T | undefined) : undefined;
  let snapshot: T = embedded ?? readCache<T>(`mte-${opts.key}-v3`) ?? opts.fallback;
  let started = isServer;
  const listeners = new Set<() => void>();

  const set = (value: T) => {
    snapshot = value;
    listeners.forEach((l) => l());
  };

  const start = () => {
    if (started) return;
    started = true;
    opts.load().then((value) => {
      if (value === undefined) return;
      try {
        localStorage.setItem(`mte-${opts.key}-v3`, JSON.stringify(value));
      } catch {
        // Storage unavailable: fetched again next visit.
      }
      set(value);
    });
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return {
    use(): T {
      start();
      return useSyncExternalStore(subscribe, () => snapshot, () => snapshot);
    },
    get: () => snapshot,
    /** Pre-renderer: use this value and never fetch. */
    prime(value: T) {
      snapshot = value;
      started = true;
    },
  };
}
