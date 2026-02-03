type Order = [number, number]; // price, amount

export function maximumQuantityTradable(
  buyAsks: Order[],
  sellBids: Order[],
  minSpread: number
) {
  let i = 0;
  let j = 0;
  let totalQty = 0;
  let totalProfit = 0;

  while (i < buyAsks.length && j < sellBids.length) {
    const [buyPrice, buyQty] = buyAsks[i];
    const [sellPrice, sellQty] = sellBids[j];

    const spread = ((sellPrice - buyPrice) / buyPrice) * 100;
    if (spread < minSpread) break;

    const qty = Math.min(buyQty, sellQty);

    totalQty += qty;
    totalProfit += qty * (sellPrice - buyPrice);

    buyAsks[i][1] -= qty;
    sellBids[j][1] -= qty;

    if (buyAsks[i][1] === 0) i++;
    if (sellBids[j][1] === 0) j++;
  }

  return {
    qty: totalQty,
    profit: totalProfit,
  };
}
