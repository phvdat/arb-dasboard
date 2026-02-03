export async function throttle<T>(
  tasks: (() => Promise<T>)[],
  delayMs: number
): Promise<T[]> {
  const results: T[] = [];

  for (const task of tasks) {
    results.push(await task());
    await new Promise((r) => setTimeout(r, delayMs));
  }

  return results;
}
