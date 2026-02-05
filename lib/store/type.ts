export type ArbitrageTick = {
  ratio: number;
  profit: number;
  ts: number;
};

export type ArbitrageResult = {
    pair: string;
    exchange1: string;
    exchange2: string;
    count: number;
    last: ArbitrageTick;
    history: ArbitrageTick[];
};