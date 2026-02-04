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
  const [exchanges, setExchanges] = useState("bingx,bitmart");
  const [minVolume, setMinVolume] = useState(100000);
  const [minSpread, setMinSpread] = useState(0.6);
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
          minSpread,
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
        setMinSpread(json.config.minSpread);
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
    const i = setInterval(loadMeta, 2000);
    return () => clearInterval(i);
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Min Volume (USDT)</label>
          <Input
            type="number"
            value={minVolume}
            onChange={(e) => setMinVolume(+e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">Min Spread (%)</label>
          <Input
            type="number"
            step="0.01"
            value={minSpread}
            onChange={(e) => setMinSpread(+e.target.value)}
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
