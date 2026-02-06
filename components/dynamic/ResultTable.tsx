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
import { ArbitrageResult, Pair } from "@/lib/store/type";
import { endpoint } from "@/config/endpoint";
import { DetailModal } from "../common/DetailModal";
import { toast } from "sonner";
import { mutate } from "swr";
import { Plus, Trash } from "lucide-react";
import { Switch } from "../ui/switch";

export function ResultTable({
  data,
}: {
  data: (ArbitrageResult & { inFixed: boolean })[];
}) {
  const [selected, setSelected] = useState<ArbitrageResult | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function addToFixed(r: ArbitrageResult) {
    try {
      const res = await fetch(endpoint.fixed.pairs, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pair: r.pair,
          exchange1: r.exchange1,
          exchange2: r.exchange2,
        }),
      });

      if (res.status == 200) {
        toast.success(`Pair ${r.pair} added to fixed pairs`);
      }
      if (res.status == 400) {
        const { message } = await res.json();
        toast.error(message);
      }
    } finally {
      //
    }
  }
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

  const updateSuspended = async (id: string, suspended: boolean) => {
    try {
      const res = await fetch(
        `${endpoint.dynamic.pairs}?id=${encodeURIComponent(id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ suspended }),
        },
      );
      if (res.status == 200) {
        mutate(endpoint.dynamic.results);
        toast.success(`Pair ${id} suspended status updated`);
      }
    } finally {
      //
    }
  };

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
            <TableHead>Suspended</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sorted.map((r) => (
            <TableRow key={`${r.pair}-${r.exchange1}-${r.exchange2}`} className={r.suspended ? 'opacity-50' : ''}>
              <TableCell className="font-medium">{r.pair}</TableCell>

              <TableCell>
                {r.exchange1.toUpperCase()} - {r.exchange2.toUpperCase()}
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
                {r.inFixed ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    loading={
                      removingId === `${r.pair}|${r.exchange1}|${r.exchange2}`
                    }
                    onClick={() => remove(r)}
                  >
                    <Trash /> In Fixed
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => addToFixed(r)}>
                    <Plus /> to Fixed
                  </Button>
                )}
              </TableCell>

              <TableCell>
                <Switch
                  defaultChecked={r.suspended}
                  onCheckedChange={(checked) =>
                    updateSuspended(
                      `${r.pair}|${r.exchange1}|${r.exchange2}`,
                      checked,
                    )
                  }
                />
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
