"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ArbitrageResult, ArbitrageTick } from "@/lib/store/type";
import { List, RowComponentProps } from "react-window";

function Row({
  index,
  style,
  result,
  history,
}: RowComponentProps & { result: ArbitrageResult; history: ArbitrageTick[] }) {
  const h = history[index];

  return (
    <div style={style} className="grid grid-cols-5 border-b px-4 py-2 text-sm">
      <div>{new Date(h.ts).toLocaleString("vi-VN")}</div>
      <div>{h.ratio.toFixed(4)}</div>
      <div>{h.profit.toFixed(2)}</div>
      <div>{h?.quantity?.toFixed(2)}</div>
      <div>
        {h?.direction === "A_TO_B"
          ? `${result.exchange1} → ${result.exchange2}`
          : `${result.exchange2} → ${result.exchange1}`}
      </div>
    </div>
  );
}

export function DetailModal({
  result,
  onClose,
}: {
  result: ArbitrageResult;
  onClose: () => void;
}) {
  const history = result.history?.slice().reverse() ?? [];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="min-w-fit w-3xl">
        <DialogHeader>
          <DialogTitle>
            {result.pair} — {result.exchange1.toUpperCase()} -{" "}
            {result.exchange2.toUpperCase()}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto">
          <div className="min-w-[600px] max-h-[600px]">
            <div className="grid grid-cols-5 bg-muted border-b px-4 py-2 text-sm font-semibold">
              <div>Time</div>
              <div>Ratio %</div>
              <div>Profit</div>
              <div>Quantity</div>
              <div>Direction</div>
            </div>

            <List
              className="md:hidden"
              rowCount={history.length}
              rowHeight={48}
              rowComponent={Row}
              rowProps={{
                result,
                history,
              }}
            />
            <List
              className="hidden md:block"
              rowCount={history.length}
              rowHeight={36}
              rowComponent={Row}
              rowProps={{
                result,
                history,
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
