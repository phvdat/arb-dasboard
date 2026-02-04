import { updateResult } from '../store/dynamicStore';
import { calcBestTwoWay, } from './arbitrage';
import { getExchange } from './exchangePool';

export async function scanPair(
  pair: string,
  ex1Id: string,
  ex2Id: string,
  minSpread: number
) {
  const ex1 = getExchange(ex1Id);
  const ex2 = getExchange(ex2Id);

  const ob1 = await ex1.fetchOrderBook(pair);
  const ob2 = await ex2.fetchOrderBook(pair);

  const r = calcBestTwoWay(ob1, ob2, minSpread)

  if (r && r.qty > 0) {
    updateResult(
      `${pair}|${ex1Id}|${ex2Id}`,
      {
        pair,
        exchange1: ex1Id,
        exchange2: ex2Id,
        spread: r.spread,
        profit: r.profit,
        ts: Date.now(),
      }
    );
  }
}
