import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DynamicResult } from './types';

export function ResultTable({ data }: { data: DynamicResult[] }) {
  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pair</TableHead>
          <TableHead>Count</TableHead>
          <TableHead>Spread %</TableHead>
          <TableHead>Profit</TableHead>
          <TableHead>Last Seen</TableHead>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
