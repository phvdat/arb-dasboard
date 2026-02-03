'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResultTable } from './ResultTable';
import { groupResultsByExchange } from '@/lib/utils/groupResults';
import { DynamicResult } from './types';

type Props = {
  results: Record<string, DynamicResult>;
};

export function DynamicTabs({ results }: Props) {
  const groups = groupResultsByExchange(results);
  const tabs = Object.keys(groups);

  if (tabs.length === 0) {
    return (
      <div className="text-muted-foreground">
        No arbitrage opportunities yet
      </div>
    );
  }

  return (
    <Tabs defaultValue={tabs[0]}>
      <TabsList>
        {tabs.map((t) => (
          <TabsTrigger key={t} value={t}>
            {t}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((t) => (
        <TabsContent key={t} value={t}>
          <ResultTable data={groups[t]} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
