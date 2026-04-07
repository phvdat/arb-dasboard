"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { endpoint } from "@/config/endpoint";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_EXCHANGES } from "@/constants/commons";

export function FilterDynamic() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedExchanges, setSelectedExchanges] =
    useState<string[]>(DEFAULT_EXCHANGES);

  const [minPriceRatio, setMinPriceRatio] = useState("1.006");

  const currentRange = searchParams.get("range") || "all";

  const updateParams = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) params.set(key, value);
    else params.delete(key);

    router.push(`?${params.toString()}`);
  };

  const toggleExchange = (ex: string) => {
    let next;

    if (selectedExchanges.includes(ex)) {
      next = selectedExchanges.filter(e => e !== ex);
    } else {
      next = [...selectedExchanges, ex];
    }

    setSelectedExchanges(next);
    updateParams("exchanges", next.join(","));
  };

  const handleRatioChange = (value: string) => {
    setMinPriceRatio(value);
    updateParams("minPriceRatio", value);
  };

  const handleRangeChange = (value: string) => {
    updateParams("range", value);
  };

  useEffect(() => {
    const load = async () => {
      const res = await fetch(endpoint.dynamic.config);
      const json = await res.json();

      if (json.config) {
        setSelectedExchanges(json.config.exchanges);
        setMinPriceRatio(String(json.config.minPriceRatio));

        updateParams(
          "exchanges",
          json.config.exchanges.join(","),
        );

        updateParams(
          "minPriceRatio",
          String(json.config.minPriceRatio),
        );
      }
    };

    load();
  }, []);

  return (
    <div className="flex flex-wrap gap-3 items-center">

      {/* range */}
      <select
        value={currentRange}
        onChange={(e) => handleRangeChange(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="all">All</option>
        <option value={(5 * 60 * 1000).toString()}>Last 5m</option>
        <option value={(15 * 60 * 1000).toString()}>Last 15m</option>
        <option value={(60 * 60 * 1000).toString()}>Last 1h</option>
        <option value={(24 * 60 * 60 * 1000).toString()}>Last 24h</option>
        <option value={(2 * 24 * 60 * 60 * 1000).toString()}>
          Last 2d
        </option>
        <option value={(3 * 24 * 60 * 60 * 1000).toString()}>
          Last 3d
        </option>
        <option value={(7 * 24 * 60 * 60 * 1000).toString()}>
          Last 1w
        </option>
      </select>

      {/* ratio */}
      <Input
        className="w-[120px]"
        placeholder="min ratio"
        value={minPriceRatio}
        onChange={(e) => handleRatioChange(e.target.value)}
      />

      {/* exchanges multi select */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="min-w-[220px] justify-start"
          >
            {selectedExchanges.length === 0
              ? "Exchange"
              : selectedExchanges.join(", ")}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[220px] p-0">
          <Command>

            <CommandInput placeholder="Search exchange..." />

            <CommandEmpty>No exchange found</CommandEmpty>

            <CommandGroup>

              {DEFAULT_EXCHANGES.map((ex) => (
                <CommandItem
                  key={ex}
                  onSelect={() => toggleExchange(ex)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedExchanges.includes(ex)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />

                  {ex}

                </CommandItem>
              ))}

            </CommandGroup>

          </Command>
        </PopoverContent>
      </Popover>

    </div>
  );
}