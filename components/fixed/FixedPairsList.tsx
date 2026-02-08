/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { endpoint } from "@/config/endpoint";
import { toast } from "sonner";

type FixedPair = {
  pair: string;
  exchange1: string;
  exchange2: string;
};

export function FixedPairsList() {
  const [pairs, setPairs] = useState<FixedPair[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);
  async function load() {
    const r = await fetch(endpoint.fixed.pairs);
    const data = await r.json();
    setPairs(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(p: FixedPair) {
    const id = `${p.pair}|${p.exchange1}|${p.exchange2}`;
    setRemovingId(id);

    try {
      const res = await fetch(`${endpoint.fixed.pairs}?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.status == 200) {
        await load();
        toast.success(`Pair ${p.pair} removed`);
      }
    } finally {
      setRemovingId(null);
    }
  }

  if (!pairs.length) {
    return (
      <div className="text-muted-foreground">No fixed pairs configured</div>
    );
  }

  return (
    <div className="space-y-2">
      {pairs.map((p) => (
        <div
          key={`${p.pair}|${p.exchange1}|${p.exchange2}`}
          className="flex items-center justify-between border rounded px-3 py-2"
        >
          <div className="font-mono text-sm">
            {p.pair} · {p.exchange1} → {p.exchange2}
          </div>

          <Button
            size="sm"
            variant="destructive"
            loading={removingId === `${p.pair}|${p.exchange1}|${p.exchange2}`}
            onClick={() => remove(p)}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}