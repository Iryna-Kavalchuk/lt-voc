import { useState } from "react";
import { api, type AdminStats, type AdminFeedback, type HistogramBucket } from "../api/client";

function Histogram({ buckets }: { buckets: HistogramBucket[] }) {
  const maxCount = Math.max(...buckets.map((b) => b.count), 1);
  return (
    <div className="histogram">
      {buckets.map((b) => (
        <div key={b.label} className="histogram-col">
          <span className="histogram-count">{b.count > 0 ? b.count : ""}</span>
          <div
            className="histogram-bar"
            style={{ height: `${Math.round((b.count / maxCount) * 100)}%` }}
          />
          <span className="histogram-label">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

function StatCards({ counts, accuracy }: { counts: AdminStats["counts"]; accuracy: AdminStats["accuracy"] }) {
  return (
    <div className="admin-stat-grid">
      <div className="admin-stat-card">
        <span className="admin-stat-value">{counts.today}</span>
        <span className="admin-stat-label">Today</span>
      </div>
      <div className="admin-stat-card">
        <span className="admin-stat-value">{counts.week}</span>
        <span className="admin-stat-label">This week</span>
      </div>
      <div className="admin-stat-card">
        <span className="admin-stat-value">{counts.month}</span>
        <span className="admin-stat-label">This month</span>
      </div>
      <div className="admin-stat-card">
        <span className="admin-stat-value">{counts.total}</span>
        <span className="admin-stat-label">Total</span>
      </div>
      <div className="admin-stat-card accent">
        <span className="admin-stat-value">{accuracy.avg}%</span>
        <span className="admin-stat-label">Avg accuracy</span>
      </div>
      <div className="admin-stat-card">
        <span className="admin-stat-value">{accuracy.min}%</span>
        <span className="admin-stat-label">Min accuracy</span>
      </div>
      <div className="admin-stat-card">
        <span className="admin-stat-value">{accuracy.max}%</span>
        <span className="admin-stat-label">Max accuracy</span>
      </div>
    </div>
  );
}

function FeedbackSection({ feedback }: { feedback: AdminFeedback }) {
  return (
    <section className="admin-section">
      <h3 className="admin-section-title">
        Feedback
        <span className="admin-feedback-summary">
          {feedback.total} {feedback.total === 1 ? "entry" : "entries"}
          {feedback.avg_rating != null && (
            <> · avg {feedback.avg_rating.toFixed(1)} ★</>
          )}
        </span>
      </h3>
      {feedback.entries.length === 0 ? (
        <p className="admin-feedback-empty">No feedback yet.</p>
      ) : (
        <ul className="admin-feedback-list">
          {feedback.entries.map((entry) => (
            <li key={entry.id} className="admin-feedback-item">
              <div className="admin-feedback-meta">
                <span className="admin-feedback-stars">
                  {"★".repeat(entry.rating)}{"☆".repeat(5 - entry.rating)}
                </span>
                <span className="admin-feedback-lang">{entry.lang}</span>
                <span className="admin-feedback-date">
                  {new Date(entry.created_at).toLocaleString()}
                </span>
              </div>
              {entry.comment && (
                <p className="admin-feedback-comment">{entry.comment}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [input, setInput] = useState("");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const [data, fb] = await Promise.all([
        api.admin.stats(input),
        api.admin.feedback(input),
      ]);
      setStats(data);
      setFeedback(fb);
      setPassword(input);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [data, fb] = await Promise.all([
        api.admin.stats(password),
        api.admin.feedback(password),
      ]);
      setStats(data);
      setFeedback(fb);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!stats) {
    return (
      <div className="admin-login">
        <h2 className="admin-login-title">Admin</h2>
        <form className="admin-login-form" onSubmit={handleLogin}>
          <input
            className="filter-input"
            type="password"
            placeholder="Enter admin password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <button className="btn-primary" type="submit" disabled={loading || !input}>
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
        {error && <p className="status-msg error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2 className="admin-page-title">Statistics</h2>
        <button className="btn-ghost" onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <section className="admin-section">
        <h3 className="admin-section-title">All sessions</h3>
        <StatCards counts={stats.counts} accuracy={stats.accuracy} />
        <Histogram buckets={stats.histogram} />
      </section>

      {feedback && <FeedbackSection feedback={feedback} />}
    </div>
  );
}
