import React from "react";
import Link from "next/link";
import { User } from "lucide-react";

interface AgentCardProps {
  agentFirstName?: string;
}

export function AgentCard({ agentFirstName }: AgentCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E6ECF5] p-5 sm:p-6 shadow-xs flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0 text-[#64748B]">
          <User className="w-6 h-6 text-[#64748B]" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <span className="block text-xs font-semibold text-[#64748B]">
            Assigned Agent
          </span>
          <span className="block text-lg sm:text-xl font-bold text-[#0B1B3F] truncate mt-0.5">
            {agentFirstName || "No agent assigned yet"}
          </span>
        </div>
      </div>

      {agentFirstName && (
        <Link
          href="/customer/contact-agent"
          className="h-11 px-5 rounded-xl bg-[#1F6BFF] hover:bg-[#1A5BD8] text-white font-semibold text-sm transition-colors flex items-center justify-center shrink-0 shadow-xs cursor-pointer"
        >
          Contact agent
        </Link>
      )}
    </div>
  );
}
