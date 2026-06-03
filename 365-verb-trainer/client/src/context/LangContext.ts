import { createContext, useContext } from "react";
import type { Translations, Lang } from "../i18n";

interface LangContextValue {
  t: Translations;
  lang: Lang;
  setLang: (l: Lang) => void;
}

export const LangContext = createContext<LangContextValue | null>(null);

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangContext.Provider");
  return ctx;
}
