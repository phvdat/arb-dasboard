/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import { DYNAMIC_DATA_PATH } from '../constants/paths';
import { ArbitrageResult, Pair } from './type';
const MAX_HISTORY = 100;
const DATA_PATH = DYNAMIC_DATA_PATH


type Store = {
  config: unknown;
  results: Record<string, ArbitrageResult>;
};

let store: Store = { config: null, results: {} };

function loadStore() {
  if (fs.existsSync(DATA_PATH)) {
    store = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  }
}

function saveStore() {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(store, null, 2));
}

export function updateResult(key: string, data: {
  pair: string;
  exchange1: string;
  exchange2: string;
  ratio: number;
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
      last: {
        ratio: data.ratio,
        profit: data.profit,
        ts: data.ts,
      },
      history: [],
    };
  }

  const r = store.results[key];

  r.count += 1;
  r.last = {
    ratio: data.ratio,
    profit: data.profit,
    ts: data.ts,
  };

  r.history.push(r.last);

  if (r.history.length > MAX_HISTORY) {
    r.history.shift(); // drop oldest
    r.count -= 1;
  }
  saveStore();
}

export function setConfig(config: unknown) {
  loadStore();
  store.config = config;
  saveStore();
}

export function updateSuspendedStatus(p: Pair, suspended: boolean) {
  loadStore();
  store.results = Object.fromEntries(
    Object.entries(store.results).map(([k, v]) => {
      if (
        v.pair === p.pair &&
        v.exchange1 === p.exchange1 &&
        v.exchange2 === p.exchange2
      ) {        
        v.suspended = suspended;
      }
      return [k, v];
    })
  )
  saveStore();
}