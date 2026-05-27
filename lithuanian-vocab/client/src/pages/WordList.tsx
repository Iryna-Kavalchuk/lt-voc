import { useEffect, useState } from "react";
import { api, type DictionaryEntry, type CEFRLevel, type SupportedLanguage } from "../api/client";

const POS_BADGE: Record<string, string> = {
  noun: "#6366f1",
  verb: "#0ea5e9",
  adjective: "#10b981",
  adverb: "#f59e0b",
  pronoun: "#8b5cf6",
  numeral: "#ef4444",
  preposition: "#ec4899",
  conjunction: "#14b8a6",
  interjection: "#f97316",
  phrase: "#64748b",
};

interface Props {
  lang: SupportedLanguage;
  dictionary?: string;
}

export default function WordList({ lang, dictionary }: Props) {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [levels, setLevels] = useState<CEFRLevel[]>([]);
  const [filterCat, setFilterCat] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.categories(dictionary), api.levels(dictionary)])
      .then(([cats, lvls]) => {
        setCategories(cats.categories);
        setLevels(lvls.levels);
      })
      .catch(() => {});
  }, [dictionary]);

  useEffect(() => {
    setLoading(true);
    setError("");
    api.words
      .list({ category: filterCat || undefined, level: filterLevel || undefined, dictionary: dictionary || undefined })
      .then((data) => setEntries(data.entries))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filterCat, filterLevel, dictionary]);

  const visible = entries.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.word.toLowerCase().includes(q) ||
      e.translations[lang].toLowerCase().includes(q)
    );
  });

  return (
    <div className="word-list-page">
      <div className="filters">
        <input
          type="search"
          placeholder="Search words…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-input"
        />
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="filter-select"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="filter-select"
        >
          <option value="">All levels</option>
          {levels.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="status-msg">Loading…</p>}
      {error && <p className="status-msg error">{error}</p>}

      {!loading && !error && (
        <>
          <p className="result-count">
            {visible.length} {visible.length === 1 ? "word" : "words"}
          </p>
          <div className="word-grid">
            {visible.map((entry) => (
              <div key={entry.id} className="word-card">
                <div className="word-card-header">
                  <span className="word-lt">{entry.word}</span>
                  <span
                    className="pos-badge"
                    style={{ background: POS_BADGE[entry.pos] ?? "#64748b" }}
                  >
                    {entry.pos}
                  </span>
                </div>
                <div className="word-translation">{entry.translations[lang]}</div>
                <div className="word-meta">
                  <span className="tag">{entry.category}</span>
                  <span className="tag level-tag">{entry.level}</span>
                  {entry.gender && <span className="tag">{entry.gender}</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
