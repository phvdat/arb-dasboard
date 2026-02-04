/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ClearButton } from "../common/ClearButton";
import { StatusDot } from "../common/StatusDot";

export function FixedSettings() {
  const [meta, setMeta] = useState<any>(null);
  const isRunning =
    meta?.status === "running" && meta?.runningMode === "fixed";

  const start = async () => {
    await fetch("/api/fixed/start", { method: "POST" });
  };

  const stop = async () => {
    await fetch("/api/fixed/stop", { method: "POST" });
  };

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
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Fixed Arbitrage</h1>
      <div className="flex items-center gap-2">
        <StatusDot status={isRunning ? "online": "idle"} />

        <Button onClick={start} disabled={isRunning}>
          Start
        </Button>

        <Button onClick={stop} variant="destructive" disabled={!isRunning}>
          Stop
        </Button>

        <ClearButton label="Clear Fixed Data" endpoint="/api/fixed/clear" />
              
      </div>
    </div>
  );
}
