import {
  shouldDynamicRun,
  startDynamic,
  stopDynamic,
} from './runtime';

import { getCachedPairs } from './getPairs';
import { scanPair } from './runnerDynamic';
import { throttle } from './throttle';

type DynamicParams = {
  exchanges: string[];
  minVolume: number;
  minPriceRatio: number;
  maxAllowedRatio: number;
  excludePairs: string[];
};

export async function runDynamicLoop(params: DynamicParams) {
  const {
    exchanges,
    minVolume,
    minPriceRatio,
    maxAllowedRatio,
    excludePairs: exclude,
  } = params;

  if (!startDynamic()) {
    console.log('[Dynamic] already running');
    return;
  }

  console.log('[Dynamic] started');

  try {
    while (shouldDynamicRun()) {
      console.log('[Dynamic] scanning...');
      console.time("Start [Dynamic]");
      for (let i = 0; i < exchanges.length; i++) {
        for (let j = i + 1; j < exchanges.length; j++) {
          if (!shouldDynamicRun()) break;

          const ex1 = exchanges[i];
          const ex2 = exchanges[j];

          try {
            console.time("getCachedPairs");
            const pairs = await getCachedPairs(ex1, ex2, new Set(exclude), minVolume);
            const tasks = pairs.map(
              (pair) => async () => {
                if (!shouldDynamicRun()) return;

                try {
                  await scanPair(pair, ex1, ex2, minPriceRatio, maxAllowedRatio);
                } catch {
                  // skip pair lỗi
                }
              }
            );
            console.timeEnd("getCachedPairs");

            await throttle(tasks, 10);
          } catch (e) {
            console.error(`[Dynamic] ${ex1}-${ex2} error`, e);
          }
        }
      }
      console.timeEnd("Start [Dynamic]");
    }
  } finally {
    stopDynamic();
    console.log('[Dynamic] stopped');
  }
}
