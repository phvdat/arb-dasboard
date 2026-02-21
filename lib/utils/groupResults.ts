/* eslint-disable @typescript-eslint/no-explicit-any */

import { ArbitrageTable } from "@/types/common";

export function groupResultsByExchange(
  results: Record<string, ArbitrageTable>
) {
  const map: Record<string, ArbitrageTable[]> = {};

  Object.values(results).forEach((r) => {
    const key = `${r.exchange1} - ${r.exchange2}`;
    if (!map[key]) map[key] = [];
    map[key].push(r);
  });

  return map;
}
