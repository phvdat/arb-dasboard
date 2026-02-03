/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DynamicResult } from "./types";
import { Button } from "@/components/ui/button";

export function ResultTable({ data }: { data: DynamicResult[] }) {
  const sorted = [...data].sort((a, b) => b.count - a.count);
  async function addToFixed(r: any) {
    await fetch("/api/fixed/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pair: r.pair,
        exchange1: r.exchange1,
        exchange2: r.exchange2,
      }),
    });
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pair</TableHead>
          <TableHead>Count</TableHead>
          <TableHead>Spread %</TableHead>
          <TableHead>Profit</TableHead>
          <TableHead>Last Seen</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {sorted.map((r) => (
          <TableRow key={`${r.pair}-${r.exchange1}`}>
            <TableCell>{r.pair}</TableCell>
            <TableCell className="font-bold">{r.count}</TableCell>
            <TableCell>{r.lastSpread.toFixed(2)}</TableCell>
            <TableCell>{r.lastProfit.toFixed(2)}</TableCell>
            <TableCell>{new Date(r.lastSeen).toLocaleTimeString()}</TableCell>
            <TableCell>
              <Button size="sm" onClick={() => addToFixed(r)}>
                Add to Fixed
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
