import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const LINKS = [
  { to: "/#services", label: "Services" },
  { to: "/#methode", label: "Méthode" },
  { to: "/#a-propos", label: "À propos" },
  { to: "/portfolio", label: "Réalisations" },
  { to: "/#faq", label: "FAQ" },
] as const;

/** Transparent over the home hero, solid everywhere else and once scrolled. */
export function Header() {
  const { pathname } = useLocation();
  const overHero = pathname === "/";
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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-slate-200 bg-white/95 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 lg:h-20">
        <Link to="/" className="shrink-0" aria-label="MTE – accueil">
          <img
            src={solid ? "/images/logo.png" : "/images/logo%20white.png"}
            alt="MTE Industrial Electronics"
            width={900}
            height={384}
            className="h-9 w-auto lg:h-11"
          />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors ${
                solid ? "text-slate-700 hover:text-navy-900" : "text-white/85 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/#contact" className="btn-primary py-2.5">
            Demander un devis
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className={`-me-2 rounded-md p-2 lg:hidden ${solid ? "text-navy-900" : "text-white"}`}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <nav id="menu-mobile" aria-label="Navigation mobile" className="border-t border-slate-200 bg-white lg:hidden">
          <ul className="container-page flex flex-col py-3">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-medium text-slate-800"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 pb-3">
              <Link to="/#contact" onClick={() => setOpen(false)} className="btn-primary w-full">
                Demander un devis
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
