"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { groupResultsByExchange } from "@/lib/utils/groupResults";
import { FixedResultTable } from "./FixedResultTable";
import { ArbitrageResult } from "@/lib/store/type";

export function FixedTabs({
  results,
}: {
  results: Record<string, ArbitrageResult>;
}) {
  const groups = groupResultsByExchange(results);
  const tabs = Object.keys(groups);

  if (tabs.length === 0) {
    return <div className="text-muted-foreground">No fixed results yet</div>;
  }

  return (
    <Tabs defaultValue={tabs[0]}>
      <div className="overflow-x-auto overflow-y-hidden">
        <TabsList>
          {tabs.map((t) => (
            <TabsTrigger key={t} value={t}>
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {tabs.map((t) => (
        <TabsContent key={t} value={t}>
          <FixedResultTable data={groups[t]} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
