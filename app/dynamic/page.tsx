/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/components/common/Loading";
import { DynamicSettings } from "@/components/dynamic/DynamicSettings";
import { DynamicTabs } from "@/components/dynamic/DynamicTabs";
import { endpoint } from "@/config/endpoint";
import { mergeDynamicWithFixed } from "@/helpers/mergeDynamicWithFixed";
import { usePageVisible } from "@/hooks/usePageVisible";
import { useDynamicStatusSWR } from "@/swr/useDynamicStatusSWR";
import { useEffect } from "react";
import useSWR from "swr";

const fetcher = async (url: string)=> {
  const res = await fetch(url);
  return await res.json();
}

export default function DynamicPage() {
  const visible = usePageVisible();
  const { data: dynamicStatus } = useDynamicStatusSWR();
  const isRunning = dynamicStatus?.status === "Running";
  const {data: fixedData} = useSWR(endpoint.fixed.results, fetcher);
  const {data: dynamicData, mutate} = useSWR(endpoint.dynamic.results, fetcher);

  const dataSerialized = mergeDynamicWithFixed(
    dynamicData?.results || {},
    fixedData?.results || {}
  );

  useEffect(() => {
    if (!visible || !isRunning) return;
    mutate();
    const i = setInterval(mutate, 3000);
    return () => clearInterval(i);
  }, [isRunning, mutate, visible]);


  if (!dataSerialized) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      <DynamicSettings />
      <DynamicTabs results={dataSerialized || {}} />
    </div>
  );
}
