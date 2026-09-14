import { Pair } from './type';
import {
  setDynamicConfig,
  setDynamicSuspended,
  upsertDynamicResult,
} from '@/lib/db/dynamicDb';
import type { DynamicConfig } from '@/lib/db/dynamicDb';

export async function updateResult(
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
  await upsertDynamicResult(key, data);
}

export async function setConfig(config: unknown): Promise<void> {
  await setDynamicConfig(config as DynamicConfig);
}

export async function updateSuspendedStatus(p: Pair, suspended: boolean): Promise<void> {
  await setDynamicSuspended(p, suspended);
}
