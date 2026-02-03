import { NextResponse } from 'next/server';
import { removeFixedPair } from '@/lib/store/fixedStore';

export async function POST(req: Request) {
  const { pair, exchange1, exchange2 } = await req.json();

  if (!pair || !exchange1 || !exchange2) {
    return NextResponse.json(
      { error: 'Missing params' },
      { status: 400 }
    );
  }

  removeFixedPair({ pair, exchange1, exchange2 });

  return NextResponse.json({ ok: true });
}
