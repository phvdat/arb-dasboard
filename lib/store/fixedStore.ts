import fs from 'fs';
import path from 'path';

const PATH = path.join(process.cwd(), 'data/fixed.json');

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

function ensure() {
  if (!fs.existsSync(PATH)) {
    fs.mkdirSync(path.dirname(PATH), { recursive: true });
    fs.writeFileSync(PATH, JSON.stringify(store, null, 2));
  } else {
    store = JSON.parse(fs.readFileSync(PATH, 'utf8'));
  }
}

export function addFixedPair(p: FixedPair) {
  ensure();
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
  ensure();
  return store.config.pairs;
}

export function updateFixedLatest(data: unknown[]) {
  ensure();
  store.latest = data;
  fs.writeFileSync(PATH, JSON.stringify(store, null, 2));
}
