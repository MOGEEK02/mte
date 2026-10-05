import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { useLang } from "../i18n/LanguageProvider";
import { SITE } from "../config";
import { WhatsappIcon } from "./icons";
import LanguageSwitcher from "./LanguageSwitcher";

type Variant = "home" | "inner";

export default function Header({ variant = "home" }: { variant?: Variant }) {
  const { lang, t } = useLang();
  const isInner = variant === "inner";
  const [scrolled, setScrolled] = useState(isInner);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isInner) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isInner]);

  const solid = scrolled || menuOpen;

  // Always-dark header on home hero → readable; solid steel once scrolled / inner.
  const shellCls = solid
    ? "bg-ink/95 backdrop-blur border-b border-white/10 py-2.5"
    : "bg-gradient-to-b from-black/60 to-transparent py-4";

  const links: { to: string; label: string }[] = [
    { to: `/${lang}`, label: t.nav.home },
    { to: `/${lang}/services`, label: t.nav.services },
    { to: "/portfolio", label: t.nav.portfolio },
    { to: `/${lang}#contact`, label: t.nav.contact },
  ];

  return (
    <header className={`fixed top-0 inset-x-0 z-[100] text-white transition-all duration-300 ${shellCls}`}>
      <div className="container-mte flex items-center justify-between gap-4">
        <Link to={`/${lang}`} className="flex-shrink-0" aria-label="MTE">
          <img
            src="/images/logo%20white.png"
            alt="MTE – Électronique & automatisme industriel en Algérie"
            className="h-9 sm:h-11 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="text-sm font-semibold text-white/85 hover:text-brand transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <LanguageSwitcher dark />
          <a
            href={`tel:${SITE.phone}`}
            className="hidden xl:flex items-center gap-1.5 text-sm font-bold text-white"
            dir="ltr"
          >
            <Phone size={16} className="text-brand" />
            {SITE.phoneDisplay}
          </a>
          <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-wa !px-4 !py-2.5">
            <WhatsappIcon size={16} />
            WhatsApp
          </a>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="flex h-9 w-9 items-center justify-center rounded-md bg-wa text-white"
          >
            <WhatsappIcon size={18} />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className="text-white"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden overflow-hidden bg-ink transition-[max-height] duration-300 ${
          menuOpen ? "max-h-[420px] border-t border-white/10" : "max-h-0"
        }`}
      >
        <nav className="container-mte flex flex-col py-4">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className="py-2.5 text-base font-semibold text-white/90 hover:text-brand"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-3 flex items-center justify-between">
            <LanguageSwitcher dark />
            <a href={`tel:${SITE.phone}`} className="flex items-center gap-1.5 text-sm font-bold text-white" dir="ltr">
              <Phone size={16} className="text-brand" />
              {SITE.phoneDisplay}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
