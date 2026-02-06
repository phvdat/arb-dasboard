import {
  shouldDynamicRun,
  startDynamic,
  stopDynamic,
} from './runtimeDynamic';

import { buildRoundRobinPairs } from '@/lib/engine/helpers/buildRoundRobinPairs';
import { runWithConcurrency } from '@/lib/engine/helpers/runWithConcurrency';
import { scanPair } from './runnerDynamic';
import { getCachedPairs } from './helpers/getPairs';

type DynamicParams = {
  exchanges: string[];
  minVolume: number;
  minPriceRatio: number;
  maxAllowedRatio: number;
  excludePairs: string[];
};

export async function runDynamicLoop(params: DynamicParams) {
  if (!startDynamic()) {
    console.log('[Dynamic] already running');
    return;
  }

  console.log('[Dynamic] started');

  let round = 0;

  try {
    while (shouldDynamicRun()) {
      console.log(`[Dynamic] round ${round}`);
      console.time(`[Dynamic round]`);
      const pairs = buildRoundRobinPairs(
        params.exchanges,
        round
      );

      const tasks = pairs.map(
        ([ex1, ex2]) => async () => {
          if (!shouldDynamicRun()) return;

          const symbols = await getCachedPairs(
            ex1,
            ex2,
            new Set(params.excludePairs),
            params.minVolume
          );

          for (const pair of symbols) {
            if (!shouldDynamicRun()) break;
            await scanPair(
              pair,
              ex1,
              ex2,
              params.minPriceRatio,
              params.maxAllowedRatio
            );
          }
        }
      );

      // mỗi task = 1 exchange pair
      await runWithConcurrency(tasks, tasks.length);

      console.timeEnd(`[Dynamic round]`);
      round++;
    }
  } finally {
    stopDynamic();
    console.log('[Dynamic] stopped');
  }
}
