import { pool } from "./db.js";

export interface SaveResultInput {
  sessionId: string;
  dictionary: string;
  lang: string;
  score: number;
  total: number;
  durationS: number;
}

export interface SaveResultOutput {
  id: number;
  /** Percentage of other results this score beats, 0–100 */
  percentile: number;
  /** Total number of results for this dictionary (including this one) */
  totalResults: number;
}

export async function saveResult(input: SaveResultInput): Promise<SaveResultOutput> {
  const { sessionId, dictionary, lang, score, total, durationS } = input;

  const insertRes = await pool.query<{ id: number }>(
    `INSERT INTO quiz_results (session_id, dictionary, lang, score, total, duration_s)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [sessionId, dictionary, lang, score, total, durationS]
  );
  const id = insertRes.rows[0].id;

  const accuracy = score / total;

  const percentileRes = await pool.query<{ percentile: number; total_results: number }>(
    `SELECT
       ROUND(
         100.0 * COUNT(*) FILTER (WHERE CAST(score AS FLOAT) / total < $1)
         / COUNT(*),
         0
       )::int AS percentile,
       COUNT(*)::int AS total_results
     FROM quiz_results
     WHERE dictionary = $2`,
    [accuracy, dictionary]
  );

  const row = percentileRes.rows[0];

  return {
    id,
    percentile: row.percentile ?? 0,
    totalResults: row.total_results,
  };
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
  /** Bucket label e.g. "0–9%", "10–19%", … "90–100%" */
  label: string;
  count: number;
}

export interface DictionaryStats {
  dictionary: string;
  counts: PeriodCounts;
  accuracy: AccuracyStats;
  histogram: HistogramBucket[];
}

export interface AdminStats {
  counts: PeriodCounts;
  accuracy: AccuracyStats;
  histogram: HistogramBucket[];
  byDictionary: DictionaryStats[];
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
  // Overall counts by period
  const countsRes = await pool.query<{
    today: string; week: string; month: string; total: string;
  }>(`
    SELECT
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day')  AS today,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') AS week,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') AS month,
      COUNT(*) AS total
    FROM quiz_results
  `);

  const c = countsRes.rows[0];
  const counts: PeriodCounts = {
    today: Number(c.today),
    week:  Number(c.week),
    month: Number(c.month),
    total: Number(c.total),
  };

  // Overall accuracy stats
  const accRes = await pool.query<{ avg: string; min: string; max: string }>(`
    SELECT
      ROUND(AVG(CAST(score AS FLOAT) / total * 100), 1)::float AS avg,
      ROUND(MIN(CAST(score AS FLOAT) / total * 100), 1)::float AS min,
      ROUND(MAX(CAST(score AS FLOAT) / total * 100), 1)::float AS max
    FROM quiz_results
  `);

  const a = accRes.rows[0];
  const accuracy: AccuracyStats = {
    avg: Number(a.avg) || 0,
    min: Number(a.min) || 0,
    max: Number(a.max) || 0,
  };

  // Overall histogram (10 buckets of 10%)
  const histRes = await pool.query<{ bucket: number; count: number }>(`
    SELECT
      LEAST(FLOOR(CAST(score AS FLOAT) / total * 10)::int, 9) AS bucket,
      COUNT(*)::int AS count
    FROM quiz_results
    GROUP BY bucket
    ORDER BY bucket
  `);
  const histogram = buildHistogram(histRes.rows);

  // Per-dictionary breakdown
  const dictsRes = await pool.query<{ dictionary: string }>(`
    SELECT DISTINCT dictionary FROM quiz_results ORDER BY dictionary
  `);

  const byDictionary: DictionaryStats[] = await Promise.all(
    dictsRes.rows.map(async ({ dictionary }) => {
      const dcRes = await pool.query<{
        today: string; week: string; month: string; total: string;
      }>(`
        SELECT
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day')   AS today,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')  AS week,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') AS month,
          COUNT(*) AS total
        FROM quiz_results WHERE dictionary = $1
      `, [dictionary]);

      const dc = dcRes.rows[0];

      const daRes = await pool.query<{ avg: string; min: string; max: string }>(`
        SELECT
          ROUND(AVG(CAST(score AS FLOAT) / total * 100), 1)::float AS avg,
          ROUND(MIN(CAST(score AS FLOAT) / total * 100), 1)::float AS min,
          ROUND(MAX(CAST(score AS FLOAT) / total * 100), 1)::float AS max
        FROM quiz_results WHERE dictionary = $1
      `, [dictionary]);

      const da = daRes.rows[0];

      const dhRes = await pool.query<{ bucket: number; count: number }>(`
        SELECT
          LEAST(FLOOR(CAST(score AS FLOAT) / total * 10)::int, 9) AS bucket,
          COUNT(*)::int AS count
        FROM quiz_results
        WHERE dictionary = $1
        GROUP BY bucket ORDER BY bucket
      `, [dictionary]);

      return {
        dictionary,
        counts: {
          today: Number(dc.today),
          week:  Number(dc.week),
          month: Number(dc.month),
          total: Number(dc.total),
        },
        accuracy: {
          avg: Number(da.avg) || 0,
          min: Number(da.min) || 0,
          max: Number(da.max) || 0,
        },
        histogram: buildHistogram(dhRes.rows),
      };
    })
  );

  return { counts, accuracy, histogram, byDictionary };
}
