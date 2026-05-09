import { getDb } from './database';
import type { ArbitrageTick, Pair } from '@/lib/store/type';

const MODE = 'dynamic';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DynamicConfig = {
  exchanges: string[];
  minVolume: number;
  minPriceRatio: number;
  maxAllowedRatio: number;
  excludePairs: string[];
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

export type ResultFilters = {
  range?: string;          // 'all' or ms string e.g. '3600000'
  minPriceRatio?: number;
  exchanges?: string[];
};

export type HistoryPage = {
  total: number;
  limit: number;
  offset: number;
  results: ArbitrageTick[];
};

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export function getDynamicConfig(): DynamicConfig | null {
  const db = getDb();
  const row = db.prepare('SELECT data FROM config WHERE mode = ?').get(MODE) as
    | { data: string }
    | undefined;
  return row ? (JSON.parse(row.data) as DynamicConfig) : null;
}

export function setDynamicConfig(config: DynamicConfig): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO config (mode, data) VALUES (?, ?)
    ON CONFLICT(mode) DO UPDATE SET data = excluded.data
  `).run(MODE, JSON.stringify(config));
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

/**
 * Upsert the latest tick for a pair and append to history.
 * Uses a transaction so both writes are atomic.
 */
export function upsertDynamicResult(
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

/**
 * Returns latest results, optionally filtered by range, minPriceRatio, exchanges.
 * count reflects how many history ticks match the filter (not total).
 */
export function getDynamicResults(filters: ResultFilters = {}): ResultRow[] {
  const db = getDb();
  const { range = 'all', minPriceRatio = 1, exchanges = [] } = filters;

  const cutoff = range === 'all' ? 0 : Date.now() - Number(range);

  let query = `SELECT * FROM results WHERE mode = ?`;
  const params: (string | number)[] = [MODE];

  if (exchanges.length) {
    const placeholders = exchanges.map(() => '?').join(', ');
    query += ` AND exchange1 IN (${placeholders}) AND exchange2 IN (${placeholders})`;
    params.push(...exchanges, ...exchanges);
  }

  const rows = db.prepare(query).all(...params) as ResultRow[];

  // Post-filter: ratio and range require checking history counts
  // For simple last-tick filtering we check the stored ratio/ts directly
  return rows.filter((r) => {
    if (r.ratio === null) return false;
    if (r.ratio < minPriceRatio) return false;
    if (range !== 'all' && (r.ts === null || r.ts <= cutoff)) return false;
    return true;
  });
}

/**
 * Returns paginated history ticks for a specific result key.
 * Newest ticks first.
 */
export function getDynamicHistory(
  resultId: string,
  range: string = 'all',
  limit: number = 1000,
  offset: number = 0
): HistoryPage {
  const db = getDb();

  const cutoff = range === 'all' ? 0 : Date.now() - Number(range);
  const whereTs = range === 'all' ? '' : 'AND ts > @cutoff';

  const total = (
    db.prepare(`
      SELECT COUNT(*) as cnt FROM history
      WHERE result_id = @result_id AND mode = @mode ${whereTs}
    `).get({ result_id: resultId, mode: MODE, cutoff }) as { cnt: number }
  ).cnt;

  const rows = db.prepare(`
    SELECT ratio, profit, ts, quantity, direction FROM history
    WHERE result_id = @result_id AND mode = @mode ${whereTs}
    ORDER BY ts DESC
    LIMIT @limit OFFSET @offset
  `).all({ result_id: resultId, mode: MODE, cutoff, limit, offset }) as ArbitrageTick[];

  return { total, limit, offset, results: rows };
}

/** Clears all dynamic results and history. Leaves config intact. */
export function clearDynamicResults(): void {
  const db = getDb();
  db.transaction(() => {
    db.prepare(`DELETE FROM history WHERE mode = ?`).run(MODE);
    db.prepare(`DELETE FROM results WHERE mode = ?`).run(MODE);
  })();
}

/** Toggles the suspended flag on a pair. */
export function setDynamicSuspended(pair: Pair, suspended: boolean): void {
  const db = getDb();
  const key = `${pair.pair}|${pair.exchange1}|${pair.exchange2}`;
  db.prepare(`UPDATE results SET suspended = ? WHERE id = ? AND mode = ?`)
    .run(suspended ? 1 : 0, key, MODE);
}
