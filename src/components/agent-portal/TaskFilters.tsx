"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, ChevronDown } from "lucide-react";

interface TaskFiltersProps {
  availableRoutes: string[];
}

export function TaskFilters({ availableRoutes }: TaskFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentQ = searchParams.get("q") || "";
  const currentRoute = searchParams.get("route") || availableRoutes[0] || "All routes";

  const [searchTerm, setSearchTerm] = useState(currentQ);

  useEffect(() => {
    setSearchTerm(currentQ);
  }, [currentQ]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== currentQ) {
        updateParams({ q: searchTerm });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, currentQ]);

  const updateParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (!v || v === "All routes") {
        params.delete(k);
      } else {
        params.set(k, v);
      }
    });

    startTransition(() => {
      router.replace(`/agent/customers?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="space-y-3 md:space-y-0 md:flex md:items-center md:gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none"
          aria-hidden="true"
        />
        <input
          id="task-search-input"
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search customers (name or ID)"
          className="w-full h-12 pl-10 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0B1B3F] placeholder-[#94A3B8] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 shadow-2xs transition-all"
        />
      </div>

      {/* Route Selector with MapPin */}
      <div className="relative md:w-64">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#0B1B3F]">
          <MapPin className="w-4 h-4" />
        </div>
        <select
          id="task-route-select"
          value={currentRoute}
          onChange={(e) => updateParams({ route: e.target.value })}
          className="w-full h-12 appearance-none rounded-xl border border-[#E2E8F0] bg-white pl-10 pr-9 text-sm font-semibold text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 shadow-2xs transition-all cursor-pointer"
        >
          {availableRoutes.map((r) => (
            <option key={r} value={r}>
              Route: {r}
            </option>
          ))}
          <option value="All routes">Route: All routes</option>
        </select>
        <ChevronDown
          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
