"use client";

import React, { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Calendar, User, ChevronDown } from "lucide-react";
import { mockAgentsList } from "@/data/mockAgents";
import { todayIso, todayFormatted } from "@/lib/clock";

export function CashbookFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentDate = searchParams.get("date") || todayIso();
  const currentAgent = searchParams.get("agent") || "all";

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (newDate) {
      params.set("date", newDate);
    } else {
      params.delete("date");
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAgent = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (newAgent && newAgent !== "all") {
      params.set("agent", newAgent);
    } else {
      params.delete("agent");
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* 1. Styled Date Control */}
      <div className="relative inline-flex items-center bg-white border border-[#E6ECF5] rounded-xl px-3.5 py-2 shadow-xs hover:border-[#CBD5E1] transition-colors">
        <Calendar className="w-4 h-4 text-[#1F6BFF] mr-2 shrink-0 pointer-events-none" />
        <span className="text-sm font-semibold text-[#0B1B3F] mr-2 pointer-events-none">
          {currentDate === todayIso() ? todayFormatted() : currentDate}
        </span>
        <ChevronDown className="w-4 h-4 text-[#94A3B8] pointer-events-none" />
        <input
          type="date"
          aria-label="Filter by date"
          value={currentDate}
          onChange={handleDateChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>

      {/* 2. Styled Agent Select */}
      <div className="relative inline-flex items-center bg-white border border-[#E6ECF5] rounded-xl px-3.5 py-2 shadow-xs hover:border-[#CBD5E1] transition-colors">
        <User className="w-4 h-4 text-[#64748B] mr-2 shrink-0 pointer-events-none" />
        <select
          aria-label="Filter by agent"
          value={currentAgent}
          onChange={handleAgentChange}
          className="text-sm font-semibold text-[#0B1B3F] bg-transparent pr-6 focus:outline-none cursor-pointer appearance-none"
        >
          <option value="all">All agents</option>
          {mockAgentsList.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 pointer-events-none" />
      </div>
    </div>
  );
}
