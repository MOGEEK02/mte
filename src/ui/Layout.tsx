import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { DICT, LangContext, useLang, type Lang } from "../i18n";
import { contactType, track } from "../track";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useAnnouncement } from "./Announcement";
import { WhatsAppFloat } from "./WhatsAppFloat";

/** Scrolls to the #section of a link like "/#services", or to the top on a new page. */
function useScrollOnNavigate() {
  const { pathname, hash } = useLocation();
  const lastPath = useRef(pathname);
  useEffect(() => {
    const samePage = lastPath.current === pathname;
    lastPath.current = pathname;
    if (!hash) {
      if (!samePage) window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    // Glide within the page; jump straight there when arriving from another page.
    // The target section may render a frame later.
    const id = decodeURIComponent(hash.slice(1));
    const frame = requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: samePage ? "smooth" : "instant" }),
    );
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
}

/** Counts each page view and each WhatsApp, phone or e-mail link clicked (see src/track.ts). */
function useVisitStats() {
  const { pathname } = useLocation();
  useEffect(() => {
    track("view");
  }, [pathname]);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      const type = link ? contactType(link.getAttribute("href") ?? "") : null;
      if (type) track(type);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
}

/** The fixed header grows with the announcement banner; the page moves down by the same height. */
function Page() {
  const lang = useLang();
  const banner = useAnnouncement();
  useEffect(() => {
    document.documentElement.style.scrollPaddingTop = banner ? "8.5rem" : "";
  }, [banner]);
  return (
    <div className="flex min-h-screen flex-col" dir={DICT[lang].dir}>
      <a
        href="#contenu"
        className="sr-only z-[60] rounded-md bg-brand px-4 py-2 font-semibold text-navy-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {DICT[lang].skip}
      </a>
      <Header />
      <main id="contenu" className={`flex-1 ${banner ? "pt-14 sm:pt-9" : ""}`}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export function Layout({ lang }: { lang: Lang }) {
  useScrollOnNavigate();
  useVisitStats();
  useEffect(() => {
    document.documentElement.lang = DICT[lang].locale;
    document.documentElement.dir = DICT[lang].dir;
  }, [lang]);
  return (
    <LangContext.Provider value={lang}>
      <Page />
    </LangContext.Provider>
  );
}
