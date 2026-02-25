// src/contexts/locale-context.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Locale = "en" | "fr" | "ar";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(
  undefined,
);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Initialize from localStorage or browser language
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(
      "gbreplai:locale",
    ) as Locale | null;

    if (stored === "en" || stored === "fr" || stored === "ar") {
      setLocaleState(stored);
      return;
    }

    const browserLang =
      typeof navigator !== "undefined"
        ? navigator.language || ""
        : "";

    if (browserLang.startsWith("fr")) {
      setLocaleState("fr");
    } else if (browserLang.startsWith("ar")) {
      setLocaleState("ar");
    } else {
      setLocaleState("en");
    }
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("gbreplai:locale", next);
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error(
      "useLocale must be used within a LocaleProvider",
    );
  }
  return ctx;
}
