'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FixedResult } from './types';
import { groupResultsByExchange } from '@/lib/utils/groupResults';
import { FixedResultTable } from './FixedResultTable';

export function FixedTabs({
  results,
}: {
  results: Record<string, FixedResult>;
}) {
  const groups = groupResultsByExchange(results);
  const tabs = Object.keys(groups);

  if (tabs.length === 0) {
    return (
      <div className="text-muted-foreground">
        No fixed results yet
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
          <FixedResultTable data={groups[t]} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
