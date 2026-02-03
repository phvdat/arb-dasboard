import fs from 'fs';
import path from 'path';
import { FIXED_DATA_PATH } from '../constants/paths';

const PATH = FIXED_DATA_PATH

export type FixedPair = {
  pair: string;
  exchange1: string;
  exchange2: string;
};

type FixedStore = {
  config: {
    pairs: FixedPair[];
  };
  latest: unknown[];
};

let store: FixedStore = {
  config: { pairs: [] },
  latest: [],
};

function loadStore() {
  if (!fs.existsSync(PATH)) {
    fs.mkdirSync(path.dirname(PATH), { recursive: true });
    fs.writeFileSync(PATH, JSON.stringify(store, null, 2));
  } else {
    store = JSON.parse(fs.readFileSync(PATH, 'utf8'));
  }
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
    fs.writeFileSync(PATH, JSON.stringify(store, null, 2));
  }
}

export function getFixedPairs(): FixedPair[] {
  loadStore();
  return store.config.pairs;
}

export function updateFixedLatest(data: unknown[]) {
  loadStore();
  store.latest = data;
  fs.writeFileSync(PATH, JSON.stringify(store, null, 2));
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

  fs.writeFileSync(PATH, JSON.stringify(store, null, 2));
}
