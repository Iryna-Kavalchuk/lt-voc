import { useEffect, useState } from "react";
import { api, type VerbEntry, type TenseName, type ConjugationRow } from "../api/client";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TENSES: { key: TenseName; label: string }[] = [
  { key: "present",            label: "Present" },
  { key: "past",               label: "Past" },
  { key: "subjunctive",        label: "Subjunctive" },
  { key: "future",             label: "Future" },
  { key: "imperative",         label: "Imperative" },
];

// frequentative_past is stored but not drillable — include it for editing
const ALL_TENSES: { key: string; label: string }[] = [
  ...TENSES,
  { key: "frequentative_past", label: "Freq. Past" },
];

const PERSONS: { key: keyof ConjugationRow; label: string }[] = [
  { key: "as",             label: "aš" },
  { key: "tu",             label: "tu" },
  { key: "jis_ji_jie_jos", label: "jis/ji/jie/jos" },
  { key: "mes",            label: "mes" },
  { key: "jus",            label: "jūs" },
];

const NON_CONJ_LABELS: Record<string, string> = {
  "1": "Present active participle",
  "2": "Past active participle",
  "3": "Freq. past active participle",
  "4": "Future active participle",
  "5": "Present passive participle",
  "6": "Past passive participle",
  "7": "Present adverbial participle",
  "8": "Present gerund",
  "9": "Past gerund",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function deepClone<T>(val: T): T {
  return JSON.parse(JSON.stringify(val));
}

// ---------------------------------------------------------------------------
// Single verb editor
// ---------------------------------------------------------------------------

interface VerbEditRowProps {
  verb: VerbEntry;
  password: string;
  onSaved: (updated: VerbEntry) => void;
}

function VerbEditRow({ verb: initialVerb, password, onSaved }: VerbEditRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [verb, setVerb] = useState<VerbEntry>(deepClone(initialVerb));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);

  // Reset local state when parent reloads the verb
  useEffect(() => {
    setVerb(deepClone(initialVerb));
    setDirty(false);
  }, [initialVerb]);

  const update = (updater: (v: VerbEntry) => void) => {
    setVerb((prev) => {
      const next = deepClone(prev);
      updater(next);
      return next;
    });
    setDirty(true);
    setSaveOk(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveOk(false);
    try {
      const saved = await api.verbs.update(verb, password);
      onSaved(saved);
      setDirty(false);
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 2000);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setVerb(deepClone(initialVerb));
    setDirty(false);
    setSaveError(null);
    setSaveOk(false);
  };

  return (
    <div className="verblist-item">
      {/* Collapsed header */}
      <button
        className={`verblist-header ${expanded ? "open" : ""} ${dirty ? "ed-dirty" : ""}`}
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="verblist-num">{verb.id}.</span>
        <span className="verblist-infinitive">{verb.infinitive}</span>
        <span className="verblist-forms">{verb.forms.slice(1).join(", ")}</span>
        <span className="verblist-translation">{verb.translation}</span>
        {dirty && <span className="ed-badge">unsaved</span>}
        <span className="verblist-chevron">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="verblist-detail ed-detail">

          {/* ── Header fields ── */}
          <div className="ed-section">
            <div className="ed-section-title">Basic info</div>
            <div className="ed-row">
              <label className="ed-label">Infinitive</label>
              <input className="ed-input" value={verb.infinitive}
                onChange={(e) => update((v) => { v.infinitive = e.target.value; v.forms[0] = e.target.value; })} />
            </div>
            <div className="ed-row">
              <label className="ed-label">Translation (RU)</label>
              <input className="ed-input" value={verb.translation}
                onChange={(e) => update((v) => { v.translation = e.target.value; })} />
            </div>
            <div className="ed-row">
              <label className="ed-label">Present 3rd sg</label>
              <input className="ed-input" value={verb.forms[1]}
                onChange={(e) => update((v) => { v.forms[1] = e.target.value; })} />
            </div>
            <div className="ed-row">
              <label className="ed-label">Past 3rd sg</label>
              <input className="ed-input" value={verb.forms[2]}
                onChange={(e) => update((v) => { v.forms[2] = e.target.value; })} />
            </div>
          </div>

          {/* ── Conjugation table ── */}
          <div className="ed-section">
            <div className="ed-section-title">Conjugation</div>
            <div className="conj-table-wrap">
              <table className="conj-table ed-conj-table">
                <thead>
                  <tr>
                    <th></th>
                    {ALL_TENSES.map((t) => <th key={t.key}>{t.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {PERSONS.map((p) => (
                    <tr key={p.key}>
                      <td className="conj-person">{p.label}</td>
                      {ALL_TENSES.map((t) => {
                        const tenseRow = (verb.conjugation as Record<string, Record<string, string>>)[t.key] ?? {};
                        return (
                          <td key={t.key}>
                            <input
                              className="ed-conj-input"
                              value={tenseRow[p.key] ?? ""}
                              onChange={(e) => update((v) => {
                                const row = (v.conjugation as Record<string, Record<string, string>>)[t.key];
                                if (e.target.value === "") {
                                  delete row[p.key];
                                } else {
                                  row[p.key] = e.target.value;
                                }
                              })}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Non-conjugated forms ── */}
          <div className="ed-section">
            <div className="ed-section-title">Non-conjugated forms</div>
            <div className="ed-noncj-grid">
              {Object.keys(NON_CONJ_LABELS).map((num) => (
                <div key={num} className="ed-row">
                  <label className="ed-label">{num}. {NON_CONJ_LABELS[num]}</label>
                  <input
                    className="ed-input"
                    value={verb.non_conjugated_forms[num] ?? ""}
                    onChange={(e) => update((v) => {
                      if (e.target.value === "") {
                        delete v.non_conjugated_forms[num];
                      } else {
                        v.non_conjugated_forms[num] = e.target.value;
                      }
                    })}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Examples ── */}
          <div className="ed-section">
            <div className="ed-section-title-row">
              <span className="ed-section-title">Examples</span>
              <button className="btn-ghost ed-add-btn" onClick={() =>
                update((v) => { v.examples.push({ hint: null, lt: "", ru: "" }); })
              }>+ Add</button>
            </div>
            {verb.examples.map((ex, i) => (
              <div key={i} className={`ed-example${ex.needs_review ? " ed-example-review" : ""}`}>
                <div className="ed-example-header">
                  <span className="ed-example-num">#{i + 1}</span>
                  {ex.needs_review && (
                    <span className="ed-review-badge" title="Russian translation is incomplete — needs manual fix">
                      needs review
                    </span>
                  )}
                  {ex.needs_review && (
                    <button className="btn-ghost ed-review-clear-btn" onClick={() =>
                      update((v) => { delete v.examples[i].needs_review; })
                    }>Mark reviewed</button>
                  )}
                  <button className="btn-ghost ed-remove-btn" onClick={() =>
                    update((v) => { v.examples.splice(i, 1); })
                  }>Remove</button>
                </div>
                <div className="ed-row">
                  <label className="ed-label">Hint</label>
                  <input className="ed-input" value={ex.hint ?? ""}
                    placeholder="e.g. ką?"
                    onChange={(e) => update((v) => {
                      v.examples[i].hint = e.target.value || null;
                    })} />
                </div>
                <div className="ed-row">
                  <label className="ed-label">Lithuanian</label>
                  <input className="ed-input" value={ex.lt}
                    onChange={(e) => update((v) => { v.examples[i].lt = e.target.value; })} />
                </div>
                <div className="ed-row">
                  <label className="ed-label">Russian</label>
                  <input className="ed-input" value={ex.ru}
                    onChange={(e) => update((v) => { v.examples[i].ru = e.target.value; })} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Save / Reset bar ── */}
          <div className="ed-actions">
            {saveError && <span className="ed-save-error">{saveError}</span>}
            {saveOk && <span className="ed-save-ok">Saved!</span>}
            <button className="btn-ghost" onClick={handleReset} disabled={!dirty || saving}>
              Reset
            </button>
            <button className="btn-primary" onClick={handleSave} disabled={!dirty || saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// VerbEditor page  (mounted at /edit)
// ---------------------------------------------------------------------------

export default function VerbEditor() {
  const [password, setPassword] = useState("");
  const [input, setInput] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");

  const [verbs, setVerbs] = useState<VerbEntry[]>([]);
  const [search, setSearch] = useState("");
  const [letterFilter, setLetterFilter] = useState("");
  const [needsReviewOnly, setNeedsReviewOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  // After auth load all verbs
  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    api.verbs.list()
      .then((d) => setVerbs(d.verbs))
      .catch((e: Error) => setLoadError(e.message))
      .finally(() => setLoading(false));
  }, [authed]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.ping(input);
      setPassword(input);
      setAuthed(true);
      setAuthError("");
    } catch {
      setAuthError("Wrong password or admin not configured");
    }
  };

  if (!authed) {
    return (
      <div className="admin-login">
        <h2 className="admin-login-title">Verb Editor</h2>
        <form className="admin-login-form" onSubmit={handleLogin}>
          <input
            className="filter-input"
            type="password"
            placeholder="Admin password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <button className="btn-primary" type="submit" disabled={!input}>Enter</button>
        </form>
        {authError && <p className="status-msg error">{authError}</p>}
      </div>
    );
  }

  const visible = verbs.filter((v) => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      v.infinitive.toLowerCase().includes(q) ||
      v.translation.toLowerCase().includes(q);
    const matchesLetter = !letterFilter ||
      v.infinitive.toLowerCase().startsWith(letterFilter.toLowerCase());
    const matchesReview = !needsReviewOnly ||
      v.examples.some((ex) => ex.needs_review);
    return matchesSearch && matchesLetter && matchesReview;
  });

  const letters = [...new Set(verbs.map((v) => v.infinitive[0]?.toUpperCase() ?? ""))].sort();

  return (
    <div className="verblist-page">
      <div className="filters">
        <input
          type="search"
          placeholder="Search by infinitive or translation…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setLetterFilter(""); }}
          className="filter-input"
        />
        <button
          className={`letter-btn ${needsReviewOnly ? "active" : ""}`}
          onClick={() => setNeedsReviewOnly((v) => !v)}
          title="Show only verbs with examples flagged for review"
        >
          Needs review
        </button>
      </div>

      <div className="letter-index">
        <button className={`letter-btn ${letterFilter === "" ? "active" : ""}`}
          onClick={() => setLetterFilter("")}>All</button>
        {letters.map((l) => (
          <button key={l}
            className={`letter-btn ${letterFilter === l ? "active" : ""}`}
            onClick={() => { setLetterFilter(l); setSearch(""); }}>
            {l}
          </button>
        ))}
      </div>

      {loading && <p className="status-msg">Loading verbs…</p>}
      {loadError && <p className="status-msg error">{loadError}</p>}

      {!loading && !loadError && (
        <>
          <p className="result-count">{visible.length} verbs</p>
          <div className="verblist-grid">
            {visible.map((verb) => (
              <VerbEditRow
                key={verb.id}
                verb={verb}
                password={password}
                onSaved={(updated) =>
                  setVerbs((prev) => prev.map((v) => v.id === updated.id ? updated : v))
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
