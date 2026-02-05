import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArbitrageResult } from "@/lib/store/type";
import { endpoint } from "@/config/endpoint";
import { DetailModal } from "../common/DetailModal";

export function ResultTable({ data }: { data: ArbitrageResult[] }) {
  const [selected, setSelected] = useState<ArbitrageResult | null>(null);

  async function addToFixed(r: ArbitrageResult) {
    await fetch(endpoint.fixed.add, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pair: r.pair,
        exchange1: r.exchange1,
        exchange2: r.exchange2,
      }),
    });
  }

  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pair</TableHead>
            <TableHead>Exchange</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Last Ratio %</TableHead>
            <TableHead>Last Profit</TableHead>
            <TableHead>Last Seen</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sorted.map((r) => (
            <TableRow key={`${r.pair}-${r.exchange1}-${r.exchange2}`}>
              <TableCell className="font-medium">{r.pair}</TableCell>

              <TableCell>
                {r.exchange1} → {r.exchange2}
              </TableCell>

              <TableCell className="font-bold">{r.count}</TableCell>

              <TableCell>{r.last ? r.last.ratio.toFixed(2) : "-"}</TableCell>

              <TableCell>{r.last ? r.last.profit.toFixed(2) : "-"}</TableCell>

              <TableCell className="text-xs text-muted-foreground">
                {r.last
                  ? new Date(r.last.ts).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "-"}
              </TableCell>

              <TableCell className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelected(r)}
                >
                  Detail
                </Button>

                <Button size="sm" onClick={() => addToFixed(r)}>
                  Add to Fixed
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selected && (
        <DetailModal result={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
