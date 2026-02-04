/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ClearButton } from "../common/ClearButton";
import { StatusDot } from "../common/StatusDot";
import { toast } from "sonner";

export function FixedSettings() {
  const [starting, setStarting] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [meta, setMeta] = useState<any>(null);
  const isRunning =
    meta?.status === "running" && meta?.runningMode === "fixed";

  const start = async () => {
    try {
      setStarting(true);
      await fetch("/api/fixed/start", { method: "POST" });
      toast("Fixed mode started");
    }finally {
      setStarting(false);
    }
  };

  const stop = async () => {
    try{
      setStopping(true);
      await fetch("/api/fixed/stop", { method: "POST" });
      toast("Fixed mode stopped");
    } finally {
      setStopping(false);
    }
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

        <Button onClick={start} disabled={isRunning || starting} loading={starting}>
          Start
        </Button>

        <Button onClick={stop} variant="destructive" disabled={!isRunning || stopping} loading={stopping}>
          Stop
        </Button>

        <ClearButton label="Clear Fixed Data" endpoint="/api/fixed/clear" />
              
      </div>
    </div>
  );
}
