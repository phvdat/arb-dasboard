/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { ClearButton } from "../common/ClearButton";
import { StatusDot } from "../common/StatusDot";
import { toast } from "sonner";

export function DynamicSettings() {
  const [starting, setStarting] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [exchanges, setExchanges] = useState("gate,bingx,bitget,bitmart,bitmex,bybit,coinex,cryptocom,htx,hyperliquid,kucoin,mexc,woo");
  const [minVolume, setMinVolume] = useState(100000);
  const [minPriceRatio, setMinPriceRatio] = useState(1.006);
  const [maxAllowedRatio, setMaxAllowedRatio] = useState(2);
  const [meta, setMeta] = useState<any>(null);
  const isRunning =
    meta?.status === "running" && meta?.runningMode === "dynamic";
  async function start() {
    try {
      setStarting(true);
      await fetch("/api/dynamic/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exchanges: exchanges.split(",").map((s) => s.trim()),
          minVolume,
          minPriceRatio,
          maxAllowedRatio,
        }),
      });
      toast("Dynamic mode started");
    } finally {
      setStarting(false);
    }
  }

  async function stop() {
    try {
      setStopping(true);
      await fetch("/api/dynamic/stop", { method: "POST" });
      toast("Dynamic mode stopped");
    } finally {
      setStopping(false);
    }
  }

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/dynamic/config");
      const json = await res.json();
      if (json.config) {
        setExchanges(json.config.exchanges.join(","));
        setMinVolume(json.config.minVolume);
        setMinPriceRatio(json.config.minPriceRatio);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadMeta = async () => {
      const res = await fetch("/api/meta");
      setMeta(await res.json());
    };

    loadMeta();
  }, []);

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h2 className="font-semibold text-lg">Dynamic Settings</h2>

      <div>
        <label className="text-sm">Exchanges (comma separated)</label>
        <Input
          value={exchanges}
          onChange={(e) => setExchanges(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm">Min Volume (USDT)</label>
          <Input
            type="number"
            value={minVolume}
            onChange={(e) => setMinVolume(+e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">Min Ratio (%)</label>
          <Input
            type="number"
            step={0.01}
            value={minPriceRatio}
            onChange={(e) => setMinPriceRatio(+e.target.value)}
          />
        </div>
        
        <div>
          <label className="text-sm">Max Allow Ratio (%)</label>
          <Input
            type="number"
            step={0.01}
            value={maxAllowedRatio}
            onChange={(e) => setMaxAllowedRatio(+e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <StatusDot status={isRunning ? "online" : "idle"} />
        <Button
          onClick={start}
          disabled={isRunning || starting}
          loading={starting}
        >
          Start
        </Button>

        <Button
          variant="destructive"
          onClick={stop}
          disabled={!isRunning || stopping}
          loading={stopping}
        >
          Stop
        </Button>
        <ClearButton label="Clear Dynamic Data" endpoint="/api/dynamic/clear" />
      </div>
    </div>
  );
}
