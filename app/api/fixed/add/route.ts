import { NextResponse } from 'next/server';
import { addFixedPair } from '@/lib/store/fixedStore';

export async function POST(req: Request) {
  const body = await req.json();
  const { pair, exchange1, exchange2 } = body;

  if (!pair || !exchange1 || !exchange2) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  addFixedPair({ pair, exchange1, exchange2 });
  return NextResponse.json({ ok: true });
}
