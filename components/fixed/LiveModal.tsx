"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { OrderBook } from "./OrderBook";
import { Spinner } from "../ui/spinner";

type OrderBookType = {
  asks: [number, number][];
  bids: [number, number][];
};

type LiveData = {
  ex1: string;
  ex2: string;

  ob1: OrderBookType;
  ob2: OrderBookType;

  bestRatio: number;
  direction: string;
  buy: string;
  sell: string;
};

export function LiveModal({
  pair,
  onClose,
}: {
  pair: string;
  onClose: () => void;
}) {
  const [data, setData] = useState<LiveData | null>(null);
  useEffect(() => {
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}?pair=${encodeURIComponent(pair)}`,
    );
    ws.onmessage = (e) => {
      setData(JSON.parse(e.data));
    };
    ws.onerror = (e) => {
      console.error("WS error", e);
    };
    return () => {
      ws.close();
    };
  }, [pair]);

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="min-w-fit w-3xl px-4">
        <DialogHeader>
          <DialogTitle>Live Arbitrage: {pair.split("|")[0]}</DialogTitle>
        </DialogHeader>
        {!data && <Spinner className="mx-auto"/>}
        {data && (
          <>
            <div className="text-center mb-4 text-lg font-semibold">
              BUY <span className="text-green-600">{data.buy}</span>
              {" → "}
              SELL <span className="text-red-600">{data.sell}</span>
              <p
                className={`ml-3 ${data.bestRatio > 1 ? "text-green-600" : "text-red-600"}`}
              >
                {data.bestRatio.toFixed(4)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-semibold mb-2 text-center">{data.ex1}</div>
                <OrderBook data={data.ob1} reverse/>
              </div>
              <div>
                <div className="font-semibold mb-2 text-center">{data.ex2}</div>
                <OrderBook data={data.ob2} />
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
