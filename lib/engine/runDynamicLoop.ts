import { setDynamicInterval } from './runtime';
import { loadUSDTMarkets, intersectPairs } from './market';
import { excludePairs, filterByVolume } from './filter';
import { scanPair } from './runnerDynamic';

type DynamicParams = {
  exchanges: string[];
  minVolume: number;
  minSpread: number;
  excludePairs: string[];
  intervalMs: number;
};

export async function runDynamicLoop(params: DynamicParams) {
  const {
    exchanges,
    minVolume,
    minSpread,
    excludePairs: exclude,
    intervalMs,
  } = params;

  async function tick() {
    console.log('[Dynamic] scanning...');

    for (let i = 0; i < exchanges.length; i++) {
      for (let j = i + 1; j < exchanges.length; j++) {
        const ex1 = exchanges[i];
        const ex2 = exchanges[j];

        try {
          const m1 = await loadUSDTMarkets(ex1);
          const m2 = await loadUSDTMarkets(ex2);

          let pairs = intersectPairs(m1, m2);
          pairs = excludePairs(pairs, exclude);

          // volume filter (chỉ check ở exchange 1 cho nhẹ)
          pairs = await filterByVolume(ex1, pairs, minVolume);

          for (const pair of pairs) {
            try {
              await scanPair(pair, ex1, ex2, minSpread);
            } catch {
              // skip pair lỗi
            }
          }
        } catch (e) {
          console.error(`[Dynamic] ${ex1}-${ex2} error`, e);
        }
      }
    }
  }

  // chạy ngay 1 lần
  tick();

  const interval = setInterval(tick, intervalMs);
  setDynamicInterval(interval);
}
