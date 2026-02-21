"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TimeRangeSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentRange = searchParams.get("range") || "all";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <Select value={currentRange} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select range" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value={(5 * 60 * 1000).toString()}>Last 5m</SelectItem>
        <SelectItem value={(15 * 60 * 1000).toString()}>Last 15m</SelectItem>
        <SelectItem value={(60 * 60 * 1000).toString()}>Last 1h</SelectItem>
        <SelectItem value={(24 * 60 * 60 * 1000).toString()}>
          Last 24h
        </SelectItem>
        <SelectItem value={(2 * 24 * 60 * 60 * 1000).toString()}>
          Last 2 days
        </SelectItem>
        <SelectItem value={(3 * 24 * 60 * 60 * 1000).toString()}>
          Last 3 days
        </SelectItem>
        <SelectItem value={(7 * 24 * 60 * 60 * 1000).toString()}>
          Last 1 week
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
