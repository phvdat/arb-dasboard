/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { FixedTabs } from "@/components/fixed/FixedTabs";
import { FixedSettings } from "@/components/fixed/FixedSettings";
import Loading from "@/components/common/Loading";
import { endpoint } from "@/config/endpoint";
import { useMetaSWR } from "@/swr/useMetaSWR";
import { FixedPairsList } from "@/components/fixed/FixedPairsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FixedPage() {
  const [data, setData] = useState<any>(null);
  const { data: meta } = useMetaSWR();

  const fetchData = async () => {
    const res = await fetch(endpoint.fixed.status);
    setData(await res.json());
  };

  useEffect(() => {
    fetchData();
    const i = setInterval(() => {
      if (meta?.runningMode !== "fixed") return;
      fetchData();
    }, 3000);
    return () => clearInterval(i);
  }, [meta?.runningMode]);

  if (!data) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      <FixedSettings />
      <Tabs defaultValue="pairs-list">
        <TabsList  className="w-full">
          <TabsTrigger value="scan-result">Results</TabsTrigger>
          <TabsTrigger value="pairs-list">Pairs</TabsTrigger>
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
