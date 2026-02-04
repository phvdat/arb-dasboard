'use client';

import { useEffect, useState } from 'react';

export default function Loading({ delay = 100 }: { delay?: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!visible) return null;

  return (
    <div className="flex h-32 items-center justify-center">
      <div className="animate-spin h-6 w-6 rounded-full border-2 border-muted-foreground border-t-transparent" />
    </div>
  );
}
