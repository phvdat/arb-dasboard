/* eslint-disable @typescript-eslint/no-explicit-any */

import { ArbitrageResult } from "../store/type";

export function groupResultsByExchange(
  results: Record<string, ArbitrageResult>
) {
  const map: Record<string, ArbitrageResult[]> = {};

  Object.values(results).forEach((r) => {
    const key = `${r.exchange1} - ${r.exchange2}`;
    if (!map[key]) map[key] = [];
    map[key].push(r);
  });

  return map;
}
