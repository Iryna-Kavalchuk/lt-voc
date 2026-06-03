import { useState } from "react";
import Quiz from "./pages/Quiz";
import VerbList from "./pages/VerbList";
import Progress from "./pages/Progress";
import Admin from "./pages/Admin";
import VerbEditor from "./pages/VerbEditor";
import Fortune from "./pages/Fortune";
import { LangContext } from "./context/LangContext";
import { useLanguage } from "./i18n";
import "./App.css";

type Page = "quiz" | "verbs" | "progress" | "fortune";

const path = window.location.pathname;
const isAdminRoute = path === "/admin";
const isEditRoute  = path === "/edit";

export default function App() {
  const [page, setPage] = useState<Page>("quiz");
  const { lang, setLang, t } = useLanguage();

  if (isAdminRoute) {
    return (
      <LangContext.Provider value={{ lang, setLang, t }}>
        <div className="app">
          <header className="app-header">
            <div className="header-left">
              <span className="app-logo">🇱🇹</span>
              <span className="app-title">365 Verb Trainer</span>
            </div>
          </header>
          <main className="app-main">
            <Admin />
          </main>
        </div>
      </LangContext.Provider>
    );
  }

  if (isEditRoute) {
    return (
      <LangContext.Provider value={{ lang, setLang, t }}>
        <div className="app">
          <header className="app-header">
            <div className="header-left">
              <span className="app-logo">🇱🇹</span>
              <span className="app-title">365 Verb Trainer — Editor</span>
            </div>
          </header>
          <main className="app-main">
            <VerbEditor />
          </main>
        </div>
      </LangContext.Provider>
    );
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      <div className="app">
        <header className="app-header">
          <div className="header-top-row">
            <div className="header-left">
              <span className="app-logo">🇱🇹</span>
              <span className="app-title">365 Verb Trainer</span>
            </div>
            <div className="lang-toggle">
              <button
                className={`lang-btn ${lang === "en" ? "active" : ""}`}
                onClick={() => setLang("en")}
              >
                EN
              </button>
              <button
                className={`lang-btn ${lang === "ru" ? "active" : ""}`}
                onClick={() => setLang("ru")}
              >
                RU
              </button>
            </div>
          </div>
          <nav className="app-nav">
            <button
              className={`nav-btn ${page === "quiz" ? "active" : ""}`}
              onClick={() => setPage("quiz")}
            >
              {t.nav_train}
            </button>
            <button
              className={`nav-btn ${page === "verbs" ? "active" : ""}`}
              onClick={() => setPage("verbs")}
            >
              {t.nav_verblist}
            </button>
            <button
              className={`nav-btn ${page === "progress" ? "active" : ""}`}
              onClick={() => setPage("progress")}
            >
              {t.nav_progress}
            </button>
            <button
              className={`nav-btn ${page === "fortune" ? "active" : ""}`}
              onClick={() => setPage("fortune")}
            >
              {t.nav_fortune}
            </button>
          </nav>
        </header>

        <main className="app-main">
          {page === "quiz"     && <Quiz />}
          {page === "verbs"    && <VerbList />}
          {page === "progress" && <Progress />}
          {page === "fortune"  && <Fortune />}
        </main>
      </div>
    </LangContext.Provider>
  );
}
