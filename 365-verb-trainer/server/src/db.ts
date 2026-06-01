import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL && process.env.NODE_ENV === "production") {
  throw new Error("DATABASE_URL environment variable is required in production");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost")
    ? false
    : process.env.DATABASE_URL
      ? { rejectUnauthorized: false }
      : false,
});

/** Whether the DB connected successfully at startup. */
export let dbAvailable = false;

/** Run once at server startup to create tables if they don't exist. */
export async function initDb(): Promise<void> {
  await pool.query(`
    -- Session results
    CREATE TABLE IF NOT EXISTS verb_quiz_results (
      id          SERIAL PRIMARY KEY,
      session_id  TEXT        NOT NULL,
      score       INTEGER     NOT NULL,
      total       INTEGER     NOT NULL,
      duration_s  INTEGER     NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Per-user, per-verb spaced repetition state
    CREATE TABLE IF NOT EXISTS verb_progress (
      id              SERIAL PRIMARY KEY,
      user_id         TEXT        NOT NULL,
      verb_id         INTEGER     NOT NULL,
      correct_count   INTEGER     NOT NULL DEFAULT 0,
      wrong_count     INTEGER     NOT NULL DEFAULT 0,
      interval_days   FLOAT       NOT NULL DEFAULT 0,
      next_review_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, verb_id)
    );

    CREATE INDEX IF NOT EXISTS idx_verb_progress_user
      ON verb_progress (user_id);

    CREATE INDEX IF NOT EXISTS idx_verb_progress_review
      ON verb_progress (user_id, next_review_at);

    -- Per-user, per-verb, per-mode point tracking (Option C: earned on correct, lost on wrong)
    CREATE TABLE IF NOT EXISTS verb_points (
      user_id   TEXT    NOT NULL,
      verb_id   INTEGER NOT NULL,
      mode      TEXT    NOT NULL,
      PRIMARY KEY (user_id, verb_id, mode)
    );

    CREATE INDEX IF NOT EXISTS idx_verb_points_user
      ON verb_points (user_id);
  `);
  dbAvailable = true;
}
