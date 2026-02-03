'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';


export function FixedSettings({
  status,
  onStart,
  onStop,
  onClear,
}: {
  status: 'running' | 'stopped';
  onStart: () => void;
  onStop: () => void;
  onClear: () => void;
}) {
  const isRunning = status === 'running';

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Fixed Arbitrage</h1>

      <div className="flex items-center gap-2">
        <Badge variant={isRunning ? 'default' : 'secondary'}>
          {isRunning ? 'RUNNING' : 'STOPPED'}
        </Badge>

        <Button
          onClick={onStart}
          disabled={isRunning}
        >
          Start
        </Button>

        <Button
          onClick={onStop}
          variant="destructive"
          disabled={!isRunning}
        >
          Stop
        </Button>

        <Button
          onClick={onClear}
          variant="outline"
        >
          Clear Data
        </Button>
      </div>
    </div>
  );
}