import { getDb } from './database';
import type { ArbitrageTick, Pair } from '@/lib/store/type';

const MODE = 'fixed';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FixedConfig = {
  pairs: Pair[];
};

export type ResultRow = {
  id: string;
  pair: string;
  exchange1: string;
  exchange2: string;
  count: number;
  ratio: number | null;
  profit: number | null;
  ts: number | null;
  quantity: number | null;
  direction: string | null;
  suspended: number; // 0 | 1
};

export type HistoryPage = {
  total: number;
  limit: number;
  offset: number;
  results: ArbitrageTick[];
};

// ---------------------------------------------------------------------------
// Config / Pairs
// ---------------------------------------------------------------------------

export function getFixedConfig(): FixedConfig {
  const db = getDb();
  const row = db.prepare('SELECT data FROM config WHERE mode = ?').get(MODE) as
    | { data: string }
    | undefined;
  return row ? (JSON.parse(row.data) as FixedConfig) : { pairs: [] };
}

function saveFixedConfig(config: FixedConfig): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO config (mode, data) VALUES (?, ?)
    ON CONFLICT(mode) DO UPDATE SET data = excluded.data
  `).run(MODE, JSON.stringify(config));
}

export function getFixedPairs(): Pair[] {
  return getFixedConfig().pairs;
}

/** Adds a pair. Returns false if it already exists. */
export function addFixedPair(p: Pair): boolean {
  const config = getFixedConfig();
  const exists = config.pairs.some(
    (x) => x.pair === p.pair && x.exchange1 === p.exchange1 && x.exchange2 === p.exchange2
  );
  if (exists) return false;
  config.pairs.push(p);
  saveFixedConfig(config);
  return true;
}

/** Removes a pair from config and deletes its results + history. */
export function removeFixedPair(p: Pair): void {
  const db = getDb();
  const key = `${p.pair}|${p.exchange1}|${p.exchange2}`;

  const config = getFixedConfig();
  config.pairs = config.pairs.filter(
    (x) => !(x.pair === p.pair && x.exchange1 === p.exchange1 && x.exchange2 === p.exchange2)
  );

  db.transaction(() => {
    saveFixedConfig(config);
    db.prepare(`DELETE FROM history WHERE result_id = ? AND mode = ?`).run(key, MODE);
    db.prepare(`DELETE FROM results WHERE id = ? AND mode = ?`).run(key, MODE);
  })();
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

/**
 * Upsert the latest tick for a fixed pair and append to history.
 * Atomic transaction.
 */
export function upsertFixedResult(
  key: string,
  data: {
    pair: string;
    exchange1: string;
    exchange2: string;
    ratio: number;
    profit: number;
    ts: number;
    quantity: number;
    direction: string;
  }
): void {
  const db = getDb();

  const upsert = db.prepare(`
    INSERT INTO results (id, mode, pair, exchange1, exchange2, count, ratio, profit, ts, quantity, direction)
    VALUES (@id, @mode, @pair, @exchange1, @exchange2, 1, @ratio, @profit, @ts, @quantity, @direction)
    ON CONFLICT(id) DO UPDATE SET
      count     = count + 1,
      ratio     = excluded.ratio,
      profit    = excluded.profit,
      ts        = excluded.ts,
      quantity  = excluded.quantity,
      direction = excluded.direction
  `);

  const insertHistory = db.prepare(`
    INSERT INTO history (result_id, mode, ratio, profit, ts, quantity, direction)
    VALUES (@result_id, @mode, @ratio, @profit, @ts, @quantity, @direction)
  `);

  db.transaction(() => {
    upsert.run({ id: key, mode: MODE, ...data });
    insertHistory.run({
      result_id: key,
      mode: MODE,
      ratio: data.ratio,
      profit: data.profit,
      ts: data.ts,
      quantity: data.quantity,
      direction: data.direction,
    });
  })();
}

/** Returns all fixed results (latest tick per pair, no history). */
export function getFixedResults(): ResultRow[] {
  const db = getDb();
  return db.prepare(`SELECT * FROM results WHERE mode = ?`).all(MODE) as ResultRow[];
}

/**
 * Returns paginated history ticks for a specific result key.
 * Newest ticks first.
 */
export function getFixedHistory(
  resultId: string,
  limit: number = 10000,
  offset: number = 0
): HistoryPage {
  const db = getDb();

  const total = (
    db.prepare(`
      SELECT COUNT(*) as cnt FROM history WHERE result_id = @result_id AND mode = @mode
    `).get({ result_id: resultId, mode: MODE }) as { cnt: number }
  ).cnt;

  const rows = db.prepare(`
    SELECT ratio, profit, ts, quantity, direction FROM history
    WHERE result_id = @result_id AND mode = @mode
    ORDER BY ts DESC
    LIMIT @limit OFFSET @offset
  `).all({ result_id: resultId, mode: MODE, limit, offset }) as ArbitrageTick[];

  return { total, limit, offset, results: rows };
}

/** Clears all fixed results and history. Leaves config (pairs list) intact. */
export function clearFixedResults(): void {
  const db = getDb();
  db.transaction(() => {
    db.prepare(`DELETE FROM history WHERE mode = ?`).run(MODE);
    db.prepare(`DELETE FROM results WHERE mode = ?`).run(MODE);
  })();
}
