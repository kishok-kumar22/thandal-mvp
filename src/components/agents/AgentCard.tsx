import React from "react";
import Link from "next/link";
import type { Agent } from "@/data/mockAgents";
import { maskMobile } from "@/lib/mask";

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const maskedPhone = maskMobile(agent.mobile, "agent");
  const isActive = agent.status.toLowerCase() === "active";

  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] p-4 space-y-3.5 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#0B1B3F] text-base">{agent.name}</span>
          <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-[#EEF2F7] text-[#475569] font-mono">
            {agent.id}
          </span>
        </div>
        {isActive ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F6BFF] shrink-0" aria-hidden="true" />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] shrink-0" aria-hidden="true" />
            Inactive
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-[#64748B] block">Mobile</span>
          <span className="font-mono text-[#0B1B3F] font-semibold">{maskedPhone}</span>
        </div>
        <div>
          <span className="text-[#64748B] block">Route</span>
          <span className="text-[#0B1B3F] font-semibold">{agent.route}</span>
        </div>
        <div className="col-span-2 pt-1 border-t border-[#F1F5F9]">
          <span className="text-[#64748B]">Assigned: </span>
          <span className="font-bold text-[#0B1B3F]">{agent.assignedCustomers} customers</span>
        </div>
      </div>

      <Link
        href={`/admin/agents/${agent.id}`}
        className="w-full h-9 flex items-center justify-center rounded-lg border border-[#1F6BFF] text-[#1F6BFF] font-semibold text-xs hover:bg-[#1F6BFF]/5 active:bg-[#1F6BFF]/10 transition-colors"
      >
        View
      </Link>
    </div>
  );
}
