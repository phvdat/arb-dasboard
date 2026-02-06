import { shouldDynamicRun } from '@/lib/engine/runtimeDynamic';
import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    status: shouldDynamicRun()? "Running" : "Stopped"
  };
  return NextResponse.json(data);
}
