import { maximumQuantityTradable } from './arbitrage';
import { getFixedPairs, updateFixedResult } from '../store/fixedStore';
import { getExchange } from './exchangePool';

export async function runFixedLoop(intervalMs: number) {
  async function tick() {
    const pairs = getFixedPairs();
    for (const p of pairs) {
      try {
        const pair = p.pair
        const exchange1 = p.exchange1
        const exchange2 = p.exchange2
        const ex1 = getExchange(exchange1);
        const ex2 = getExchange(exchange2);

        const ob1 = await ex1.fetchOrderBook(pair);
        const ob2 = await ex2.fetchOrderBook(pair);

        const r = maximumQuantityTradable(
          JSON.parse(JSON.stringify(ob1.asks)),
          JSON.parse(JSON.stringify(ob2.bids)),
          0
        );

        if (r.qty > 0) {
          updateFixedResult(`${pair}|${exchange1}|${exchange2}`, {
            pair,
            exchange1,
            exchange2,
            spread: (r.profit / r.qty / ob1.asks[0][0]) * 100,
            profit: r.profit,
            ts: Date.now(),
          })
        }
      } catch (e) {
        console.error("[runFixedLoop]", e);
      }
    }
  }

  tick();
  setInterval(tick, intervalMs);
}
