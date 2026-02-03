import { updateFixedResult } from '../store/fixedStore';
import { maximumQuantityTradable } from './arbitrage';
import { getExchange } from './exchangePool';

export async function scanFixedPair(
  pair: string,
  ex1Id: string,
  ex2Id: string,
  minSpread: number
) {
  const ex1 = getExchange(ex1Id);
  const ex2 = getExchange(ex2Id);

  const ob1 = await ex1.fetchOrderBook(pair);
  const ob2 = await ex2.fetchOrderBook(pair);

  const buy = maximumQuantityTradable(
    JSON.parse(JSON.stringify(ob1.asks)),
    JSON.parse(JSON.stringify(ob2.bids)),
    minSpread
  );

  if (buy.qty > 0) {
    updateFixedResult(
      `${pair}|${ex1Id}|${ex2Id}`,
      {
        pair,
        exchange1: ex1Id,
        exchange2: ex2Id,
        spread: (buy.profit / buy.qty / ob1.asks[0][0]) * 100,
        profit: buy.profit,
        ts: Date.now(),
      }
    );
  }
}
