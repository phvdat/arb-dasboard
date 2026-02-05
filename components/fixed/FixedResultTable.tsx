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
import { ArbitrageResult } from '@/lib/store/type';
import { DetailModal } from '../common/DetailModal';

export function FixedResultTable({ data }: { data: ArbitrageResult[] }) {
  const [selected, setSelected] = useState<ArbitrageResult | null>(null);

  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pair</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Ratio %</TableHead>
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
              <TableCell>{r.last.ratio.toFixed(2)}</TableCell>
              <TableCell>{r.last.profit.toFixed(2)}</TableCell>
              <TableCell>
                {new Date(r.last.ts).toLocaleTimeString()}
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
        <DetailModal
          result={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
