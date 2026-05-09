import { Pair } from './type';
import {
  setDynamicConfig,
  setDynamicSuspended,
  upsertDynamicResult,
} from '@/lib/db/dynamicDb';
import type { DynamicConfig } from '@/lib/db/dynamicDb';

export function updateResult(
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
  upsertDynamicResult(key, data);
}

export function setConfig(config: unknown): void {
  setDynamicConfig(config as DynamicConfig);
}

export function updateSuspendedStatus(p: Pair, suspended: boolean): void {
  setDynamicSuspended(p, suspended);
}
