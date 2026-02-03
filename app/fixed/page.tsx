/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Table, TableRow, TableCell, TableHead, TableHeader, TableBody } from '@/components/ui/table';

export default function FixedPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/fixed/status');
      setData(await res.json());
    };
    load();
    const i = setInterval(load, 3000);
    return () => clearInterval(i);
  }, []);

  if (!data) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Fixed Arbitrage</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pair</TableHead>
            <TableHead>Ex1</TableHead>
            <TableHead>Ex2</TableHead>
            <TableHead>Profit</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.latest.map((r: any, i: number) => (
            <TableRow key={i}>
              <TableCell>{r.pair}</TableCell>
              <TableCell>{r.exchange1}</TableCell>
              <TableCell>{r.exchange2}</TableCell>
              <TableCell>{r.profit.toFixed(2)}</TableCell>
              <TableCell>{r.qty.toFixed(2)}</TableCell>
              <TableCell>{new Date(r.ts).toLocaleTimeString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
