/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/components/common/Loading";
import { DynamicSettings } from "@/components/dynamic/DynamicSettings";
import { DynamicTabs } from "@/components/dynamic/DynamicTabs";
import { useEffect, useState } from "react";

export default function DynamicPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/dynamic/status");
      setData(await res.json());
    };

    load();
    const i = setInterval(load, 10000);
    return () => clearInterval(i);
  }, []);

  if (!data) return <Loading />

  return (
    <div className="p-6 space-y-6">
      <DynamicSettings />
      <DynamicTabs results={data.results || {}} />
    </div>
  );
}
