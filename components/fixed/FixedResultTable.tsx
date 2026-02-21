"use client";

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
import { Pair } from "@/lib/store/type";
import { DetailModal } from "../common/DetailModal";
import { endpoint } from "@/config/endpoint";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { ArbitrageTable } from "@/types/common";

const fetcher = async (url: string, pair: string | null) => {
  if (!pair) return [];
  const res = await fetch(`${url}?pair=${encodeURIComponent(pair)}`);
  return await res.json();
};

export function FixedResultTable({ data }: { data: ArbitrageTable[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const { data: history } = useSWR(
    [endpoint.fixed.history, selected],
    ([url, pair]) => fetcher(url, pair),
  );
  async function remove(p: Pair) {
    const id = `${p.pair}|${p.exchange1}|${p.exchange2}`;
    setRemovingId(id);
    try {
      const res = await fetch(
        `${endpoint.fixed.pairs}?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );
      if (res.status == 200) {
        mutate(endpoint.fixed.results);
        toast.success(`Pair ${p.pair} removed`);
      }
    } finally {
      setRemovingId(null);
    }
  }
  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pair</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Ratio %</TableHead>
            <TableHead>Profit</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Direction</TableHead>
            <TableHead>Last Seen</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sorted.map((r) => (
            <TableRow key={`${r.pair}-${r.exchange1}`}>
              <TableCell>{r.pair}</TableCell>
              <TableCell className="font-bold">{r.count}</TableCell>
              <TableCell>{r.last.ratio.toFixed(4)}</TableCell>
              <TableCell>{r.last.profit.toFixed(2)}</TableCell>
              <TableCell>{r.last?.quantity?.toFixed(2)}</TableCell>
              <TableCell>
                {r.last?.direction === "A_TO_B"
                  ? `${r.exchange1} -> ${r.exchange2}`
                  : `${r.exchange2} -> ${r.exchange1}`}
              </TableCell>
              <TableCell>{new Date(r.last.ts).toLocaleTimeString()}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setSelected(`${r.pair}|${r.exchange1}|${r.exchange2}`)
                  }
                >
                  Details
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  loading={
                    removingId === `${r.pair}|${r.exchange1}|${r.exchange2}`
                  }
                  onClick={() => remove(r)}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selected && (
        <DetailModal history={history} title={selected.replaceAll("|", " ")} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
