import { maximumQuantityTradable } from './arbitrage';
import { getFixedPairs, updateFixedLatest } from '../store/fixedStore';
import { getExchange } from './exchangePool';

export async function runFixedLoop(intervalMs: number) {
  async function tick() {
    const pairs = getFixedPairs();
    const results: unknown[] = [];

    for (const p of pairs) {
      try {
        const ex1 = getExchange(p.exchange1);
        const ex2 = getExchange(p.exchange2);

        const ob1 = await ex1.fetchOrderBook(p.pair);
        const ob2 = await ex2.fetchOrderBook(p.pair);

        const r = maximumQuantityTradable(
          JSON.parse(JSON.stringify(ob1.asks)),
          JSON.parse(JSON.stringify(ob2.bids)),
          0
        );

        if (r.qty > 0) {
          results.push({
            ...p,
            profit: r.profit,
            qty: r.qty,
            ts: Date.now(),
          });
        }
      } catch {}
    }

    updateFixedLatest(results);
  }

  tick();
  setInterval(tick, intervalMs);
}
