import { updateSuspendedStatus } from "@/lib/store/dynamicStore";

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const body = await req.json();
  const suspended =Boolean(body.suspended);
  
  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  updateSuspendedStatus({
    pair: id.split('|')[0],
    exchange1: id.split('|')[1],
    exchange2: id.split('|')[2],
  }, suspended);
  return Response.json({ ok: true });
}

