import { createExchange } from './ccxt';

export async function filterByVolume(
  exchangeId: string,
  pairs: string[],
  minVolume: number
): Promise<string[]> {
  const ex = createExchange(exchangeId);
  const result: string[] = [];

  for (const pair of pairs) {
    try {
      const ticker = await ex.fetchTicker(pair);
      if ((ticker.quoteVolume ?? 0) >= minVolume) {
        result.push(pair);
      }
    } catch {
      // skip lỗi
    }
  }

  return result;
}

export function excludePairs(
  pairs: string[],
  excludes: string[]
): string[] {
  const set = new Set(excludes.map((p) => p.trim()));
  return pairs.filter((p) => !set.has(p));
}
