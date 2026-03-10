"use client";

type OrderBookType = {
  asks: [number, number][];
  bids: [number, number][];
};

const f = (n: number) => Number(n.toFixed(5)).toString();

export function OrderBook({
  data,
  reverse = false,
}: {
  data: OrderBookType;
  reverse?: boolean;
}) {
  if (!data) return null;

  const max = Math.max(
    ...data.asks.map((a) => a[1]),
    ...data.bids.map((b) => b[1])
  );

  const calcTotal = (arr: [number, number][]) => {
    let sum = 0;
    return arr.map(([p, q]) => {
      sum += q;
      return [p, q, sum] as [number, number, number];
    });
  };

  const asks = calcTotal([...data.asks].reverse());
  const bids = calcTotal(data.bids);
  const renderRow = (
    data: [number, number, number],
    percent: number,
    color: "red" | "green"
  ) => {
    if (!reverse) {
      return (
        <>
          <span className={color === "red" ? "text-red-500 flex-1" : "text-green-500 flex-1"}>
            {f(data[0])}
          </span>
          <span className="flex-1 hidden md:block">{f(data[1])}</span>
          <span className="flex-1 text-right">{f(data[1]*data[0])}</span>
        </>
      );
    }

    return (
      <>
        <span className="text-left flex-1">{f(data[1]*data[0])}</span>
        <span className="flex-1 hidden md:block">{f(data[1])}</span>
        <span
          className={
            color === "red"
              ? "text-red-500 flex-1 text-right"
              : "text-green-500 flex-1 text-right"
          }
        >
          {f(data[0])}
        </span>
      </>
    );
  };

  return (
    <div className="text-xs font-mono">
      {!reverse ? (
        <div className="flex gap-0.5 justify-between pb-1 text-muted-foreground">
          <span className="flex-1">Price</span>
          <span className="flex-1 hidden md:block">Amount</span>
          <span className="flex-1 text-right">Total($)</span>
        </div>
      ) : (
        <div className="flex gap-0.5 justify-between pb-1 text-muted-foreground">
          <span className="flex-1">Total($)</span>
          <span className="flex-1 hidden md:block">Amount</span>
          <span className="flex-1 text-right">Price</span>
        </div>
      )}
      <div className="mb-1">
        {asks.map((a, i) => {
          const percent = (a[1] / max) * 100;
          return (
            <div key={i} className={`relative flex gap-0.5 justify-between`}>
              <div
                className="absolute right-0 top-0 h-full bg-red-500/20"
                style={{ width: `${percent}%` }}
              />
              {renderRow(a, percent, "red")}
            </div>
          );
        })}
      </div>
      <div>
        {bids.map((b, i) => {
          const percent = (b[1] / max) * 100;
          return (
            <div key={i} className={`relative flex gap-0.5 justify-between`}>
              <div
                className="absolute right-0 top-0 h-full bg-green-500/20"
                style={{ width: `${percent}%` }}
              />
              {renderRow(b, percent, "green")}
            </div>
          );
        })}
      </div>
    </div>
  );
}