import { Pair } from './type';
import {
  addFixedPair as dbAddFixedPair,
  getFixedPairs as dbGetFixedPairs,
  removeFixedPair as dbRemoveFixedPair,
  upsertFixedResult,
} from '@/lib/db/fixedDb';

// Re-export the FixedStore type so existing importers don't break
export type { FixedConfig as FixedStore } from '@/lib/db/fixedDb';

export async function addFixedPair(p: Pair): Promise<boolean> {
  return dbAddFixedPair(p);
}

export async function getFixedPairs(): Promise<Pair[]> {
  return dbGetFixedPairs();
}

export async function updateFixedResult(
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
  await upsertFixedResult(key, data);
}

export async function removeFixedPair(p: Pair): Promise<void> {
  await dbRemoveFixedPair(p);
}
