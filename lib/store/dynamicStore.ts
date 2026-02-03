import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data/dynamic.json');

export type DynamicResult = {
  pair: string;
  exchange1: string;
  exchange2: string;
  count: number;
  lastSpread: number;
  lastProfit: number;
  lastSeen: number;
};

type Store = {
  config: unknown;
  results: Record<string, DynamicResult>;
};

let store: Store = { config: null, results: {} };

export function loadStore() {
  if (fs.existsSync(DATA_PATH)) {
    store = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  }
}

export function saveStore() {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(store, null, 2));
}

export function updateResult(key: string, data: Omit<DynamicResult, 'count'>) {
  if (!store.results[key]) {
    store.results[key] = { ...data, count: 1 };
  } else {
    store.results[key].count++;
    Object.assign(store.results[key], data);
  }
  saveStore();
}

export function setConfig(config: unknown) {
  store.config = config;
  saveStore();
}
