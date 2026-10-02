/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArbitrageTable } from "@/types/common";

function extractPairKey(key: string) {
  const parts = key.split("|");
  if (parts.length >= 3) {
    return `${parts[parts.length - 3]}|${parts[parts.length - 2]}|${parts[parts.length - 1]}`;
  }
  return key;
}

export function mergeDynamicWithFixed(
  dynamic: Record<string, ArbitrageTable>,
  fixed: Record<string, ArbitrageTable>
) {
  const out = {} as Record<string, ArbitrageTable>;
  const fixedPairKeys = new Set(Object.keys(fixed).map(extractPairKey));

  for (const key in dynamic) {
    const pairKey = extractPairKey(key);
    out[key] = {
      ...dynamic[key],
      inFixed: fixedPairKeys.has(pairKey),
    };
  }

  return out;
}
