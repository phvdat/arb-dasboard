/* eslint-disable @typescript-eslint/no-explicit-any */
import { pro as ccxtpro } from 'ccxt';

type Mode = 'dynamic' | 'fixed';

const pool: Record<string, any> = {};

export function getExchange(
  id: string,
  mode: Mode = 'dynamic'
) {
  const key = `${mode}:${id}`;

  if (!pool[key]) {
    const Cls = (ccxtpro as any)[id];
    if (!Cls) {
      throw new Error(`Exchange ${id} not supported`);
    }

    pool[key] = new Cls({
      enableRateLimit: true,
      timeout: 30_000,
      options: { defaultType: 'spot' },
    });

    console.log(`[CCXT] create instance ${key}`);
  }

  return pool[key];
}

export async function closeMode(mode: Mode) {
  for (const key of Object.keys(pool)) {
    if (key.startsWith(mode + ':')) {
      await pool[key].close?.();
      delete pool[key];
      console.log(`[CCXT] closed ${key}`);
    }
  }
}

export function intersectPairs(a: Set<string>, b: Set<string>): string[] {
  return [...a].filter((p) => b.has(p));
}