import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL && process.env.NODE_ENV === "production") {
  throw new Error("DATABASE_URL environment variable is required in production");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // On Render the internal URL uses plain postgres — no SSL needed.
  // For external connections (local dev pointing at a remote DB) SSL is required.
  ssl: process.env.DATABASE_URL?.includes("localhost")
    ? false
    : process.env.DATABASE_URL
      ? { rejectUnauthorized: false }
      : false,
});

/** Run once at server startup to create the table if it doesn't exist. */
export async function initDb(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id          SERIAL PRIMARY KEY,
      session_id  TEXT        NOT NULL,
      dictionary  TEXT        NOT NULL,
      lang        TEXT        NOT NULL,
      score       INTEGER     NOT NULL,
      total       INTEGER     NOT NULL,
      duration_s  INTEGER     NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_results_dictionary
      ON quiz_results (dictionary);
  `);
}
