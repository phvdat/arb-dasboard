import { getExchange } from './exchangePool';

type TickerCache = {
  ts: number;
  quoteVolume: number;
};

const CACHE: Record<string, TickerCache> = {};
const TTL = 60_000; // 60s

export async function getQuoteVolume(
  exchangeId: string,
  pair: string
): Promise<number> {
  const key = `${exchangeId}:${pair}`;
  const now = Date.now();

  if (CACHE[key] && now - CACHE[key].ts < TTL) {
    return CACHE[key].quoteVolume;
  }

  const ex = getExchange(exchangeId);
  const t = await ex.fetchTicker(pair);

  const vol = t.quoteVolume ?? 0;
  CACHE[key] = { ts: now, quoteVolume: vol };
  return vol;
}
