/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

export function Header() {
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/meta');
      setMeta(await res.json());
    };
    load();
    const i = setInterval(load, 3000);
    return () => clearInterval(i);
  }, []);

  const status =
    meta?.status === 'running'
      ? meta.runningMode === 'dynamic'
        ? 'Dynamic Running'
        : 'Fixed Running'
      : 'Idle';

  return (
    <header className="border-b px-6 py-3 flex items-center justify-between">
      <div className="flex gap-6 items-center">
        <Link href="/" className="font-bold text-lg">
          Arbitrage Tool
        </Link>
        <Link href="/dynamic">Dynamic</Link>
        <Link href="/fixed">Fixed</Link>
      </div>

      <Badge
        variant={
          meta?.status === 'running' ? 'default' : 'secondary'
        }
      >
        {status}
      </Badge>
    </header>
  );
}
