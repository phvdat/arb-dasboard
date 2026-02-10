/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ArbitrageResult } from "@/lib/store/type";

export function DetailModal({
  result,
  onClose,
}: {
  result: ArbitrageResult;
  onClose: () => void;
}) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {result.pair} — {result.exchange1.toUpperCase()} -{" "}
            {result.exchange2.toUpperCase()}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[800px] overflow-y-auto border rounded">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Ratio %</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Direction</TableHead>˝
              </TableRow>
            </TableHeader>

            <TableBody>
              {result.history
                ?.slice()
                .reverse()
                .map((h: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell>
                      {new Date(h.ts).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>{h.ratio.toFixed(2)}</TableCell>
                    <TableCell>{h.profit.toFixed(2)}</TableCell>
                    <TableCell>{h.last?.quantity?.toFixed(2)}</TableCell>
                    <TableCell>{h.last?.direction}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
