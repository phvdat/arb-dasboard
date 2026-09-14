import { getDb, configCollection, resultsCollection, historyCollection } from './database';
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

export async function getFixedConfig(): Promise<FixedConfig> {
  const db = await getDb();
  const col = configCollection(db);
  const row = await col.findOne({ _id: MODE });
  return row ? (row.data as FixedConfig) : { pairs: [] };
}

async function saveFixedConfig(config: FixedConfig): Promise<void> {
  const db = await getDb();
  const col = configCollection(db);
  await col.updateOne(
    { _id: MODE },
    { $set: { data: config } },
    { upsert: true }
  );
}

export async function getFixedPairs(): Promise<Pair[]> {
  const config = await getFixedConfig();
  return config.pairs;
}

/** Adds a pair. Returns false if it already exists. */
export async function addFixedPair(p: Pair): Promise<boolean> {
  const config = await getFixedConfig();
  const exists = config.pairs.some(
    (x) => x.pair === p.pair && x.exchange1 === p.exchange1 && x.exchange2 === p.exchange2
  );
  if (exists) return false;
  config.pairs.push(p);
  await saveFixedConfig(config);
  return true;
}

/** Removes a pair from config and deletes its results + history. */
export async function removeFixedPair(p: Pair): Promise<void> {
  const db = await getDb();
  const key = `${p.pair}|${p.exchange1}|${p.exchange2}`;

  const config = await getFixedConfig();
  config.pairs = config.pairs.filter(
    (x) => !(x.pair === p.pair && x.exchange1 === p.exchange1 && x.exchange2 === p.exchange2)
  );

  const session = db.client.startSession();
  try {
    await session.withTransaction(async () => {
      await saveFixedConfig(config);
      await historyCollection(db).deleteMany({ result_id: key, mode: MODE }, { session });
      await resultsCollection(db).deleteOne({ _id: key, mode: MODE }, { session });
    });
  } finally {
    await session.endSession();
  }
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

/**
 * Upsert the latest tick for a fixed pair and append to history.
 * Atomic transaction.
 */
export async function upsertFixedResult(
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

/** Returns all fixed results (latest tick per pair, no history). */
export async function getFixedResults(): Promise<ResultRow[]> {
  const db = await getDb();
  const col = resultsCollection(db);
  const rows = await col.find({ mode: MODE }).toArray();
  return rows.map((r) => ({
    ...r,
    id: r._id,
  }));
}

/**
 * Returns paginated history ticks for a specific result key.
 * Newest ticks first.
 */
export async function getFixedHistory(
  resultId: string,
  limit: number = 10000,
  offset: number = 0
): Promise<HistoryPage> {
  const db = await getDb();
  const col = historyCollection(db);

  const filter = { result_id: resultId, mode: MODE };

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

/** Clears all fixed results and history. Leaves config (pairs list) intact. */
export async function clearFixedResults(): Promise<void> {
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
