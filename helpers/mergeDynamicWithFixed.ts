/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArbitrageResult } from "@/lib/store/type";

export function mergeDynamicWithFixed(
  dynamic: Record<string, ArbitrageResult>,
  fixed: Record<string, ArbitrageResult>
) {
  const out = {} as any;

  for (const key in dynamic) {
    out[key] = {
      ...dynamic[key],
      inFixed: !!fixed[key],
    };
  }

  return out;
}