import { calcBestTwoWay } from './arbitrage';
import { getFixedPairs, updateFixedResult } from '../store/fixedStore';
import { getExchange } from './exchangePool';
import {
  startFixed,
  stopFixed,
  shouldFixedRun,
} from './runtimeFixed';
import { DYNAMIC_DATA_PATH } from '../constants/paths';
import fs from 'fs';
const PATH = DYNAMIC_DATA_PATH

export async function runFixedLoop() {
  const json = JSON.parse(fs.readFileSync(PATH, 'utf8'));
  if (!startFixed()) {
    console.log('[Fixed] already running');
    return;
  }

  console.log('[Fixed] started');

  try {
    while (shouldFixedRun()) {
      const pairs = getFixedPairs();

      for (const p of pairs) {
        if (!shouldFixedRun()) break;

        try {
          const pair = p.pair;
          const exchange1 = p.exchange1;
          const exchange2 = p.exchange2;

          const ex1 = getExchange(exchange1);
          const ex2 = getExchange(exchange2);

          const ob1 = await ex1.fetchOrderBook(pair);
          const ob2 = await ex2.fetchOrderBook(pair);
          console.log('json.config.minSpread', json.config.minSpread);
          
          const r = calcBestTwoWay(ob1, ob2, json.config.minSpread);

          if (r && r.qty > 0) {
            updateFixedResult(
              `${pair}|${exchange1}|${exchange2}`,
              {
                pair,
                exchange1,
                exchange2,
                spread: r.spread,
                profit: r.profit,
                ts: Date.now(),
              }
            );
          }
        } catch (e) {
          console.error('[Fixed] pair error', e);
        }
      }
    }
  } finally {
    stopFixed();
    console.log('[Fixed] stopped');
  }
}
