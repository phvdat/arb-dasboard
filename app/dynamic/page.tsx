/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { DynamicTabs } from "@/components/dynamic/DynamicTabs";
import { DynamicSettings } from "@/components/dynamic/DynamicSettings";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function DynamicPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/dynamic/status");
      setData(await res.json());
    };

    load();
    const i = setInterval(load, 3000);
    return () => clearInterval(i);
  }, []);

  if (!data)
    return (
      <Button disabled size="sm">
        <Spinner data-icon="inline-start" />
        Loading...
      </Button>
    );

  return (
    <div className="p-6 space-y-6">
      <DynamicSettings />
      <DynamicTabs results={data.results || {}} />
    </div>
  );
}
