import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { DICT, LangContext, type Lang } from "../i18n";
import { Header } from "./Header";
import { Footer } from "./Footer";

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

export function Layout({ lang }: { lang: Lang }) {
  useScrollOnNavigate();
  useEffect(() => {
    document.documentElement.lang = DICT[lang].locale;
    document.documentElement.dir = DICT[lang].dir;
  }, [lang]);
  return (
    <LangContext.Provider value={lang}>
      <div className="flex min-h-screen flex-col" dir={DICT[lang].dir}>
        <a
          href="#contenu"
          className="sr-only z-[60] rounded-md bg-brand px-4 py-2 font-semibold text-navy-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {DICT[lang].skip}
        </a>
        <Header />
        <main id="contenu" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </LangContext.Provider>
  );
}
