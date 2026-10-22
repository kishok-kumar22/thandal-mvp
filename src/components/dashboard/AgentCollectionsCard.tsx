import React from "react";
import Link from "next/link";
import { Users, Wallet } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatINR } from "@/lib/format";
import type { AgentPerformance } from "@/data/mock";

interface AgentCollectionsCardProps {
  agents: AgentPerformance[];
  cashAwaitingHandover: number;
}

export function AgentCollectionsCard({
  agents,
  cashAwaitingHandover,
}: AgentCollectionsCardProps) {
  // Compute totals from agent data
  const totalCollected = agents.reduce((sum, agent) => sum + agent.collected, 0);
  const totalPending = agents.reduce((sum, agent) => sum + agent.pending, 0);

  return (
    <Card className="p-6 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-[#1F6BFF]" />
          <h3 className="font-bold text-[#0B1B3F] text-base">Agent collections</h3>
        </div>

        {/* Small Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#64748B] text-xs font-semibold border-y border-[#E6ECF5]">
                <th className="py-2 px-3">Agent</th>
                <th className="py-2 px-3">Collected</th>
                <th className="py-2 px-3 text-right">Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6ECF5]">
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-medium text-[#0B1B3F]">{agent.name}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#0B1B3F]">
                    {formatINR(agent.collected)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#64748B] font-medium">
                    {formatINR(agent.pending)}
                  </td>
                </tr>
              ))}
              {/* Total row with bold and grey background */}
              <tr className="bg-[#F8FAFC] font-bold text-[#0B1B3F] border-t-2 border-[#E6ECF5]">
                <td className="py-2.5 px-3">Total</td>
                <td className="py-2.5 px-3 font-bold">{formatINR(totalCollected)}</td>
                <td className="py-2.5 px-3 text-right font-bold">{formatINR(totalPending)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bordered sub-card: Cash awaiting handover */}
      <div className="mt-4 pt-4 border-t border-[#E6ECF5]">
        <div className="flex items-center justify-between p-3 rounded-lg border border-[#E6ECF5] bg-white hover:border-[#1F6BFF]/40 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-[#0B1B3F] shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#64748B] block">Cash awaiting handover</span>
              <span className="text-base font-bold text-[#0B1B3F] leading-tight block">
                {formatINR(cashAwaitingHandover)}
              </span>
            </div>
          </div>

          <Link
            href="/admin/cashbook/handovers"
            className="text-xs font-semibold text-[#1F6BFF] hover:underline inline-flex items-center gap-0.5"
          >
            Review &gt;
          </Link>
        </div>
      </div>
    </Card>
  );
}
