import { useEffect, useState } from "react";
import { api, type ProgressData, type QuestionMode, type VerbEntry } from "../api/client";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MODE_LABEL: Record<QuestionMode, string> = {
  verb_translation:  "Transl",
  conjugation_drill: "Conj",
  main_forms:        "Forms",
  fill_blank:        "Blank",
  fill_blank_hint:   "Blank+",
};

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
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

// ---------------------------------------------------------------------------
// PointDots — 5 circles in a row
// ---------------------------------------------------------------------------

function PointDots({ earnedModes }: { earnedModes: Set<string> }) {
  return (
    <span className="point-dots">
      {ALL_MODES.map((mode) => (
        <span
          key={mode}
          className={`point-dot ${earnedModes.has(mode) ? "earned" : "empty"}`}
          title={MODE_LABEL[mode]}
        />
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main Progress component
// ---------------------------------------------------------------------------

export default function Progress() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [verbs, setVerbs] = useState<Map<number, VerbEntry>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openGroups, setOpenGroups] = useState<Set<number>>(new Set());

  useEffect(() => {
    const userId = getUserId();
    Promise.all([
      api.progress.get(userId),
      api.verbs.list(),
    ])
      .then(([progressData, verbsData]) => {
        setData(progressData);
        setVerbs(new Map(verbsData.verbs.map((v) => [v.id, v])));
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleGroup = (pts: number) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(pts)) next.delete(pts);
      else next.add(pts);
      return next;
    });
  };

  if (loading) return <div className="progress-page"><p className="status-msg">Loading…</p></div>;
  if (error)   return <div className="progress-page"><p className="status-msg error">{error}</p></div>;
  if (!data)   return null;

  // Build verb lookup from byVerb
  const verbMap = new Map<number, Set<string>>();
  for (const row of data.byVerb) {
    verbMap.set(row.verbId, new Set(row.modes));
  }

  // Group verbs by point count (1–5)
  const groups: Map<number, number[]> = new Map();
  for (let p = 5; p >= 1; p--) groups.set(p, []);

  for (const row of data.byVerb) {
    const pts = row.modes.length;
    if (pts >= 1 && pts <= 5) groups.get(pts)!.push(row.verbId);
  }

  // Count untouched verbs (0 points)
  const touchedCount = data.byVerb.length;
  const untouchedCount = 365 - touchedCount;

  const pct = Math.round((data.totalPoints / data.maxPoints) * 100);

  return (
    <div className="progress-page">
      {/* Total score */}
      <div className="progress-summary">
        <div className="progress-total">
          <span className="progress-score">{data.totalPoints}</span>
          <span className="progress-max"> / {data.maxPoints} points</span>
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="progress-pct">{pct}%</span>
      </div>

      {/* Column header */}
      <div className="progress-mode-header">
        <span className="progress-verb-col" />
        {ALL_MODES.map((m) => (
          <span key={m} className="progress-mode-col">{MODE_LABEL[m]}</span>
        ))}
      </div>

      {/* Groups 5 → 1 */}
      {[5, 4, 3, 2, 1].map((pts) => {
        const verbIds = groups.get(pts) ?? [];
        if (verbIds.length === 0) return null;
        const isOpen = openGroups.has(pts);
        return (
          <div key={pts} className="progress-group">
            <button
              className="progress-group-header"
              onClick={() => toggleGroup(pts)}
            >
              <span className="progress-group-pts">{pts} point{pts !== 1 ? "s" : ""}</span>
              <span className="progress-group-count">({verbIds.length} verbs)</span>
              <span className="progress-group-chevron">{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
              <div className="progress-group-body">
                {verbIds.sort((a, b) => a - b).map((verbId) => {
                    const earned = verbMap.get(verbId) ?? new Set();
                    const verb = verbs.get(verbId);
                    return (
                      <div key={verbId} className="progress-verb-row">
                        <span className="progress-verb-id">{verbId}.</span>
                        <span className="progress-verb-name">{verb?.infinitive ?? `#${verbId}`}</span>
                        <PointDots earnedModes={earned} />
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        );
      })}

      {/* 0 points — count only */}
      <div className="progress-group progress-group-zero">
        <div className="progress-group-header progress-group-header-zero">
          <span className="progress-group-pts">0 points</span>
          <span className="progress-group-count">({untouchedCount} verbs not yet started)</span>
        </div>
      </div>
    </div>
  );
}
