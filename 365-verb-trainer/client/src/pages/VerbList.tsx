import { useEffect, useState } from "react";
import { api, type VerbEntry, type QuestionMode } from "../api/client";
import VerbCard from "../components/VerbCard";
import { useLang } from "../context/LangContext";

const ALL_MODES: QuestionMode[] = [
  "verb_translation",
  "conjugation_drill",
  "main_forms",
  "fill_blank",
  "fill_blank_hint",
];

function getUserId(): string {
  const key = "verb_trainer_user_id";
  let id = localStorage.getItem(key);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(key, id); }
  return id;
}

function PointDots({ earnedModes, modeLabels }: { earnedModes: Set<string>; modeLabels: Record<QuestionMode, string> }) {
  return (
    <span className="point-dots">
      {ALL_MODES.map((mode) => (
        <span
          key={mode}
          className={`point-dot ${earnedModes.has(mode) ? "earned" : "empty"}`}
          title={modeLabels[mode]}
        />
      ))}
    </span>
  );
}

export default function VerbList() {
  const { t } = useLang();
  const [verbs, setVerbs] = useState<VerbEntry[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [letterFilter, setLetterFilter] = useState("");
  const [pointsMap, setPointsMap] = useState<Map<number, Set<string>>>(new Map());

  const MODE_LABELS: Record<QuestionMode, string> = {
    verb_translation:  t.mode_verb_translation,
    conjugation_drill: t.mode_conjugation_drill,
    main_forms:        t.mode_main_forms,
    fill_blank:        t.mode_fill_blank,
    fill_blank_hint:   t.mode_fill_blank_hint,
  };

  useEffect(() => {
    const userId = getUserId();
    setLoading(true);
    setError("");
    Promise.all([
      api.verbs.list(),
      api.progress.get(userId).catch(() => null),
    ])
      .then(([verbsData, progressData]) => {
        setVerbs(verbsData.verbs);
        if (progressData) {
          setPointsMap(new Map(progressData.byVerb.map((r) => [r.verbId, new Set(r.modes)])));
        }
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const visible = verbs.filter((v) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      v.infinitive.toLowerCase().includes(q) ||
      v.translation.toLowerCase().includes(q);
    const matchesLetter =
      !letterFilter ||
      v.infinitive.toLowerCase().startsWith(letterFilter.toLowerCase());
    return matchesSearch && matchesLetter;
  });

  const letters = [...new Set(verbs.map((v) => v.infinitive[0]?.toUpperCase() ?? ""))].sort();

  return (
    <div className="verblist-page">
      <div className="filters">
        <input
          type="search"
          placeholder={t.verblist_search}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setLetterFilter(""); }}
          className="filter-input"
        />
      </div>

      <div className="letter-index">
        <button
          className={`letter-btn ${letterFilter === "" ? "active" : ""}`}
          onClick={() => setLetterFilter("")}
        >
          {t.verblist_all}
        </button>
        {letters.map((l) => (
          <button
            key={l}
            className={`letter-btn ${letterFilter === l ? "active" : ""}`}
            onClick={() => { setLetterFilter(l); setSearch(""); }}
          >
            {l}
          </button>
        ))}
      </div>

      {loading && <p className="status-msg">{t.verblist_loading}</p>}
      {error && <p className="status-msg error">{error}</p>}

      {!loading && !error && (
        <>
          <p className="result-count">{t.verblist_count(visible.length)}</p>
          <div className="verblist-grid">
            {visible.map((verb) => (
              <div key={verb.id} className="verblist-item">
                <button
                  className={`verblist-header ${expanded === verb.id ? "open" : ""}`}
                  onClick={() => setExpanded(expanded === verb.id ? null : verb.id)}
                >
                  <span className="verblist-num">{verb.id}.</span>
                  <span className="verblist-infinitive">{verb.infinitive}</span>
                  <span className="verblist-forms">{verb.forms.slice(1).join(", ")}</span>
                  <span className="verblist-translation">{verb.translation}</span>
                  <PointDots earnedModes={pointsMap.get(verb.id) ?? new Set()} modeLabels={MODE_LABELS} />
                  <span className="verblist-chevron">{expanded === verb.id ? "▲" : "▼"}</span>
                </button>

                {expanded === verb.id && (
                  <div className="verblist-detail">
                    <VerbCard verb={verb} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
