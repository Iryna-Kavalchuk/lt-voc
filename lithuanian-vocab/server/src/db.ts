import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Store the DB file next to the compiled output, one level up from src
const DB_PATH = process.env.DB_PATH ?? path.resolve(__dirname, "../data/stats.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");

  _db.exec(`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id  TEXT    NOT NULL,
      dictionary  TEXT    NOT NULL,
      lang        TEXT    NOT NULL,
      score       INTEGER NOT NULL,
      total       INTEGER NOT NULL,
      duration_s  INTEGER NOT NULL,
      created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
    );

    CREATE INDEX IF NOT EXISTS idx_results_dictionary
      ON quiz_results (dictionary);
  `);

  return _db;
}
