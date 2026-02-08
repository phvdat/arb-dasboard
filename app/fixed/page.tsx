/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/components/common/Loading";
import { FixedPairsList } from "@/components/fixed/FixedPairsList";
import { FixedSettings } from "@/components/fixed/FixedSettings";
import { FixedTabs } from "@/components/fixed/FixedTabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { endpoint } from "@/config/endpoint";
import { usePageVisible } from "@/hooks/usePageVisible";
import { useFixedStatusSWR } from "@/swr/useFixedStatusSWR";
import { useEffect } from "react";
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
      <Tabs defaultValue="scan-result">
        <TabsList className="w-full">
          <TabsTrigger value="scan-result">Scan Results</TabsTrigger>
          <TabsTrigger value="pairs-list">All Pairs</TabsTrigger>
        </TabsList>
        <TabsContent value="scan-result">
          <FixedTabs results={data.results || {}} />
        </TabsContent>
        <TabsContent value="pairs-list">
          <FixedPairsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
