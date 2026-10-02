
import { NextResponse } from 'next/server';
import { addFixedPair } from '@/lib/store/fixedStore';
import { getFixedPairs, removeFixedPair } from '@/lib/store/fixedStore';

export async function GET() {
  return Response.json(await getFixedPairs());
}

export async function POST(req: Request) {
  const body = await req.json();
  const { pair, exchange1, exchange2 } = body;

  if (!pair || !exchange1 || !exchange2) {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  }

  const success = await addFixedPair({ pair, exchange1, exchange2 });
  if (!success) {
    return NextResponse.json({ message: 'Pair already exists' }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  const parts = id.split('|');
  const [pair, exchange1, exchange2] = parts.length === 4 ? [parts[1], parts[2], parts[3]] : [parts[0], parts[1], parts[2]];

  await removeFixedPair({
    pair,
    exchange1,
    exchange2,
  });
  return Response.json({ ok: true });
}
