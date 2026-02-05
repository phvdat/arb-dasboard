/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMetaSWR } from "@/swr/useMetaSWR";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const { data : session } = useSession();
  const { data: meta } = useMetaSWR();

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
