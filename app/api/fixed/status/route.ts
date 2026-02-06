import { shouldFixedRun } from '@/lib/engine/runtimeFixed';
import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    status: shouldFixedRun()? "Running" : "Stopped"
  };
  return NextResponse.json(data);
}
