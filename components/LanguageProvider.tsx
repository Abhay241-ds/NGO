"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Language = "hi" | "en";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: <T>(hi: T, en: T) => T;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Hindi is the default language on first opening.
  const [language, setLanguageState] = useState<Language>("hi");

  useEffect(() => {
    const saved = window.localStorage.getItem("site-language");
    if (saved === "hi" || saved === "en") setLanguageState(saved);
  }, []);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    window.localStorage.setItem("site-language", next);
    window.dispatchEvent(new CustomEvent("site-language-change"));
  };

  const t = <T,>(hi: T, en: T) => (language === "hi" ? hi : en);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
