import { getExchange } from './exchangePool';

type CacheItem = {
  ts: number;
  markets: Set<string>;
};

const CACHE: Record<string, CacheItem> = {};
const TTL = 10 * 60 * 1000; // 10 phút

export async function getUSDTMarkets(exchangeId: string): Promise<Set<string>> {
  const now = Date.now();
  const cached = CACHE[exchangeId];

  if (cached && now - cached.ts < TTL) {
    return cached.markets;
  }

  const ex = getExchange(exchangeId);
  await ex.loadMarkets();

  const markets = new Set(
    Object.keys(ex.markets).filter(
      (s) =>
        s.endsWith('/USDT') &&
        ex.markets[s].active &&
        !s.includes(':')
    )
  );

  CACHE[exchangeId] = { ts: now, markets };
  return markets;
}
