/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArbitrageTable } from "@/types/common";

export function mergeDynamicWithFixed(
  dynamic: Record<string, ArbitrageTable>,
  fixed: Record<string, ArbitrageTable>
) {
  const out = {} as Record<string, ArbitrageTable>;

  for (const key in dynamic) {
    out[key] = {
      ...dynamic[key],
      inFixed: !!fixed[key],
    };
  }

  return out;
}