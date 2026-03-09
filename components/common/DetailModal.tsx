"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ArbitrageTick } from "@/lib/store/type";
import { List, RowComponentProps } from "react-window";
import useSWR from "swr";
import { useState } from "react";
import Loading from "./Loading";
import { Button } from "@/components/ui/button";

const LIMIT = 1000;

const fetcher = async (url: string, pair: string, offset: number) => {
  const res = await fetch(
    `${url}?pair=${encodeURIComponent(pair)}&limit=${LIMIT}&offset=${offset}`
  );
  return res.json();
};

export function DetailModal({
  title,
  pair,
  endpoint,
  onClose,
}: {
  title: string;
  pair: string;
  endpoint: string;
  onClose: () => void;
}) {
  const [page, setPage] = useState(0);
  const offset = page * LIMIT;

  const { data, isLoading } = useSWR(
    [endpoint, pair, offset],
    ([url, p, o]) => fetcher(url, p, o)
  );

  if (isLoading || !data) return <Loading />;

  const history: ArbitrageTick[] = data.results ?? [];
  const total = data.total ?? 0;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="min-w-fit w-3xl">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto">
          <div className="min-w-[600px] max-h-[600px]">

            {/* header */}
            <div className="grid grid-cols-5 bg-muted border-b px-4 py-2 text-sm font-semibold">
              <div>Time</div>
              <div>Ratio %</div>
              <div>Profit</div>
              <div>Quantity</div>
              <div>Direction</div>
            </div>

            {/* mobile */}
            <List
              className="md:hidden"
              rowCount={history.length}
              rowHeight={48}
              rowComponent={Row}
              rowProps={{ history }}
            />

            {/* desktop */}
            <List
              className="hidden md:block"
              rowCount={history.length}
              rowHeight={36}
              rowComponent={Row}
              rowProps={{ history }}
            />
          </div>
        </div>

        {/* pagination */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>

          <span className="text-sm">
            Page {page + 1} / {Math.ceil(total / LIMIT) || 1}
          </span>

          <Button
            size="sm"
            variant="outline"
            disabled={offset + LIMIT >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({
  index,
  style,
  history,
}: RowComponentProps & { history: ArbitrageTick[] }) {
  const h = history[index];

  return (
    <div style={style} className="grid grid-cols-5 border-b px-4 py-2 text-sm">
      <div>{new Date(h.ts).toLocaleString("vi-VN")}</div>
      <div>{h.ratio.toFixed(4)}</div>
      <div>{h.profit.toFixed(2)}</div>
      <div>{h?.quantity?.toFixed(2)}</div>
      <div>
        {h?.direction === "A_TO_B" ? (
          <span className="text-green-400">→</span>
        ) : (
          <span className="text-red-400">←</span>
        )}
      </div>
    </div>
  );
}