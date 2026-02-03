'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FixedResult } from './types';

export function FixedDetailModal({
  result,
  onClose,
}: {
  result: FixedResult;
  onClose: () => void;
}) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {result.pair} — {result.exchange1} → {result.exchange2}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <div><b>Count:</b> {result.count}</div>
          <div><b>Last Spread:</b> {result.lastSpread.toFixed(2)}%</div>
          <div><b>Last Profit:</b> {result.lastProfit.toFixed(2)}</div>
          <div>
            <b>Last Seen:</b>{' '}
            {new Date(result.lastSeen).toLocaleString()}
          </div>

          {result.details && (
            <>
              <hr />
              <div><b>Buy Price:</b> {result.details.buyPrice}</div>
              <div><b>Sell Price:</b> {result.details.sellPrice}</div>
              <div><b>Qty:</b> {result.details.qty}</div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
