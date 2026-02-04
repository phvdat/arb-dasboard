export type ArbResult = {
  qty: number;
  profit: number;
  avgBuy: number;
  avgSell: number;
  spread: number; // %
};

export type TwoWayResult = ArbResult & {
  direction: 'A_TO_B' | 'B_TO_A';
};

export function calcOneWay(
  asks: [number, number][],
  bids: [number, number][]
): ArbResult {
  let qty = 0;
  let cost = 0;
  let revenue = 0;

  let i = 0;
  let j = 0;

  while (i < asks.length && j < bids.length) {
    const [askPrice, askQty] = asks[i];
    const [bidPrice, bidQty] = bids[j];

    if (bidPrice <= askPrice) break;

    const tradable = Math.min(askQty, bidQty);

    qty += tradable;
    cost += tradable * askPrice;
    revenue += tradable * bidPrice;

    asks[i][1] -= tradable;
    bids[j][1] -= tradable;

    if (asks[i][1] <= 0) i++;
    if (bids[j][1] <= 0) j++;
  }

  const profit = revenue - cost;
  const avgBuy = qty > 0 ? cost / qty : 0;
  const avgSell = qty > 0 ? revenue / qty : 0;
  const spread =
    qty > 0 ? ((avgSell - avgBuy) / avgBuy) * 100 : 0;

  return {
    qty,
    profit,
    avgBuy,
    avgSell,
    spread,
  };
}

/**
 * Check arbitrage 2 chiều + filter minSpread
 */
export function calcBestTwoWay(
  ob1: { asks: [number, number][], bids: [number, number][] },
  ob2: { asks: [number, number][], bids: [number, number][] },
  minSpread: number = 0
): TwoWayResult | null {
  const r1 = calcOneWay(
    structuredClone(ob1.asks),
    structuredClone(ob2.bids)
  );

  const r2 = calcOneWay(
    structuredClone(ob2.asks),
    structuredClone(ob1.bids)
  );

  const valid1 = r1.qty > 0 && r1.spread >= minSpread;
  const valid2 = r2.qty > 0 && r2.spread >= minSpread;

  if (!valid1 && !valid2) return null;

  if (!valid2 || (valid1 && r1.profit >= r2.profit)) {
    return { ...r1, direction: 'A_TO_B' };
  }

  return { ...r2, direction: 'B_TO_A' };
}