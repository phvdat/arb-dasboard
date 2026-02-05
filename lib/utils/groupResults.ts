/* eslint-disable @typescript-eslint/no-explicit-any */

export function groupResultsByExchange(
  results: Record<string, any>
) {
  const map: Record<string, any[]> = {};

  Object.values(results).forEach((r) => {
    const key = `${r.exchange1} - ${r.exchange2}`;
    if (!map[key]) map[key] = [];
    map[key].push(r);
  });

  return map;
}
