"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { groupResultsByExchange } from "@/lib/utils/groupResults";
import { FixedResultTable } from "./FixedResultTable";
import { ArbitrageResult } from "@/lib/store/type";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useState } from "react";
import { Input } from "../ui/input";

export function FixedTabs({
  results,
}: {
  results: Record<string, ArbitrageResult>;
}) {
  const groups = groupResultsByExchange(results);
  const [topNumber, setTopNumber] = useState(100);
  const tabs = Object.keys(groups);
  const topPairs = Object.values(groups)
    .flat()
    .slice(0, topNumber)
    .sort((a, b) => b.count - a.count);

  if (tabs.length === 0) {
    return <div className="text-muted-foreground">No fixed results yet</div>;
  }

  return (
    <Tabs defaultValue={tabs[0]}>
      <ScrollArea>
        <TabsList className="mb-3">
          <TabsTrigger value="top-pairs">
            Top{" "}
            <Input
              type="number"
              className="border-none bg-transparent p-0 text-inherit shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent w-12"
              value={topNumber}
              onChange={(e) => setTopNumber(Number(e.target.value))}
            />
          </TabsTrigger>
          {tabs.map((t) => (
            <TabsTrigger key={t} value={t}>
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <TabsContent value="top-pairs">
        <FixedResultTable data={topPairs} />
      </TabsContent>
      {tabs.map((t) => (
        <TabsContent key={t} value={t}>
          <FixedResultTable data={groups[t]} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
