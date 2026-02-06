/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";
import { FixedTabs } from "@/components/fixed/FixedTabs";
import { FixedSettings } from "@/components/fixed/FixedSettings";
import Loading from "@/components/common/Loading";
import { endpoint } from "@/config/endpoint";
import { FixedPairsList } from "@/components/fixed/FixedPairsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePageVisible } from "@/hooks/usePageVisible";
import { useFixedStatusSWR } from "@/swr/useFixedStatusSWR";

export default function FixedPage() {
  const [data, setData] = useState<any>(null);
  const visible = usePageVisible();
  const { data: fixedStatus } = useFixedStatusSWR();
  const isRunning = fixedStatus?.status === "Running";

  const load = useCallback(async () => {
    const res = await fetch(endpoint.fixed.results);
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
