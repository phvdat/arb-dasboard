/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/components/common/Loading";
import { DynamicSettings } from "@/components/dynamic/DynamicSettings";
import { DynamicTabs } from "@/components/dynamic/DynamicTabs";
import { endpoint } from "@/config/endpoint";
import { useMetaSWR } from "@/swr/useMetaSWR";
import { useEffect, useState } from "react";

export default function DynamicPage() {
  const [data, setData] = useState<any>(null);
  const { data: meta } = useMetaSWR();
  useEffect(() => {
    const load = async () => {
      const res = await fetch(endpoint.dynamic.status);
      setData(await res.json());
    };

    load();
    const i = setInterval(() => {
      if (meta?.runningMode !== "dynamic") return;
      load();
    }, 3000);
    return () => clearInterval(i);
  }, [meta?.runningMode]);

  if (!data) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      <DynamicSettings />
      <DynamicTabs results={data.results || {}} />
    </div>
  );
}
