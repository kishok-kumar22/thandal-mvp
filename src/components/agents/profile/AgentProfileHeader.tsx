import React from "react";
import Link from "next/link";
import { User, Pencil } from "lucide-react";
import type { Agent } from "@/data/mockAgents";
import { Button } from "@/components/ui/Button";

interface AgentProfileHeaderProps {
  agent: Agent;
}

export function AgentProfileHeader({ agent }: AgentProfileHeaderProps) {
  const isActive = agent.status === "active";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Left: 88px Avatar + Name + Active Chip + Agent ID */}
      <div className="flex items-center gap-4 sm:gap-5">
        <div
          className="w-20 sm:w-[88px] h-20 sm:h-[88px] rounded-full bg-[#DCE8FB] text-[#1F6BFF] flex items-center justify-center font-bold text-3xl shrink-0 select-none shadow-2xs border border-[#DBEAFE]"
          aria-hidden="true"
        >
          <User className="w-10 sm:w-11 h-10 sm:h-11" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-[40px] font-bold text-[#0B1B3F] tracking-tight leading-tight">
              {agent.name}
            </h1>
            {isActive ? (
              <span className="bg-[#1F6BFF] text-white rounded-md font-semibold text-xs px-2.5 py-0.5">
                Active
              </span>
            ) : (
              <span className="bg-[#E2E8F0] text-[#64748B] rounded-md font-semibold text-xs px-2.5 py-0.5">
                Inactive
              </span>
            )}
          </div>
          <span className="text-sm font-semibold text-[#64748B] font-mono mt-0.5">
            {agent.id}
          </span>
        </div>
      </div>

      {/* Right: Edit agent button */}
      <div className="w-full sm:w-auto">
        <Link href={`/admin/agents/${agent.id}/edit`} className="w-full sm:w-auto block">
          <Button
            variant="outline"
            size="md"
            icon={<Pencil className="w-4 h-4" />}
            className="w-full sm:w-auto px-5"
          >
            Edit agent
          </Button>
        </Link>
      </div>
    </div>
  );
}
