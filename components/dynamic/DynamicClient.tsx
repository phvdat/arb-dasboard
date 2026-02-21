"use client";

import Loading from "@/components/common/Loading";
import { TimeRangeSelect } from "@/components/common/TimeFilter";
import { DynamicSettings } from "@/components/dynamic/DynamicSettings";
import { DynamicTabs } from "@/components/dynamic/DynamicTabs";
import { endpoint } from "@/config/endpoint";
import { mergeDynamicWithFixed } from "@/helpers/mergeDynamicWithFixed";
import { usePageVisible } from "@/hooks/usePageVisible";
import { useDynamicStatusSWR } from "@/swr/useDynamicStatusSWR";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return await res.json();
};

export default function DynamicClient() {
  const visible = usePageVisible();
  const searchParams = useSearchParams();
  const range = searchParams.get("range") || "all";
  const { data: dynamicStatus } = useDynamicStatusSWR();
  const isRunning = dynamicStatus?.status === "Running";
  const { data: fixedData } = useSWR(endpoint.fixed.results, fetcher);
  const { data: dynamicData } = useSWR(
    `${endpoint.dynamic.results}?range=${range}`,
    fetcher,
    {
      refreshInterval: visible && isRunning ? 3000 : 0,
    },
  );

  const dataSerialized = mergeDynamicWithFixed(
    dynamicData || {},
    fixedData?.results || {},
  );

  return (
    <div className="p-6 space-y-6">
      <DynamicSettings />
      <TimeRangeSelect />
      {
        Object.entries(dataSerialized).length === 0 ? <Loading />:
      <DynamicTabs results={dataSerialized || {}} />
      }
    </div>
  );
}
