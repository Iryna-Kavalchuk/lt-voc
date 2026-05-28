import { useState, useEffect } from "react";
import WordList from "./pages/WordList";
import Quiz from "./pages/Quiz";
import Admin from "./pages/Admin";
import type { SupportedLanguage, DictionaryInfo } from "./api/client";
import { api } from "./api/client";
import "./App.css";

type Page = "words" | "quiz";

const isAdminRoute = window.location.pathname === "/admin";

export default function App() {
  const [page, setPage] = useState<Page>("quiz");
  const [lang, setLang] = useState<SupportedLanguage>("ru");
  const [dictionaries, setDictionaries] = useState<DictionaryInfo[]>([]);
  const [dictionary, setDictionary] = useState<string>("");

  useEffect(() => {
    api.dictionaries().then(({ dictionaries: dicts }) => {
      setDictionaries(dicts);
      if (dicts.length > 0) setDictionary(dicts[0].id);
    }).catch(() => {});
  }, []);

  if (isAdminRoute) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-left">
            <span className="app-logo">🇱🇹</span>
            <span className="app-title">Lithuanian Vocab</span>
          </div>
        </header>
        <main className="app-main">
          <Admin />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="app-logo">🇱🇹</span>
          <span className="app-title">Lithuanian Vocab</span>
        </div>
        <nav className="app-nav">
          <button
            className={`nav-btn ${page === "quiz" ? "active" : ""}`}
            onClick={() => setPage("quiz")}
          >
            Quiz
          </button>
          <button
            className={`nav-btn ${page === "words" ? "active" : ""}`}
            onClick={() => setPage("words")}
          >
            Word List
          </button>
        </nav>
        <div className="header-right">
          {dictionaries.length > 1 && (
            <>
              <label className="lang-label">Dictionary:</label>
              <select
                className="lang-select"
                value={dictionary}
                onChange={(e) => setDictionary(e.target.value)}
              >
                {dictionaries.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </>
          )}
          <label className="lang-label">Show in:</label>
          <select
            className="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value as SupportedLanguage)}
          >
            <option value="en">English</option>
            <option value="ru">Russian</option>
          </select>
        </div>
      </header>

      <main className="app-main">
        {page === "quiz" && <Quiz lang={lang} dictionary={dictionary} />}
        {page === "words" && <WordList lang={lang} dictionary={dictionary} />}
      </main>
    </div>
  );
}
