/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMetaSWR } from "@/swr/useMetaSWR";
import { ChartNoAxesCombined, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../common/ModeToggle";
import { Button } from "../ui/button";

export function Header() {
  const { data: meta } = useMetaSWR();

  const status =
    meta?.status === "running"
      ? meta.runningMode === "dynamic"
        ? "Dynamic"
        : "Fixed"
      : "Idle";

  return (
    <header className="border-b px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-lg hidden md:block">
          Arbitrage Tool
        </Link>

        <Link href="/" className="font-bold text-lg md:hidden">
          <ChartNoAxesCombined />
        </Link>

        <nav className="flex items-center">
          <NavLink href="/dynamic">Dynamic</NavLink>
          <NavLink href="/fixed">Fixed</NavLink>
        </nav>
      </div>
      <div className="flex gap-2 md:gap-4 items-center">
        <Badge variant={meta?.status === "running" ? "default" : "secondary"}>
          {status}
        </Badge>
        <ModeToggle/>
        <Button onClick={()=>signOut()}>
          <LogOut />
        </Button>
      </div>
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
        "px-1 py-1 rounded-md text-sm font-medium transition-colors",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
      )}
    >
      {children}
    </Link>
  );
};
