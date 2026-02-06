/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/components/common/Loading";
import { DynamicSettings } from "@/components/dynamic/DynamicSettings";
import { DynamicTabs } from "@/components/dynamic/DynamicTabs";
import { endpoint } from "@/config/endpoint";
import { usePageVisible } from "@/hooks/usePageVisible";
import { useDynamicStatusSWR } from "@/swr/useDynamicStatusSWR";
import { useCallback, useEffect, useState } from "react";

export default function DynamicPage() {
  const [data, setData] = useState<any>(null);
  const visible = usePageVisible();
  const { data: dynamicStatus } = useDynamicStatusSWR();
  const isRunning = dynamicStatus?.status === "Running";

  const load = useCallback(async () => {
    const res = await fetch(endpoint.dynamic.results);
    setData(await res.json());
  }, []);

  useEffect(() => {
    if (!visible || !isRunning) return;
    load();
    const i = setInterval(load, 3000);
    return () => clearInterval(i);
  }, [isRunning, load, visible]);

  useEffect(() => {
    load();
  }, []);

  if (!data) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      <DynamicSettings />
      <DynamicTabs results={data.results || {}} />
    </div>
  );
}
