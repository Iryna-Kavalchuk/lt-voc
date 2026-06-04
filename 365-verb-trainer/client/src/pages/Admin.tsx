import { useState } from "react";
import { api, type AdminStats, type AdminFeedback, type AdminUsers } from "../api/client";

function SessionCounts({ counts }: { counts: AdminStats["counts"] }) {
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
      <div className="admin-stat-card accent">
        <span className="admin-stat-value">{counts.total}</span>
        <span className="admin-stat-label">Total</span>
      </div>
    </div>
  );
}

function UsersSection({ adminUsers }: { adminUsers: AdminUsers }) {
  const { users } = adminUsers;
  return (
    <section className="admin-section">
      <h3 className="admin-section-title">
        Users
        <span className="admin-feedback-summary">{users.length} {users.length === 1 ? "user" : "users"}</span>
      </h3>
      {users.length === 0 ? (
        <p className="admin-feedback-empty">No activity yet.</p>
      ) : (
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User ID</th>
              <th>Points</th>
              <th>Last active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.userId}>
                <td className="admin-users-rank">{i + 1}</td>
                <td className="admin-users-id">{u.userId}</td>
                <td className="admin-users-points">{u.points}</td>
                <td className="admin-users-date">
                  {new Date(u.lastActivity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
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
  const [adminUsers, setAdminUsers] = useState<AdminUsers | null>(null);
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadAll = async (pw: string) => {
    const [data, users, fb] = await Promise.all([
      api.admin.stats(pw),
      api.admin.users(pw),
      api.admin.feedback(pw),
    ]);
    setStats(data);
    setAdminUsers(users);
    setFeedback(fb);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loadAll(input);
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
      await loadAll(password);
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
        <h3 className="admin-section-title">Sessions</h3>
        <SessionCounts counts={stats.counts} />
      </section>

      {adminUsers && <UsersSection adminUsers={adminUsers} />}

      {feedback && <FeedbackSection feedback={feedback} />}
    </div>
  );
}
