export type ArbitrageTick = {
  spread: number;
  profit: number;
  ts: number;
};

export type DynamicResult = {
  pair: string;
  exchange1: string;
  exchange2: string;

  count: number;

  last: ArbitrageTick | null;
  history: ArbitrageTick[];
};