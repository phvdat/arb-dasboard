/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
const MAX_HISTORY = 100;
const DATA_PATH = path.join(process.cwd(), 'data/dynamic.json');

export type DynamicResult = {
  pair: string;
  exchange1: string;
  exchange2: string;
  count: number;
  last: any;
  history: any[];
};

type Store = {
  config: unknown;
  results: Record<string, DynamicResult>;
};

let store: Store = { config: null, results: {} };

function loadStore() {
  if (fs.existsSync(DATA_PATH)) {
    store = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  }
}

export function saveStore() {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(store, null, 2));
}

export function updateResult(key: string, data: {
  pair: string;
  exchange1: string;
  exchange2: string;
  spread: number;
  profit: number;
  ts: number;
}) {
  loadStore();
  if (!store.results[key]) {
    store.results[key] = {
      pair: data.pair,
      exchange1: data.exchange1,
      exchange2: data.exchange2,
      count: 0,
      last: null,
      history: [],
    };
  }

  const r = store.results[key];

  r.count += 1;
  r.last = {
    spread: data.spread,
    profit: data.profit,
    ts: data.ts,
  };

  r.history.push(r.last);

  if (r.history.length > MAX_HISTORY) {
    r.history.shift(); // drop oldest
  }
  saveStore();
}

export function setConfig(config: unknown) {
  loadStore();
  store.config = config;
  saveStore();
}
