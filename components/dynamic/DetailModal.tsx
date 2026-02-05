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
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  detailKey: string | null;
};

export function DetailModal({ open, onOpenChange, detailKey }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !detailKey) return;

    const load = async () => {
      setLoading(true);
      const res = await fetch(
        `/api/dynamic/detail?key=${encodeURIComponent(detailKey)}`,
      );
      setData(await res.json());
      setLoading(false);
    };

    load();
  }, [open, detailKey]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {data
              ? `${data.pair} (${data.exchange1} → ${data.exchange2})`
              : "Detail"}
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <Button disabled size="sm">
            <Spinner data-icon="inline-start" />
            Loading...
          </Button>
        )}

        {data && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Total signals: <b>{data.count}</b>
            </div>

            <div className="max-h-[400px] overflow-y-auto border rounded">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Ratio %</TableHead>
                    <TableHead>Profit</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.history
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
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
