import { Pair } from './type';
import {
  addFixedPair as dbAddFixedPair,
  getFixedPairs as dbGetFixedPairs,
  removeFixedPair as dbRemoveFixedPair,
  upsertFixedResult,
} from '@/lib/db/fixedDb';

// Re-export the FixedStore type so existing importers don't break
export type { FixedConfig as FixedStore } from '@/lib/db/fixedDb';

export function addFixedPair(p: Pair): boolean {
  return dbAddFixedPair(p);
}

export function getFixedPairs(): Pair[] {
  return dbGetFixedPairs();
}

export function updateFixedResult(
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
  upsertFixedResult(key, data);
}

export function removeFixedPair(p: Pair): void {
  dbRemoveFixedPair(p);
}
