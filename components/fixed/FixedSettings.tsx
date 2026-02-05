/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { endpoint } from "@/config/endpoint";
import { useMetaSWR } from "@/swr/useMetaSWR";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { ClearButton } from "../common/ClearButton";
import { StatusDot } from "../common/StatusDot";

export function FixedSettings() {
  const [starting, setStarting] = useState(false);
  const [stopping, setStopping] = useState(false);
  const { data: meta } = useMetaSWR();
  const isRunning = meta?.status === "running" && meta?.runningMode === "fixed";

  const start = async () => {
    try {
      setStarting(true);
      const res = await fetch(endpoint.fixed.start, { method: "POST" });
      switch (res.status) {
        case 200:
          mutate(endpoint.meta);
          toast.success("Fixed mode started");
          break;
        case 409:
          const { message } = await res.json();
          toast.error(message);
          break;
      }
    } finally {
      setStarting(false);
    }
  };

  const stop = async () => {
    try {
      setStopping(true);
      await fetch(endpoint.fixed.stop, { method: "POST" });
      mutate(endpoint.meta);
      toast("Fixed mode stopped");
    } finally {
      setStopping(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h2 className="font-semibold text-lg">Fixed Arbitrage</h2>
      <div className="flex items-center gap-2">
        <StatusDot status={isRunning ? "online" : "idle"} />

        <Button
          onClick={start}
          disabled={isRunning || starting}
          loading={starting}
        >
          Start
        </Button>

        <Button
          onClick={stop}
          variant="destructive"
          disabled={!isRunning || stopping}
          loading={stopping}
        >
          Stop
        </Button>

        <ClearButton label="Clear Fixed Data" endpoint={endpoint.fixed.clear} />
      </div>
    </div>
  );
}
