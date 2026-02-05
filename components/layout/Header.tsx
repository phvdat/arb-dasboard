/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { signOut, useSession } from 'next-auth/react';

export function Header() {
  const { data } = useSession();
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/meta");
      setMeta(await res.json());
    };
    load();
  }, []);

  const status =
    meta?.status === "running"
      ? meta.runningMode === "dynamic"
        ? "Dynamic Running"
        : "Fixed Running"
      : "Idle";

  return (
    <header className="border-b px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-lg">
          Arbitrage Tool
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink href="/dynamic">Dynamic</NavLink>
          <NavLink href="/fixed">Fixed</NavLink>
        </nav>
      </div>

      <Badge variant={meta?.status === "running" ? "default" : "secondary"}>
        {status}
      </Badge>
    </header>
  );
}

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
      )}
    >
      {children}
    </Link>
  );
};
