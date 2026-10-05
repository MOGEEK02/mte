import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import {
  DEFAULT_LOCALE,
  dictionaries,
  localeFromPath,
  type Dictionary,
  type Locale,
} from "./index";

const STORAGE_KEY = "mte-lang";

interface LanguageContextValue {
  lang: Locale;
  other: Locale;
  t: Dictionary;
  /** Path on the home page for the other language ("/fr" ⇄ "/en"). */
  switchPath: string;
  /** Set the language on language-neutral routes (e.g. /portfolio). */
  setLang: (lang: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStored(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "fr" || v === "en" ? v : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

/**
 * Derives the active locale from the URL ("/fr", "/en") when present,
 * otherwise falls back to the last stored choice (used on the
 * language-neutral /portfolio routes). Keeps localStorage in sync.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const fromPath = localeFromPath(pathname);
  const [stored, setStored] = useState<Locale>(readStored);

  const lang: Locale = fromPath ?? stored;

  useEffect(() => {
    if (fromPath && fromPath !== stored) {
      setStored(fromPath);
      try {
        window.localStorage.setItem(STORAGE_KEY, fromPath);
      } catch {
        /* ignore */
      }
    }
  }, [fromPath, stored]);

  const value = useMemo<LanguageContextValue>(() => {
    const other: Locale = lang === "fr" ? "en" : "fr";
    const setLang = (next: Locale) => {
      setStored(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
    };
    return {
      lang,
      other,
      t: dictionaries[lang],
      switchPath: `/${other}`,
      setLang,
    };
  }, [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLang must be used within a LanguageProvider");
  }
  return ctx;
}
