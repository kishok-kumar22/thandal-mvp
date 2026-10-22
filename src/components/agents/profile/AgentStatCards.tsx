import React from "react";
import { Users, Database, Upload, Wallet } from "lucide-react";
import type { Agent } from "@/data/mockAgents";
import { getAgentCashStats } from "@/lib/agents";
import { formatINR } from "@/lib/format";

interface AgentStatCardsProps {
  agent: Agent;
}

export function AgentStatCards({ agent }: AgentStatCardsProps) {
  const cashStats = getAgentCashStats(agent.id);

  const stats = [
    {
      icon: Users,
      value: String(agent.assignedCustomers),
      label: "Customers",
    },
    {
      icon: Database,
      value: formatINR(cashStats.cashCollected),
      label: "Cash collected",
    },
    {
      icon: Upload,
      value: formatINR(cashStats.handedOver),
      label: "Handed over",
    },
    {
      icon: Wallet,
      value: formatINR(cashStats.cashInHand),
      label: "Cash in hand",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-xs flex items-center gap-4.5"
          >
            <div className="w-14 h-14 rounded-full bg-[#E8F0FE] text-[#1F6BFF] flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6" />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-2xl sm:text-[30px] font-bold text-[#0B1B3F] tracking-tight leading-none tabular-nums truncate">
                {s.value}
              </span>
              <span className="text-xs font-medium text-[#64748B] mt-1.5 truncate">
                {s.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
