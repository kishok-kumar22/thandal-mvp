import React from "react";
import Link from "next/link";
import type { Agent } from "@/data/mockAgents";
import { maskMobile } from "@/lib/mask";

interface AgentsTableProps {
  agents: Agent[];
}

export function AgentsTable({ agents }: AgentsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left border-collapse">
        <thead>
          <tr className="bg-[#F8FAFC] border-b border-[#E6ECF5]">
            <th
              scope="col"
              className="py-3.5 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider"
            >
              Agent ID
            </th>
            <th
              scope="col"
              className="py-3.5 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="py-3.5 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider"
            >
              Mobile
            </th>
            <th
              scope="col"
              className="py-3.5 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider"
            >
              Route
            </th>
            <th
              scope="col"
              className="py-3.5 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider text-center"
            >
              Assigned Customers
            </th>
            <th
              scope="col"
              className="py-3.5 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="py-3.5 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider text-right"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E6ECF5]">
          {agents.map((agent) => {
            const maskedPhone = maskMobile(agent.mobile, "agent");
            const isActive = agent.status.toLowerCase() === "active";

            return (
              <tr key={agent.id} className="hover:bg-[#F8FAFC]/60 transition-colors">
                <td className="py-4 px-4 text-sm font-semibold text-[#0B1B3F] whitespace-nowrap">
                  {agent.id}
                </td>
                <td className="py-4 px-4 text-sm font-semibold text-[#0B1B3F] whitespace-nowrap">
                  {agent.name}
                </td>
                <td className="py-4 px-4 text-sm font-medium text-[#334155] tabular-nums whitespace-nowrap font-mono text-xs">
                  {maskedPhone}
                </td>
                <td className="py-4 px-4 text-sm text-[#334155] whitespace-nowrap">
                  {agent.route}
                </td>
                <td className="py-4 px-4 text-sm font-semibold text-[#0B1B3F] text-center tabular-nums whitespace-nowrap">
                  {agent.assignedCustomers}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                      <span className="w-2 h-2 rounded-full bg-[#1F6BFF] shrink-0" aria-hidden="true" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                      <span className="w-2 h-2 rounded-full bg-[#94A3B8] shrink-0" aria-hidden="true" />
                      Inactive
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-right whitespace-nowrap">
                  <Link
                    href={`/admin/agents/${agent.id}`}
                    className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg border border-[#1F6BFF] text-[#1F6BFF] font-semibold text-xs hover:bg-[#1F6BFF]/5 active:bg-[#1F6BFF]/10 transition-colors cursor-pointer"
                  >
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
