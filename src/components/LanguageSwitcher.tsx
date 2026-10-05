import { useLocation, useNavigate } from "react-router-dom";
import { useLang } from "../i18n/LanguageProvider";
import { localeFromPath, LOCALES, type Locale } from "../i18n";

/**
 * FR / EN toggle. On localized routes (/fr, /en) it navigates to the
 * matching path in the other language; on language-neutral routes
 * (e.g. /portfolio) it switches the stored locale in place.
 */
export default function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLang();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const pick = (next: Locale) => {
    if (next === lang) return;
    const seg = localeFromPath(pathname);
    if (seg) {
      navigate(`/${next}${pathname.slice(3)}`);
    } else {
      setLang(next);
    }
  };

  const base = dark ? "text-white/70" : "text-slate-500";
  const activeCls = dark
    ? "bg-white/15 text-white"
    : "bg-brand/10 text-brand";

  return (
    <div
      className={`inline-flex items-center rounded-full border p-0.5 text-xs font-bold ${
        dark ? "border-white/25" : "border-slate-200"
      }`}
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => pick(l)}
          aria-current={l === lang}
          className={`px-2.5 py-1 rounded-full uppercase tracking-wide transition-colors ${
            l === lang ? activeCls : `${base} hover:text-brand`
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
