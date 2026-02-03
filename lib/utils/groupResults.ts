export type DynamicResult = {
  pair: string;
  exchange1: string;
  exchange2: string;
  count: number;
  lastSpread: number;
  lastProfit: number;
  lastSeen: number;
};

export function groupResultsByExchange(
  results: Record<string, DynamicResult>
) {
  const map: Record<string, DynamicResult[]> = {};

  Object.values(results).forEach((r) => {
    const key = `${r.exchange1} → ${r.exchange2}`;
    if (!map[key]) map[key] = [];
    map[key].push(r);
  });

  return map;
}
