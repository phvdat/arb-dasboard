/* eslint-disable react-hooks/purity */
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArbitrageResult } from "@/lib/store/type";
import { groupResultsByExchange } from "@/lib/utils/groupResults";
import { useMemo, useState } from "react";
import { Input } from "../ui/input";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { ResultTable } from "./ResultTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  results: Record<string, ArbitrageResult>;
};

export function DynamicTabs({ results }: Props) {
  const [topNumber, setTopNumber] = useState(100);
  const [timeFilter, setTimeFilter] = useState("all");

  const groups = useMemo(() => groupResultsByExchange(results), [results]);
  const tabs = Object.keys(groups);

  const filteredGroups = useMemo(() => {
    const now = Date.now();

    let filterFrom = 0;

    switch (timeFilter) {
      case "5m":
        filterFrom = now - 5 * 60 * 1000;
        break;
      case "15m":
        filterFrom = now - 15 * 60 * 1000;
        break;
      case "1h":
        filterFrom = now - 60 * 60 * 1000;
        break;
      case "24h":
        filterFrom = now - 24 * 60 * 60 * 1000;
        break;
      case "2d":
        filterFrom = now - 2 * 24 * 60 * 60 * 1000;
        break;
      case "3d":
        filterFrom = now - 3 * 24 * 60 * 60 * 1000;
        break;
      case "1w":
        filterFrom = now - 7 * 24 * 60 * 60 * 1000;
        break;
      default:
        filterFrom = 0;
    }

    const result: typeof groups = {};

    for (const [key, value] of Object.entries(groups)) {
      const filterData = value
        .filter((pair) => pair.last.ts >= filterFrom)
        .map((pair) => ({ ...pair, history: pair.history.filter(his=> his.ts >= filterFrom) }));
      result[key] = filterData;
    }

    return result;
  }, [groups, timeFilter]);

  const topPairs = useMemo(() => {
    return Object.values(filteredGroups)
      .flat()
      .sort(
        (a, b) =>
          (Number(a.suspended) || 0) - (Number(b.suspended) || 0) ||
          b.count - a.count,
      )
      .slice(0, topNumber);
  }, [filteredGroups, topNumber]);

  if (tabs.length === 0) {
    return (
      <div className="text-muted-foreground">
        No arbitrage opportunities yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="5m">Last 5m</SelectItem>
            <SelectItem value="15m">Last 15m</SelectItem>
            <SelectItem value="1h">Last 1h</SelectItem>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="2d">Last 2 day</SelectItem>
            <SelectItem value="3d">Last 3 day</SelectItem>
            <SelectItem value="1w">Last 1 week</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
            <ResultTable data={filteredGroups[t]} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
