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

  // Insert the result
  const insertRes = await pool.query<{ id: number }>(
    `INSERT INTO quiz_results (session_id, dictionary, lang, score, total, duration_s)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [sessionId, dictionary, lang, score, total, durationS]
  );
  const id = insertRes.rows[0].id;

  // Percentile: % of results with strictly lower accuracy than this one
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
