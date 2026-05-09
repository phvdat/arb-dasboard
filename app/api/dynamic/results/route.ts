import { getDynamicResults } from '@/lib/db/dynamicDb';
import { ArbitrageTable } from '@/types/common';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const range = searchParams.get('range') || 'all';
  const minPriceRatio = Number(searchParams.get('minPriceRatio')) || 1;
  const exchangesParam = searchParams.get('exchanges') || '';
  const exchanges = exchangesParam.split(',').map((s) => s.trim()).filter(Boolean);

  const rows = getDynamicResults({ range, minPriceRatio, exchanges });

  const results = rows.reduce<Record<string, ArbitrageTable>>((acc, row) => {
    acc[row.id] = {
      pair: row.pair,
      exchange1: row.exchange1,
      exchange2: row.exchange2,
      count: row.count,
      suspended: row.suspended === 1,
      last: {
        ratio: row.ratio!,
        profit: row.profit!,
        ts: row.ts!,
        quantity: row.quantity!,
        direction: row.direction!,
      },
    };
    return acc;
  }, {});

  return NextResponse.json(results);
}
