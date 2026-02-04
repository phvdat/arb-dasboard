/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { FixedTabs } from '@/components/fixed/FixedTabs';
import { FixedSettings } from '@/components/fixed/FixedSettings';
import Loading from '@/components/common/Loading';

export default function FixedPage() {
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    const res = await fetch('/api/fixed/status');
    setData(await res.json());
  };

  useEffect(() => {
    fetchData();    
    const i = setInterval(fetchData, 3000);
    return () => clearInterval(i);
  }, []);


  if (!data) return <Loading />

  return (
    <div className="p-6 space-y-6">
      <FixedSettings />
      <FixedTabs results={data.results || {}} />
    </div>
  );
}
