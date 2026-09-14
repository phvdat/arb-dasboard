import { getDb, configCollection, resultsCollection, historyCollection } from './database';
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

export async function getDynamicConfig(): Promise<DynamicConfig | null> {
  const db = await getDb();
  const col = configCollection(db);
  const row = await col.findOne({ _id: MODE });
  return row ? (row.data as DynamicConfig) : null;
}

export async function setDynamicConfig(config: DynamicConfig): Promise<void> {
  const db = await getDb();
  const col = configCollection(db);
  await col.updateOne(
    { _id: MODE },
    { $set: { data: config } },
    { upsert: true }
  );
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

/**
 * Upsert the latest tick for a pair and append to history.
 * Uses a transaction so both writes are atomic.
 */
export async function upsertDynamicResult(
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
): Promise<void> {
  const db = await getDb();
  const results = resultsCollection(db);
  const history = historyCollection(db);

  const session = db.client.startSession();
  try {
    await session.withTransaction(async () => {
      await results.updateOne(
        { _id: key },
        {
          $setOnInsert: {
            mode: MODE,
            pair: data.pair,
            exchange1: data.exchange1,
            exchange2: data.exchange2,
          },
          $inc: { count: 1 },
          $set: {
            ratio: data.ratio,
            profit: data.profit,
            ts: data.ts,
            quantity: data.quantity,
            direction: data.direction,
          },
        },
        { upsert: true, session }
      );

      await history.insertOne(
        {
          result_id: key,
          mode: MODE,
          ratio: data.ratio,
          profit: data.profit,
          ts: data.ts,
          quantity: data.quantity,
          direction: data.direction,
        },
        { session }
      );
    });
  } finally {
    await session.endSession();
  }
}

/**
 * Returns latest results, optionally filtered by range, minPriceRatio, exchanges.
 */
export async function getDynamicResults(filters: ResultFilters = {}): Promise<ResultRow[]> {
  const db = await getDb();
  const col = resultsCollection(db);
  const { range = 'all', minPriceRatio = 1, exchanges = [] } = filters;

  const cutoff = range === 'all' ? 0 : Date.now() - Number(range);

  const query: Record<string, unknown> = { mode: MODE };

  if (exchanges.length) {
    query.exchange1 = { $in: exchanges };
    query.exchange2 = { $in: exchanges };
  }

  if (range !== 'all') {
    query.ts = { $gt: cutoff };
  }

  if (minPriceRatio > 1) {
    query.ratio = { $gte: minPriceRatio };
  }

  const rows = await col.find(query).toArray();

  return rows.map((r) => ({
    ...r,
    id: r._id,
  }));
}

/**
 * Returns paginated history ticks for a specific result key.
 * Newest ticks first.
 */
export async function getDynamicHistory(
  resultId: string,
  range: string = 'all',
  limit: number = 1000,
  offset: number = 0
): Promise<HistoryPage> {
  const db = await getDb();
  const col = historyCollection(db);

  const cutoff = range === 'all' ? 0 : Date.now() - Number(range);

  const filter: Record<string, unknown> = { result_id: resultId, mode: MODE };
  if (range !== 'all') {
    filter.ts = { $gt: cutoff };
  }

  const total = await col.countDocuments(filter);

  const rows = await col
    .find(filter)
    .project<ArbitrageTick>({ ratio: 1, profit: 1, ts: 1, quantity: 1, direction: 1, _id: 0 })
    .sort({ ts: -1 })
    .skip(offset)
    .limit(limit)
    .toArray();

  return { total, limit, offset, results: rows };
}

/** Clears all dynamic results and history. Leaves config intact. */
export async function clearDynamicResults(): Promise<void> {
  const db = await getDb();
  const session = db.client.startSession();
  try {
    await session.withTransaction(async () => {
      await historyCollection(db).deleteMany({ mode: MODE }, { session });
      await resultsCollection(db).deleteMany({ mode: MODE }, { session });
    });
  } finally {
    await session.endSession();
  }
}

/** Toggles the suspended flag on a pair. */
export async function setDynamicSuspended(pair: Pair, suspended: boolean): Promise<void> {
  const db = await getDb();
  const col = resultsCollection(db);
  const key = `${pair.pair}|${pair.exchange1}|${pair.exchange2}`;
  await col.updateOne(
    { _id: key, mode: MODE },
    { $set: { suspended: suspended ? 1 : 0 } }
  );
}
