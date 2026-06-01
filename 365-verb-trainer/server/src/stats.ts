import { pool } from "./db.js";

// ---------------------------------------------------------------------------
// Session results
// ---------------------------------------------------------------------------

export interface SaveResultInput {
  sessionId: string;
  score: number;
  total: number;
  durationS: number;
}

export interface SaveResultOutput {
  id: number;
  percentile: number;
  totalResults: number;
}

export async function saveResult(input: SaveResultInput): Promise<SaveResultOutput> {
  const { sessionId, score, total, durationS } = input;

  const insertRes = await pool.query<{ id: number }>(
    `INSERT INTO verb_quiz_results (session_id, score, total, duration_s)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [sessionId, score, total, durationS]
  );
  const id = insertRes.rows[0].id;
  const accuracy = score / total;

  const percentileRes = await pool.query<{ percentile: number; total_results: number }>(
    `SELECT
       ROUND(
         100.0 * COUNT(*) FILTER (WHERE CAST(score AS NUMERIC) / total < $1)
         / COUNT(*),
         0
       )::int AS percentile,
       COUNT(*)::int AS total_results
     FROM verb_quiz_results`,
    [accuracy]
  );

  const row = percentileRes.rows[0];
  return {
    id,
    percentile: row.percentile ?? 0,
    totalResults: row.total_results,
  };
}

// ---------------------------------------------------------------------------
// Spaced repetition
// ---------------------------------------------------------------------------

/**
 * Record the outcome of answering a question about a verb.
 * Uses a simple interval-doubling algorithm:
 *   - Correct: interval = max(1, interval * 2), capped at 30 days
 *   - Wrong:   interval = 0 (due immediately)
 */
export async function recordAnswer(
  userId: string,
  verbId: number,
  correct: boolean
): Promise<void> {
  // Upsert: create or update the progress row
  await pool.query(
    `INSERT INTO verb_progress (user_id, verb_id, correct_count, wrong_count, interval_days, next_review_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW() + ($5 * INTERVAL '1 day'), NOW())
     ON CONFLICT (user_id, verb_id) DO UPDATE SET
       correct_count  = verb_progress.correct_count  + $3,
       wrong_count    = verb_progress.wrong_count    + $4,
       interval_days  = CASE
         WHEN $6 THEN LEAST(GREATEST(verb_progress.interval_days * 2, 1), 30)
         ELSE 0
       END,
       next_review_at = CASE
         WHEN $6 THEN NOW() + (LEAST(GREATEST(verb_progress.interval_days * 2, 1), 30) * INTERVAL '1 day')
         ELSE NOW()
       END,
       updated_at     = NOW()`,
    [userId, verbId, correct ? 1 : 0, correct ? 0 : 1, correct ? 1 : 0, correct]
  );
}

/**
 * Return verb IDs that are due for review (next_review_at <= NOW()) for this user.
 */
export async function getDueVerbIds(userId: string): Promise<Set<number>> {
  const res = await pool.query<{ verb_id: number }>(
    `SELECT verb_id FROM verb_progress
     WHERE user_id = $1 AND next_review_at <= NOW()`,
    [userId]
  );
  return new Set(res.rows.map((r) => r.verb_id));
}

// ---------------------------------------------------------------------------
// Verb points (Option C: earned on correct, lost on wrong)
// ---------------------------------------------------------------------------

/**
 * Record a point for (userId, verbId, mode).
 * Returns true if a NEW point was just earned (row didn't exist before).
 */
export async function earnPoint(
  userId: string,
  verbId: number,
  mode: string
): Promise<boolean> {
  const res = await pool.query(
    `INSERT INTO verb_points (user_id, verb_id, mode)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, verb_id, mode) DO NOTHING`,
    [userId, verbId, mode]
  );
  return (res.rowCount ?? 0) > 0;
}

/**
 * Remove a point for (userId, verbId, mode) on wrong answer.
 * Returns true if a point was actually lost (row existed and was deleted).
 */
export async function losePoint(
  userId: string,
  verbId: number,
  mode: string
): Promise<boolean> {
  const res = await pool.query(
    `DELETE FROM verb_points
     WHERE user_id = $1 AND verb_id = $2 AND mode = $3`,
    [userId, verbId, mode]
  );
  return (res.rowCount ?? 0) > 0;
}

// ---------------------------------------------------------------------------
// Progress data for the Progress page
// ---------------------------------------------------------------------------

export interface VerbPointsRow {
  verbId: number;
  modes: string[];   // which modes are earned for this verb
}

export interface ProgressData {
  totalPoints: number;
  maxPoints: number;
  byVerb: VerbPointsRow[];
}

/**
 * Return all earned points for a user, grouped by verb.
 */
export async function getProgress(userId: string): Promise<ProgressData> {
  const res = await pool.query<{ verb_id: number; mode: string }>(
    `SELECT verb_id, mode FROM verb_points WHERE user_id = $1 ORDER BY verb_id`,
    [userId]
  );

  // Group by verbId
  const map = new Map<number, string[]>();
  for (const row of res.rows) {
    const modes = map.get(row.verb_id) ?? [];
    modes.push(row.mode);
    map.set(row.verb_id, modes);
  }

  const byVerb: VerbPointsRow[] = Array.from(map.entries()).map(([verbId, modes]) => ({
    verbId,
    modes,
  }));

  const totalPoints = res.rows.length;
  const maxPoints = 365 * 5;

  return { totalPoints, maxPoints, byVerb };
}

// ---------------------------------------------------------------------------
// Admin stats
// ---------------------------------------------------------------------------

export interface PeriodCounts {
  today: number;
  week: number;
  month: number;
  total: number;
}

export interface AccuracyStats {
  avg: number;
  min: number;
  max: number;
}

export interface HistogramBucket {
  label: string;
  count: number;
}

export interface AdminStats {
  counts: PeriodCounts;
  accuracy: AccuracyStats;
  histogram: HistogramBucket[];
}

const BUCKET_LABELS = [
  "0–9%", "10–19%", "20–29%", "30–39%", "40–49%",
  "50–59%", "60–69%", "70–79%", "80–89%", "90–100%",
];

function buildHistogram(rows: { bucket: number; count: number }[]): HistogramBucket[] {
  const map = new Map(rows.map((r) => [r.bucket, r.count]));
  return BUCKET_LABELS.map((label, i) => ({ label, count: map.get(i) ?? 0 }));
}

export async function getAdminStats(): Promise<AdminStats> {
  const countsRes = await pool.query<{
    today: string; week: string; month: string; total: string;
  }>(`
    SELECT
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day')   AS today,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')  AS week,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') AS month,
      COUNT(*) AS total
    FROM verb_quiz_results
  `);

  const c = countsRes.rows[0];
  const counts: PeriodCounts = {
    today: Number(c.today),
    week:  Number(c.week),
    month: Number(c.month),
    total: Number(c.total),
  };

  const accRes = await pool.query<{ avg: string; min: string; max: string }>(`
    SELECT
      ROUND(AVG(CAST(score AS NUMERIC) / total * 100), 1) AS avg,
      ROUND(MIN(CAST(score AS NUMERIC) / total * 100), 1) AS min,
      ROUND(MAX(CAST(score AS NUMERIC) / total * 100), 1) AS max
    FROM verb_quiz_results
  `);

  const a = accRes.rows[0];
  const accuracy: AccuracyStats = {
    avg: Number(a.avg) || 0,
    min: Number(a.min) || 0,
    max: Number(a.max) || 0,
  };

  const histRes = await pool.query<{ bucket: number; count: number }>(`
    SELECT
      LEAST(FLOOR(CAST(score AS NUMERIC) / total * 10)::int, 9) AS bucket,
      COUNT(*)::int AS count
    FROM verb_quiz_results
    GROUP BY bucket
    ORDER BY bucket
  `);
  const histogram = buildHistogram(histRes.rows);

  return { counts, accuracy, histogram };
}
