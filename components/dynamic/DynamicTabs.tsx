"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArbitrageResult } from "@/lib/store/type";
import { groupResultsByExchange } from "@/lib/utils/groupResults";
import { useState } from "react";
import { Input } from "../ui/input";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { ResultTable } from "./ResultTable";

type Props = {
  results: Record<string, ArbitrageResult & { inFixed: boolean }>;
};

export function DynamicTabs({ results }: Props) {
  const [topNumber, setTopNumber] = useState(100);
  const groups = groupResultsByExchange(results);
  const tabs = Object.keys(groups);
  const topPairs = Object.values(groups)
    .flat()
    .slice(0, topNumber)
    .sort((a, b) => b.count - a.count);

  if (tabs.length === 0) {
    return (
      <div className="text-muted-foreground">
        No arbitrage opportunities yet
      </div>
    );
  }
  return (
    <Tabs defaultValue="top-pairs">
      <ScrollArea>
        <TabsList className="mb-2">
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
        <ResultTable data={topPairs} />
      </TabsContent>
      {tabs.map((t) => (
        <TabsContent key={t} value={t}>
          <ResultTable data={groups[t]} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
