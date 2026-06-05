import { useState, useEffect, useRef } from "react";
import Quiz from "./pages/Quiz";
import VerbList from "./pages/VerbList";
import Progress from "./pages/Progress";
import Admin from "./pages/Admin";
import VerbEditor from "./pages/VerbEditor";
import Fortune from "./pages/Fortune";
import About from "./pages/About";
import Rules from "./pages/Rules";
import { LangContext } from "./context/LangContext";
import { useLanguage } from "./i18n";
import "./App.css";

type Page = "quiz" | "verbs" | "progress" | "fortune" | "about" | "rules";

const path = window.location.pathname;
const isAdminRoute = path === "/admin";
const isEditRoute  = path === "/edit";

export default function App() {
  const [page, setPage] = useState<Page>("quiz");
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  function navigate(p: Page) {
    setPage(p);
    setMenuOpen(false);
  }

  const navItems: { key: Page; label: string }[] = [
    { key: "quiz",     label: t.nav_train },
    { key: "verbs",    label: t.nav_verblist },
    { key: "progress", label: t.nav_progress },
    { key: "fortune",  label: t.nav_fortune },
    { key: "rules",    label: t.nav_rules },
    { key: "about",    label: t.nav_about },
  ];

  if (isAdminRoute) {
    return (
      <LangContext.Provider value={{ lang, setLang, t }}>
        <div className="app">
          <header className="app-header">
            <div className="header-left">
              <img src="/book-cover.jpg" alt="" className="app-logo-img" />
              <span className="app-title">365 VERBS — Admin</span>
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
              <img src="/book-cover.jpg" alt="" className="app-logo-img" />
              <span className="app-title">365 VERBS — Editor</span>
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
        <header className="app-header" ref={menuRef}>
          <div className="header-top-row">
            <div className="header-left">
              <img src="/book-cover.jpg" alt="" className="app-logo-img" />
              <span className="app-title">{t.app_title}</span>
            </div>
            <div className="header-right">
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
                <button
                  className={`lang-btn ${lang === "lt" ? "active" : ""}`}
                  onClick={() => setLang("lt")}
                >
                  LT
                </button>
              </div>
              <button
                className={`hamburger-btn ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Toggle navigation"
              >
                <span /><span /><span />
              </button>
            </div>
          </div>

          {/* Desktop nav — hidden on mobile via CSS */}
          <nav className="app-nav">
            {navItems.map(({ key, label }) => (
              <button
                key={key}
                className={`nav-btn ${page === key ? "active" : ""}`}
                onClick={() => navigate(key)}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Mobile dropdown */}
          {menuOpen && (
            <nav className="mobile-nav">
              {navItems.map(({ key, label }) => (
                <button
                  key={key}
                  className={`mobile-nav-btn ${page === key ? "active" : ""}`}
                  onClick={() => navigate(key)}
                >
                  {label}
                </button>
              ))}
            </nav>
          )}
        </header>

        <main className="app-main">
          {page === "quiz"     && <Quiz />}
          {page === "verbs"    && <VerbList />}
          {page === "progress" && <Progress />}
          {page === "fortune"  && <Fortune />}
          {page === "rules"    && <Rules />}
          {page === "about"    && <About />}
        </main>
      </div>
    </LangContext.Provider>
  );
}
