"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { FilterSelect } from "@/components/ui/FilterSelect";

interface AgentFiltersProps {
  routes: string[];
}

export function AgentFilters({ routes }: AgentFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentQ = searchParams.get("q") || "";
  const currentStatus = searchParams.get("status") || "All statuses";
  const currentRoute = searchParams.get("route") || "All routes";

  const [searchTerm, setSearchTerm] = useState(currentQ);

  useEffect(() => {
    setSearchTerm(currentQ);
  }, [currentQ]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== currentQ) {
        updateParams({ q: searchTerm, page: "1" });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, currentQ]);

  const updateParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (!val || val === "All statuses" || val === "All routes") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    startTransition(() => {
      router.replace(`/admin/agents?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-xs mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] gap-4 items-center">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="agent-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search agent by name or ID..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0B1B3F] placeholder-[#94A3B8] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all"
          />
        </div>

        {/* Status Filter */}
        <FilterSelect
          label="Status"
          value={currentStatus}
          options={["All statuses", "Active", "Inactive"]}
          onChange={(val) => updateParams({ status: val, page: "1" })}
        />

        {/* Route Filter */}
        <FilterSelect
          label="Route"
          value={currentRoute}
          options={["All routes", ...routes]}
          onChange={(val) => updateParams({ route: val, page: "1" })}
        />
      </div>
    </div>
  );
}
