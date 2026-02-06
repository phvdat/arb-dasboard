/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/components/common/Loading";
import { DynamicSettings } from "@/components/dynamic/DynamicSettings";
import { DynamicTabs } from "@/components/dynamic/DynamicTabs";
import { endpoint } from "@/config/endpoint";
import { usePageVisible } from "@/hooks/usePageVisible";
import { useMetaSWR } from "@/swr/useMetaSWR";
import { useCallback, useEffect, useState } from "react";

export default function DynamicPage() {
  const [data, setData] = useState<any>(null);
  const visible = usePageVisible();
  const { data: meta } = useMetaSWR();

  const load = useCallback(async () => {
    const res = await fetch(endpoint.dynamic.status);
    setData(await res.json());
  }, []);

  useEffect(() => {
    if (!visible || meta?.runningMode !== "dynamic") return;
    load();
    const i = setInterval(load, 3000);
    return () => clearInterval(i);
  }, [meta?.runningMode, load, visible]);

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
