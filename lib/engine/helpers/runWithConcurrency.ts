export async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
) {
  const results: T[] = [];
  let index = 0;

  async function worker() {
    while (index < tasks.length) {
      const current = index++;
      try {
        const res = await tasks[current]();
        results.push(res);
      } catch {
        // ignore
      }
    }
  }

  await Promise.all(
    Array.from({ length: concurrency }, worker)
  );

  return results;
}
