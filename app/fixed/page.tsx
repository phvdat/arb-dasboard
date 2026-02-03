/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { FixedTabs } from '@/components/fixed/FixedTabs';
import { FixedSettings } from '@/components/fixed/FixedSettings';

export default function FixedPage() {
  const [data, setData] = useState<any>(null);

  const fetchStatus = async () => {
    const res = await fetch('/api/fixed/status');
    setData(await res.json());
  };

  useEffect(() => {
    fetchStatus();
    console.log('data', data);
    
    const i = setInterval(fetchStatus, 3000);
    return () => clearInterval(i);
  }, []);

  const start = async () => {
    await fetch('/api/fixed/start', { method: 'POST' });
    fetchStatus();
  };

  const stop = async () => {
    await fetch('/api/fixed/stop', { method: 'POST' });
    fetchStatus();
  };

  const clear = async () => {
    await fetch('/api/fixed/clear', { method: 'POST' });
    fetchStatus();
  };

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <FixedSettings
        status={data.status}
        onStart={start}
        onStop={stop}
        onClear={clear}
      />

      <FixedTabs results={data.results || {}} />
    </div>
  );
}
