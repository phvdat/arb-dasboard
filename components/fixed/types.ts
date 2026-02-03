export type FixedResult = {
  pair: string;
  exchange1: string;
  exchange2: string;
  count: number;
  lastSpread: number;
  lastProfit: number;
  lastSeen: number;

  // optional – nếu backend có snapshot chi tiết
  details?: {
    buyPrice?: number;
    sellPrice?: number;
    qty?: number;
  };
};
