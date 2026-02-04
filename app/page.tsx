import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">
        Arbitrage Control Panel
      </h1>

      <div className="flex gap-4">
        <Link href="/dynamic">
          <Button>Dynamic Scan</Button>
        </Link>
        <Link href="/fixed">
          <Button variant="outline">Fixed Pairs</Button>
        </Link>
      </div>

      <p className="text-muted-foreground">
        Choose a mode to start scanning arbitrage opportunities.
      </p>
    </div>
  );
}
