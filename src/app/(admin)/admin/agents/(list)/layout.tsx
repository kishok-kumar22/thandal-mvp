import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AgentsTabs } from "@/components/agents/AgentsTabs";

interface AgentsLayoutProps {
  children: React.ReactNode;
}

export default function AgentsListGroupLayout({ children }: AgentsLayoutProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-[40px] font-bold text-[#0B1B3F] tracking-tight leading-tight">
            Collection agents
          </h1>
        </div>

        <Link
          href="/admin/agents/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F6BFF] hover:bg-[#1A5CD6] text-white font-semibold text-sm shadow-sm transition-all w-full sm:w-auto text-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create agent
        </Link>
      </div>

      {/* Tabs */}
      <AgentsTabs />

      {/* Content */}
      {children}
    </div>
  );
}
