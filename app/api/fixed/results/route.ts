import { getFixedResults } from '@/lib/db/fixedDb';
import { NextResponse } from 'next/server';

export async function GET() {
  const rows = getFixedResults();

  const result = Object.fromEntries(
    rows.map((row) => [
      row.id,
      {
        pair: row.pair,
        exchange1: row.exchange1,
        exchange2: row.exchange2,
        count: row.count,
        suspended: row.suspended === 1,
        last: {
          ratio: row.ratio,
          profit: row.profit,
          ts: row.ts,
          quantity: row.quantity,
          direction: row.direction,
        },
      },
    ])
  );

  return NextResponse.json(result);
}
