import { useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Megaphone, X } from "lucide-react";
import { announcementFor, buildInfo, contentStore } from "../content";
import { basePath, DICT, localePath, useLang, useT } from "../i18n";

// A closed banner stays closed for the rest of the visit (until its text changes).
const KEY = "mte-banner-closed";
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const readClosed = () => {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
};
const noop = () => () => {};

/** The banner set in /admin → Contenu, or null (off, past its last day, or closed by the visitor). */
// eslint-disable-next-line react-refresh/only-export-components
export function useAnnouncement() {
  const lang = useLang();
  const content = contentStore.use();
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const closed = useSyncExternalStore(subscribe, readClosed, () => null);
  // Until the app runs, decide as the pre-rendered HTML did (at build time).
  const now = mounted || !buildInfo.at ? new Date() : new Date(buildInfo.at);
  const banner = announcementFor(lang, content, now);
  return banner && closed !== banner.text ? banner : null;
}

/** Fixed height (two lines on phones, one above), so the page below can make room for it. */
export function Announcement() {
  const lang = useLang();
  const t = useT().banner;
  const banner = useAnnouncement();
  if (!banner) return null;

  const close = () => {
    try {
      sessionStorage.setItem(KEY, banner.text);
    } catch {
      // Storage unavailable: hidden until the next page.
    }
    listeners.forEach((l) => l());
  };
  const text = (
    <>
      <Megaphone className="size-4 shrink-0" />
      <span lang={banner.lang} dir={DICT[banner.lang].dir} className="line-clamp-2 sm:line-clamp-1">
        {banner.text}
      </span>
      {banner.link && <ArrowRight className="size-4 shrink-0 rtl:-scale-x-100" />}
    </>
  );
  const body = "flex min-w-0 flex-1 items-center justify-center gap-2 text-center";
  return (
    <div className={`text-sm font-medium ${banner.tone === "alert" ? "bg-red-600 text-white" : "bg-brand text-navy-950"}`}>
      <div className="container-page flex h-14 items-center gap-2 sm:h-9">
        {!banner.link ? (
          <p className={body}>{text}</p>
        ) : banner.link.startsWith("/") ? (
          <Link to={localePath(lang, basePath(banner.link))} className={`${body} hover:underline`}>
            {text}
          </Link>
        ) : (
          <a href={banner.link} target="_blank" rel="noopener noreferrer" className={`${body} hover:underline`}>
            {text}
          </a>
        )}
        <button type="button" onClick={close} aria-label={t.close} title={t.close} className="-me-1.5 shrink-0 rounded p-1.5 opacity-75 hover:opacity-100">
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
