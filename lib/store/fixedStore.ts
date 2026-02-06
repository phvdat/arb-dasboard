/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import { FIXED_DATA_PATH } from '../constants/paths';
import { ArbitrageResult } from './type';
const MAX_HISTORY = 100
const PATH = FIXED_DATA_PATH

export type FixedPair = {
  pair: string;
  exchange1: string;
  exchange2: string;
};

export type FixedStore = {
  config: {
    pairs: FixedPair[];
  };
  results: Record<string, ArbitrageResult>;
};

let store: FixedStore = {
  config: { pairs: [] },
  results: {},
};

function loadStore() {
  if (!fs.existsSync(PATH)) {
    fs.mkdirSync(path.dirname(PATH), { recursive: true });
    fs.writeFileSync(PATH, JSON.stringify(store, null, 2));
  } else {
    store = JSON.parse(fs.readFileSync(PATH, 'utf8'));
  }
}

function saveStore() {
  fs.mkdirSync(path.dirname(PATH), { recursive: true });
  fs.writeFileSync(PATH, JSON.stringify(store, null, 2));
}

export function addFixedPair(p: FixedPair) {
  loadStore();
  const exists = store.config.pairs.some(
    (x) =>
      x.pair === p.pair &&
      x.exchange1 === p.exchange1 &&
      x.exchange2 === p.exchange2
  );
  if (!exists) {
    store.config.pairs.push(p);
    saveStore()
    return true
  }
  return false
}

export function getFixedPairs(): FixedPair[] {
  loadStore();
  return store.config.pairs;
}

export function updateFixedResult(key: string, data: {
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

export function removeFixedPair(p: FixedPair) {  
  loadStore();

  store.config.pairs = store.config.pairs.filter(
    (x) =>
      !(
        x.pair === p.pair &&
        x.exchange1 === p.exchange1 &&
        x.exchange2 === p.exchange2
      )
  );
  store.results = Object.fromEntries(
    Object.entries(store.results).filter(
      ([k, v]) =>
        !(v.pair === p.pair && v.exchange1 === p.exchange1 && v.exchange2 === p.exchange2)
    )
  )

  saveStore()
}
