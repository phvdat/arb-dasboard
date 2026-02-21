"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { groupResultsByExchange } from "@/lib/utils/groupResults";
import { ArbitrageTable } from "@/types/common";
import { useMemo, useState } from "react";
import { Input } from "../ui/input";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { ResultTable } from "./ResultTable";

type Props = {
  results: Record<string, ArbitrageTable>;
};

export function DynamicTabs({ results }: Props) {
  console.log(results);
  
  const [topNumber, setTopNumber] = useState(100);

  const groups = useMemo(() => groupResultsByExchange(results), [results]);
  const tabs = Object.keys(groups);

  const topPairs = useMemo(() => {
    return Object.values(groups)
      .flat()
      .sort(
        (a, b) =>
          (Number(a.suspended) || 0) - (Number(b.suspended) || 0) ||
          b.count - a.count,
      )
      .slice(0, topNumber);
  }, [groups, topNumber]);

  if (tabs.length === 0) {
    return (
      <div className="text-muted-foreground">
        No arbitrage opportunities yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
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
    </div>
  );
}
