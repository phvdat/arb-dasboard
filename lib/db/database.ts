import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'arb.db');

let _db: Database.Database | null = null;

/** Returns the singleton DB connection, initializing it on first call. */
export function getDb(): Database.Database {
  if (_db) return _db;

  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

  _db = new Database(DB_PATH);

  // WAL mode: concurrent reads don't block writes
  _db.pragma('journal_mode = WAL');
  // Enforce foreign key constraints
  _db.pragma('foreign_keys = ON');

  initDb(_db);

  return _db;
}

/** Creates all tables and indexes. Safe to call multiple times (IF NOT EXISTS). */
function initDb(db: Database.Database): void {
  db.exec(`
    -- Scan config per mode (single row, JSON blob)
    CREATE TABLE IF NOT EXISTS config (
      mode  TEXT PRIMARY KEY,
      data  TEXT NOT NULL
    );

    -- Latest result per pair (one row per pair+exchange combo)
    CREATE TABLE IF NOT EXISTS results (
      id          TEXT PRIMARY KEY,
      mode        TEXT NOT NULL,
      pair        TEXT NOT NULL,
      exchange1   TEXT NOT NULL,
      exchange2   TEXT NOT NULL,
      count       INTEGER NOT NULL DEFAULT 0,
      ratio       REAL,
      profit      REAL,
      ts          INTEGER,
      quantity    REAL,
      direction   TEXT,
      suspended   INTEGER NOT NULL DEFAULT 0
    );

    -- Append-only history ticks (high volume)
    CREATE TABLE IF NOT EXISTS history (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      result_id   TEXT NOT NULL,
      mode        TEXT NOT NULL,
      ratio       REAL NOT NULL,
      profit      REAL NOT NULL,
      ts          INTEGER NOT NULL,
      quantity    REAL NOT NULL,
      direction   TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_history_result_id ON history(result_id);
    CREATE INDEX IF NOT EXISTS idx_history_ts        ON history(ts);
    CREATE INDEX IF NOT EXISTS idx_results_mode      ON results(mode);
  `);
}
