import { useState } from "react";
import Quiz from "./pages/Quiz";
import VerbList from "./pages/VerbList";
import Progress from "./pages/Progress";
import Admin from "./pages/Admin";
import VerbEditor from "./pages/VerbEditor";
import Fortune from "./pages/Fortune";
import "./App.css";

type Page = "quiz" | "verbs" | "progress" | "fortune";

const path = window.location.pathname;
const isAdminRoute = path === "/admin";
const isEditRoute  = path === "/edit";

export default function App() {
  const [page, setPage] = useState<Page>("quiz");

  if (isAdminRoute) {
    return (
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
    );
  }

  if (isEditRoute) {
    return (
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
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="app-logo">🇱🇹</span>
          <span className="app-title">365 Verb Trainer</span>
        </div>
        <nav className="app-nav">
          <button
            className={`nav-btn ${page === "quiz" ? "active" : ""}`}
            onClick={() => setPage("quiz")}
          >
            Train
          </button>
          <button
            className={`nav-btn ${page === "verbs" ? "active" : ""}`}
            onClick={() => setPage("verbs")}
          >
            Verb List
          </button>
          <button
            className={`nav-btn ${page === "progress" ? "active" : ""}`}
            onClick={() => setPage("progress")}
          >
            Progress
          </button>
          <button
            className={`nav-btn ${page === "fortune" ? "active" : ""}`}
            onClick={() => setPage("fortune")}
          >
            Fortune
          </button>
        </nav>
      </header>

      <main className="app-main">
        {page === "quiz" && <Quiz />}
        {page === "verbs" && <VerbList />}
        {page === "progress" && <Progress />}
        {page === "fortune" && <Fortune />}
      </main>
    </div>
  );
}
