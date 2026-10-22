"use client";

import React, { useTransition, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import { mockAgentsList } from "@/data/mockAgents";

export function CollectionFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchVal, setSearchVal] = useState(searchParams.get("q") || "");
  const currentAgent = searchParams.get("agent") || "all";

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);

    const params = new URLSearchParams(searchParams.toString());
    if (val.trim()) {
      params.set("q", val.trim());
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") {
      params.set("agent", val);
    } else {
      params.delete("agent");
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Search Input Box */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchVal}
          onChange={handleSearchChange}
          placeholder="Search customer (name or loan number)..."
          className="w-full h-11 pl-10 pr-4 bg-white border border-[#E6ECF5] rounded-xl text-sm font-medium text-[#0B1B3F] placeholder-[#94A3B8] focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20 shadow-xs"
        />
      </div>

      {/* Plain Agent Select with visually hidden label */}
      <div className="relative sm:w-[280px]">
        <label htmlFor="agent-filter-select" className="sr-only">
          Agent
        </label>
        <select
          id="agent-filter-select"
          value={currentAgent}
          onChange={handleAgentChange}
          className="w-full h-11 pl-4 pr-10 bg-white border border-[#E6ECF5] rounded-xl text-sm font-semibold text-[#0B1B3F] focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20 shadow-xs appearance-none cursor-pointer"
        >
          <option value="all">All Agents</option>
          {mockAgentsList.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
