import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { basePath, LANG_LABELS, LANGS, localePath, useLang, useT } from "../i18n";
import { Announcement } from "./Announcement";

const DICT_LOCALE = { fr: "fr", en: "en", ar: "ar" } as const;

/** Transparent over the home hero, solid everywhere else and once scrolled. */
export function Header() {
  const lang = useLang();
  const t = useT();
  const { pathname, hash } = useLocation();
  const base = basePath(pathname);
  const overHero = base === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const solid = !overHero || scrolled || open;
  const to = (path: string) => localePath(lang, path);
  const links = [
    { to: to("/#services"), label: t.nav.services },
    { to: to("/#methode"), label: t.nav.method },
    { to: to("/#a-propos"), label: t.nav.about },
    { to: to("/portfolio"), label: t.nav.work },
    { to: to("/store"), label: t.nav.store },
    { to: to("/#faq"), label: t.nav.faq },
  ];
  // FR · EN · عربي — the same page in each language. The Arabic label uses the system font so
  // French and English pages don't download the Arabic web font just for it.
  const switcher = (light: boolean) => (
    <ul aria-label={t.languages} className="flex items-center gap-0.5 text-sm font-semibold">
      {LANGS.map((l) => (
        <li key={l}>
          {l === lang ? (
            <span aria-current="true" className={`block rounded-md px-1.5 py-1 ${light ? "text-white" : "text-navy-900"} underline decoration-brand decoration-2 underline-offset-4`}>
              {LANG_LABELS[l].short}
            </span>
          ) : (
            <Link
              to={localePath(l, base) + hash}
              hrefLang={DICT_LOCALE[l]}
              lang={DICT_LOCALE[l]}
              title={LANG_LABELS[l].name}
              className={`block rounded-md px-1.5 py-1 transition-colors ${light ? "text-white/70 hover:text-white" : "text-slate-500 hover:text-navy-900"} ${l === "ar" ? "font-[system-ui]" : ""}`}
            >
              {LANG_LABELS[l].short}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-slate-200 bg-white/95 backdrop-blur" : "bg-transparent"
      }`}
    >
      <Announcement />
      <div className="container-page flex h-16 items-center justify-between gap-6 lg:h-20">
        <Link to={to("/")} className="shrink-0" aria-label={t.nav.home}>
          <img
            src={solid ? "/images/logo.png" : "/images/logo%20white.png"}
            alt="MTE Industrial Electronics"
            width={900}
            height={384}
            className="h-9 w-auto lg:h-11"
          />
        </Link>

        <nav aria-label={t.nav.main} className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors ${solid ? "text-slate-700 hover:text-navy-900" : "text-white/85 hover:text-white"}`}
            >
              {l.label}
            </Link>
          ))}
          {switcher(!solid)}
          <Link to={to("/#contact")} className="btn-primary py-2.5">
            {t.nav.quote}
          </Link>
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
          {switcher(!solid)}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? t.nav.close : t.nav.open}
            className={`-me-2 rounded-md p-2 ${solid ? "text-navy-900" : "text-white"}`}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-mobile" aria-label={t.nav.mobile} className="border-t border-slate-200 bg-white lg:hidden">
          <ul className="container-page flex flex-col py-3">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} onClick={() => setOpen(false)} className="block py-3 text-base font-medium text-slate-800">
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 pb-3">
              <Link to={to("/#contact")} onClick={() => setOpen(false)} className="btn-primary w-full">
                {t.nav.quote}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
