/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { DynamicTabs } from '@/components/dynamic/DynamicTabs';

export default function DynamicPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/dynamic/status');
      setData(await res.json());
    };

    load();
    const i = setInterval(load, 3000);
    return () => clearInterval(i);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dynamic Arbitrage</h1>
      <DynamicTabs results={data.results || {}} />
    </div>
  );
}
