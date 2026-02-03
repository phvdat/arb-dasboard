'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { FixedResult } from './types';
import { FixedDetailModal } from './FixedDetailModal';

export function FixedResultTable({ data }: { data: FixedResult[] }) {
  const [selected, setSelected] = useState<FixedResult | null>(null);

  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pair</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Spread %</TableHead>
            <TableHead>Profit</TableHead>
            <TableHead>Last Seen</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sorted.map((r) => (
            <TableRow key={`${r.pair}-${r.exchange1}`}>
              <TableCell>{r.pair}</TableCell>
              <TableCell className="font-bold">{r.count}</TableCell>
              <TableCell>{r.lastSpread.toFixed(2)}</TableCell>
              <TableCell>{r.lastProfit.toFixed(2)}</TableCell>
              <TableCell>
                {new Date(r.lastSeen).toLocaleTimeString()}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelected(r)}
                >
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selected && (
        <FixedDetailModal
          result={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
