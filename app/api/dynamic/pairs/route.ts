import { updateSuspendedStatus } from "@/lib/store/dynamicStore";

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const body = await req.json();
  const suspended = Boolean(body.suspended);
  
  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  const parts = id.split('|');
  const [pair, exchange1, exchange2] = parts.length === 4 ? [parts[1], parts[2], parts[3]] : [parts[0], parts[1], parts[2]];

  await updateSuspendedStatus({
    pair,
    exchange1,
    exchange2,
  }, suspended);
  return Response.json({ ok: true });
}
