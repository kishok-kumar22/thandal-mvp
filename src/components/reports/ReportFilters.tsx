"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DateRangePicker } from "./DateRangePicker";

interface AgentOption {
  id: string;
  name: string;
  branch: string;
}

interface ReportFiltersProps {
  branches: string[];
  agents: AgentOption[];
}

export function ReportFilters({ branches, agents }: ReportFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL params
  const urlFrom = searchParams.get("from") || "2026-10-21";
  const urlTo = searchParams.get("to") || "2026-10-22";
  const urlBranch = searchParams.get("branch") || "all";
  const urlAgent = searchParams.get("agent") || "all";

  // Staged state
  const [stagedFrom, setStagedFrom] = useState(urlFrom);
  const [stagedTo, setStagedTo] = useState(urlTo);
  const [stagedBranch, setStagedBranch] = useState(urlBranch);
  const [stagedAgent, setStagedAgent] = useState(urlAgent);

  // Sync if URL changes
  useEffect(() => {
    setStagedFrom(urlFrom);
    setStagedTo(urlTo);
    setStagedBranch(urlBranch);
    setStagedAgent(urlAgent);
  }, [urlFrom, urlTo, urlBranch, urlAgent]);

  // Check if staged differs from URL
  const isDirty =
    stagedFrom !== urlFrom ||
    stagedTo !== urlTo ||
    stagedBranch !== urlBranch ||
    stagedAgent !== urlAgent;

  // Filter agents by chosen branch
  const filteredAgents =
    stagedBranch && stagedBranch !== "all"
      ? agents.filter((a) => a.branch === stagedBranch)
      : agents;

  const handleBranchChange = (newBranch: string) => {
    setStagedBranch(newBranch);
    // Reset agent when branch changes
    setStagedAgent("all");
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams.toString());
    next.set("from", stagedFrom);
    next.set("to", stagedTo);

    if (stagedBranch && stagedBranch !== "all") next.set("branch", stagedBranch);
    else next.delete("branch");

    if (stagedAgent && stagedAgent !== "all") next.set("agent", stagedAgent);
    else next.delete("agent");

    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <form
      onSubmit={handleApply}
      className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-sm space-y-3"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_auto] gap-4 items-end">
        {/* Date Range Picker */}
        <div>
          <label
            htmlFor="report-date-range"
            className="block text-xs font-bold text-[#0B1B3F] uppercase tracking-wider mb-1.5"
          >
            Date range
          </label>
          <DateRangePicker
            from={stagedFrom}
            to={stagedTo}
            onChange={(f, t) => {
              setStagedFrom(f);
              setStagedTo(t);
            }}
          />
        </div>

        {/* Branch select */}
        <div>
          <label
            htmlFor="report-branch"
            className="block text-xs font-bold text-[#0B1B3F] uppercase tracking-wider mb-1.5"
          >
            Branch
          </label>
          <select
            id="report-branch"
            value={stagedBranch}
            onChange={(e) => handleBranchChange(e.target.value)}
            className="w-full h-11 px-3 bg-white border border-[#D9E1EC] rounded-xl text-xs sm:text-sm font-semibold text-[#0B1B3F] focus:outline-none focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20 cursor-pointer"
          >
            <option value="all">All</option>
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Agent select */}
        <div>
          <label
            htmlFor="report-agent"
            className="block text-xs font-bold text-[#0B1B3F] uppercase tracking-wider mb-1.5"
          >
            Agent
          </label>
          <select
            id="report-agent"
            value={stagedAgent}
            onChange={(e) => setStagedAgent(e.target.value)}
            className="w-full h-11 px-3 bg-white border border-[#D9E1EC] rounded-xl text-xs sm:text-sm font-semibold text-[#0B1B3F] focus:outline-none focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20 cursor-pointer"
          >
            <option value="all">All</option>
            {filteredAgents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Apply Button */}
        <div>
          <button
            type="submit"
            className="w-full sm:w-auto h-11 px-6 bg-[#1F6BFF] hover:bg-[#1A5CD6] text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Dirty indicator hint */}
      {isDirty && (
        <div className="text-[11px] text-[#1F6BFF] font-semibold flex items-center gap-1.5 pt-1">
          <span className="w-2 h-2 rounded-full bg-[#1F6BFF] animate-pulse" />
          <span>Filters changed. Press Apply to reload report data.</span>
        </div>
      )}
    </form>
  );
}
