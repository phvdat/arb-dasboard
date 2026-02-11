export type ArbitrageTick = {
  ratio: number;
  profit: number;
  ts: number;
  quantity: number;
  direction: string;
};

export type ArbitrageResult = {
    pair: string;
    exchange1: string;
    exchange2: string;
    count: number;
    last: ArbitrageTick;
    suspended?: boolean;
    history: ArbitrageTick[];
    [key: string]: unknown;
};

export type Pair = {
  pair: string;
  exchange1: string;
  exchange2: string;
};