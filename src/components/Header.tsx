import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useLang } from "../i18n/LanguageProvider";
import LanguageSwitcher from "./LanguageSwitcher";

type Variant = "home" | "inner";

const SECTIONS = ["about", "services", "process", "faq", "contact"] as const;

export default function Header({ variant = "home" }: { variant?: Variant }) {
  const { lang, t } = useLang();
  const isInner = variant === "inner";
  const [scrolled, setScrolled] = useState(isInner);
  const [active, setActive] = useState<string>("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isInner) return;
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const pos = window.scrollY + 120;
      let current = "home";
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && pos >= el.offsetTop) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isInner]);

  const solid = scrolled || menuOpen;
  const navLinks = SECTIONS.map((id) => ({ id, label: t.nav[id] }));

  const linkColor = solid ? "text-slate-700" : "text-white/85";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ${
        solid ? "bg-white shadow-sm py-2.5" : "bg-transparent py-4"
      }`}
    >
      <div className="container-mte flex items-center justify-between gap-4">
        <Link to={`/${lang}`} className="flex-shrink-0" aria-label="MTE">
          <img
            src={solid ? "/images/logo.png" : "/images/logo%20white.png"}
            alt="MTE – Automatisme & électronique industrielle en Algérie"
            className="h-9 sm:h-11 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {!isInner &&
            navLinks.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={`text-sm font-medium transition-colors hover:text-brand ${
                  active === l.id ? "text-brand" : linkColor
                }`}
              >
                {l.label}
              </a>
            ))}
          {isInner && (
            <Link
              to={`/${lang}`}
              className={`text-sm font-medium transition-colors hover:text-brand ${linkColor}`}
            >
              {t.nav.home}
            </Link>
          )}
          <Link
            to="/portfolio"
            className={`text-sm font-semibold transition-colors ${
              isInner ? "text-brand" : `hover:text-brand ${linkColor}`
            }`}
          >
            {t.nav.portfolio}
          </Link>
          <LanguageSwitcher dark={!solid} />
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher dark={!solid} />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className={solid ? "text-ink" : "text-white"}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden overflow-hidden bg-white transition-[max-height] duration-300 ${
          menuOpen ? "max-h-96 border-t border-slate-100" : "max-h-0"
        }`}
      >
        <nav className="container-mte flex flex-col py-4">
          {!isInner &&
            navLinks.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setMenuOpen(false)}
                className="py-2.5 text-base font-medium text-slate-700 hover:text-brand"
              >
                {l.label}
              </a>
            ))}
          {isInner && (
            <Link
              to={`/${lang}`}
              onClick={() => setMenuOpen(false)}
              className="py-2.5 text-base font-medium text-slate-700 hover:text-brand"
            >
              {t.nav.home}
            </Link>
          )}
          <Link
            to="/portfolio"
            onClick={() => setMenuOpen(false)}
            className="py-2.5 text-base font-semibold text-brand"
          >
            {t.nav.portfolio}
          </Link>
        </nav>
      </div>
    </header>
  );
}
