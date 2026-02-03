import { createExchange } from './ccxt';

export async function loadUSDTMarkets(exchangeId: string): Promise<Set<string>> {
  const ex = createExchange(exchangeId);
  await ex.loadMarkets();

  const pairs = Object.keys(ex.markets)
    .filter(
      (s) =>
        s.endsWith('/USDT') &&
        ex.markets[s].active &&
        !s.includes(':') // futures, margin
    );

  return new Set(pairs);
}

export function intersectPairs(a: Set<string>, b: Set<string>): string[] {
  return [...a].filter((p) => b.has(p));
}
