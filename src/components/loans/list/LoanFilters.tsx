"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { LabeledFilterSelect } from "@/components/ui/LabeledFilterSelect";

interface LoanFiltersProps {
  agents: string[];
}

export function LoanFilters({ agents }: LoanFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentQ = searchParams.get("q") || "";
  const currentStatus = searchParams.get("status") || "All";
  const currentFrequency = searchParams.get("frequency") || "All";
  const currentAgent = searchParams.get("agent") || "All";

  const [searchTerm, setSearchTerm] = useState(currentQ);

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchTerm(currentQ);
  }, [currentQ]);

  // Debounced search
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
      if (!val || val === "All") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    startTransition(() => {
      router.replace(`/admin/loans?${params.toString()}`, { scroll: false });
    });
  };

  const handleStatusChange = (val: string) => {
    updateParams({ status: val, page: "1" });
  };

  const handleFrequencyChange = (val: string) => {
    updateParams({ frequency: val, page: "1" });
  };

  const handleAgentChange = (val: string) => {
    updateParams({ agent: val, page: "1" });
  };

  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-xs mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2.2fr_1fr_1fr_1fr] gap-4 items-end">
        {/* Search */}
        <div className="flex flex-col">
          <label
            htmlFor="loan-search-input"
            className="text-xs font-semibold text-[#0B1B3F] mb-1.5"
          >
            Search loan or customer
          </label>
          <div className="relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="loan-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by loan ID or customer name..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0B1B3F] placeholder-[#94A3B8] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all"
            />
          </div>
        </div>

        {/* Status */}
        <LabeledFilterSelect
          label="Status"
          value={currentStatus}
          options={["All", "Active", "Pending", "Overdue", "Completed", "Closed"]}
          onChange={handleStatusChange}
        />

        {/* Frequency */}
        <LabeledFilterSelect
          label="Frequency"
          value={currentFrequency}
          options={["All", "Daily", "Weekly", "Monthly"]}
          onChange={handleFrequencyChange}
        />

        {/* Agent */}
        <LabeledFilterSelect
          label="Agent"
          value={currentAgent}
          options={["All", ...agents]}
          onChange={handleAgentChange}
        />
      </div>
    </div>
  );
}
