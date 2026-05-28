import { getDb } from "./db.js";

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

export function saveResult(input: SaveResultInput): SaveResultOutput {
  const db = getDb();

  const insert = db.prepare(`
    INSERT INTO quiz_results (session_id, dictionary, lang, score, total, duration_s)
    VALUES (@sessionId, @dictionary, @lang, @score, @total, @durationS)
  `);

  const info = insert.run(input);
  const id = Number(info.lastInsertRowid);

  // Percentile: % of results with a strictly lower accuracy than this one
  // Using accuracy (score/total) so different quiz lengths compare fairly
  const accuracy = input.score / input.total;

  const row = db.prepare(`
    SELECT
      ROUND(
        100.0 * SUM(CASE WHEN CAST(score AS REAL) / total < @accuracy THEN 1 ELSE 0 END)
        / COUNT(*),
        0
      ) AS percentile,
      COUNT(*) AS totalResults
    FROM quiz_results
    WHERE dictionary = @dictionary
  `).get({ accuracy, dictionary: input.dictionary }) as { percentile: number; totalResults: number };

  return {
    id,
    percentile: row.percentile ?? 0,
    totalResults: row.totalResults,
  };
}
