import { MongoClient, type Db, type Collection, type ObjectId } from 'mongodb';
import type { DynamicConfig } from './dynamicDb';
import type { FixedConfig } from './fixedDb';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

const DB_NAME = 'arb-dashboard';

// ---------------------------------------------------------------------------
// Document types
// ---------------------------------------------------------------------------

export type ConfigDoc = {
  _id: string; // 'dynamic' | 'fixed'
  data: DynamicConfig | FixedConfig;
};

export type ResultDoc = {
  _id: string; // e.g. "BTC/USDT|binance|okx"
  mode: string;
  pair: string;
  exchange1: string;
  exchange2: string;
  count: number;
  ratio: number | null;
  profit: number | null;
  ts: number | null;
  quantity: number | null;
  direction: string | null;
  suspended: number;
};

export type HistoryDoc = {
  _id?: ObjectId;
  result_id: string;
  mode: string;
  ratio: number;
  profit: number;
  ts: number;
  quantity: number;
  direction: string;
};

// ---------------------------------------------------------------------------
// Singleton connection
// ---------------------------------------------------------------------------

let _client: MongoClient | null = null;
let _db: Db | null = null;

/** Returns the singleton MongoDB Db instance, connecting on first call. */
export async function getDb(): Promise<Db> {
  if (_db) return _db;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  _client = new MongoClient(MONGODB_URI, {
    tls: true,
    retryWrites: true,
    w: 'majority',
  });

  try {
    await _client.connect();
    // Verify connection
    await _client.db('admin').command({ ping: 1 });
  } catch (err) {
    console.error('[MongoDB] Connection failed:', err);
    throw err;
  }

  _db = _client.db(DB_NAME);
  await initCollections(_db);

  return _db;
}

/** Typed collection accessors */
export function configCollection(db: Db): Collection<ConfigDoc> {
  return db.collection<ConfigDoc>('config');
}

export function resultsCollection(db: Db): Collection<ResultDoc> {
  return db.collection<ResultDoc>('results');
}

export function historyCollection(db: Db): Collection<HistoryDoc> {
  return db.collection<HistoryDoc>('history');
}

/** Creates collections and indexes. Safe to call multiple times. */
async function initCollections(db: Db): Promise<void> {
  const collections = await db.listCollections().toArray();
  const existing = new Set(collections.map((c) => c.name));

  if (!existing.has('config')) {
    await db.createCollection('config');
  }
  if (!existing.has('results')) {
    await db.createCollection('results');
  }
  if (!existing.has('history')) {
    await db.createCollection('history');
  }

  // Indexes for results
  await db.collection('results').createIndex({ mode: 1 }, { name: 'idx_results_mode' });

  // Indexes for history
  await db.collection('history').createIndex({ result_id: 1 }, { name: 'idx_history_result_id' });
  await db.collection('history').createIndex({ ts: 1 }, { name: 'idx_history_ts' });
  await db.collection('history').createIndex(
    { result_id: 1, mode: 1, ts: -1 },
    { name: 'idx_history_result_mode_ts' }
  );
}
