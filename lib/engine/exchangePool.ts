/* eslint-disable @typescript-eslint/no-explicit-any */
import { pro as ccxtpro} from 'ccxt';

const pool: Record<string, any> = {};

export function getExchange(id: string) {
  if (!pool[id]) {
    const Cls = (ccxtpro as any)[id];
    if (!Cls) throw new Error(`Exchange ${id} not supported`);

    pool[id] = new Cls({
      enableRateLimit: true,
      timeout: 30_000,
      options: { defaultType: 'spot' },
    });
  }

  return pool[id];
}

export function intersectPairs(a: Set<string>, b: Set<string>): string[] {
  return [...a].filter((p) => b.has(p));
}