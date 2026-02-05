export function buildRoundRobinPairs(
  exchanges: string[],
  round: number
): [string, string][] {
  const list = [...exchanges];
  
  if (list.length % 2 === 1) {
    list.push('__DUMMY__');
  }

  const n = list.length;
  const fixed = list[0];
  const rest = list.slice(1);

  const r = round % (n - 1);
  const rotated = [
    fixed,
    ...rest.slice(r),
    ...rest.slice(0, r),
  ];

  const pairs: [string, string][] = [];

  for (let i = 0; i < n / 2; i++) {
    const a = rotated[i];
    const b = rotated[n - 1 - i];

    if (a !== '__DUMMY__' && b !== '__DUMMY__') {
      pairs.push([a, b]);
    }
  }

  return pairs;
}
