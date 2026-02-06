/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/components/common/Loading";
import { FixedSettings } from "@/components/fixed/FixedSettings";
import { FixedTabs } from "@/components/fixed/FixedTabs";
import { endpoint } from "@/config/endpoint";
import { usePageVisible } from "@/hooks/usePageVisible";
import { useFixedStatusSWR } from "@/swr/useFixedStatusSWR";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";


const fetcher = async (url: string) => {
  const res = await fetch(url);
  return await res.json();
}
export default function FixedPage() {
  const visible = usePageVisible();
  const { data: fixedStatus } = useFixedStatusSWR();
  const isRunning = fixedStatus?.status === "Running";

  const {data, mutate} = useSWR(endpoint.fixed.results, fetcher);

  useEffect(() => {
    if (!visible || !isRunning) return;
    mutate();
    const i = setInterval(mutate, 3000);
    return () => clearInterval(i);
  }, [isRunning, mutate, visible]);

  if (!data) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      <FixedSettings />
      <FixedTabs results={data.results || {}} />
    </div>
  );
}
