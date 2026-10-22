"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FrequencyChip } from "@/components/ui/FrequencyChip";
import { Button } from "@/components/ui/Button";
import { useAssignments } from "./AssignmentsContext";
import { formatINR } from "@/lib/format";
import { todayIso } from "@/lib/clock";

interface AssignedCustomersCardProps {
  agentId: string;
  totalCount: number;
  onFocusAssign: () => void;
}

export function AssignedCustomersCard({
  agentId,
  totalCount,
  onFocusAssign,
}: AssignedCustomersCardProps) {
  const { stagedList, committedList } = useAssignments();

  const allItems = [...stagedList, ...committedList];
  const currentDate = todayIso();

  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#E6ECF5] flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-[#0B1B3F]">Assigned customers</h2>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onFocusAssign}
          icon={<Plus className="w-4 h-4" />}
          className="px-3 text-xs"
        >
          Assign customers
        </Button>
      </div>

      {/* Table */}
      {allItems.length === 0 ? (
        <div className="p-8 text-center text-sm text-[#64748B]">
          No customers assigned yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E6ECF5]">
                <th scope="col" className="py-3 px-4 text-xs font-semibold text-[#64748B]">
                  Customer name
                </th>
                <th scope="col" className="py-3 px-4 text-xs font-semibold text-[#64748B]">
                  Loan No.
                </th>
                <th scope="col" className="py-3 px-4 text-xs font-semibold text-[#64748B]">
                  Area
                </th>
                <th scope="col" className="py-3 px-4 text-xs font-semibold text-[#64748B]">
                  Amount
                </th>
                <th scope="col" className="py-3 px-4 text-xs font-semibold text-[#64748B]">
                  Frequency
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6ECF5]">
              {allItems.map((item) => {
                const isFuture = item.effectiveDate > currentDate;

                return (
                  <tr
                    key={item.customerId}
                    className={`hover:bg-[#F8FAFC]/60 transition-colors ${
                      item.isStaged ? "bg-[#FFFBEB]/40" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 text-sm font-semibold text-[#0B1B3F] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/customers/${item.customerId}`}
                          className="hover:text-[#1F6BFF] hover:underline"
                        >
                          {item.customerName}
                        </Link>
                        {item.isStaged && (
                          <span className="bg-[#FEF3C7] text-[#B45309] text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Pending
                          </span>
                        )}
                      </div>
                      {isFuture && (
                        <span className="block text-[11px] text-[#94A3B8] font-normal">
                          Starts {item.effectiveDate}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-sm font-medium text-[#0B1B3F] whitespace-nowrap">
                      <Link
                        href={`/admin/loans/${item.loanNo}`}
                        className="hover:text-[#1F6BFF] hover:underline"
                      >
                        {item.loanNo}
                      </Link>
                    </td>

                    <td className="py-3.5 px-4 text-sm text-[#334155] whitespace-nowrap">
                      {item.area}
                    </td>

                    <td className="py-3.5 px-4 text-sm font-semibold text-[#0B1B3F] tabular-nums whitespace-nowrap">
                      {formatINR(item.amount)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <FrequencyChip frequency={item.frequency} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer line */}
      <div className="p-3.5 bg-[#F8FAFC] border-t border-[#E6ECF5] flex items-center justify-between text-xs text-[#64748B]">
        <span>
          Showing {allItems.length} of {Math.max(totalCount, allItems.length)} customers
        </span>
        <Link
          href={`/admin/agents/${agentId}/customers`}
          className="font-semibold text-[#1F6BFF] hover:underline"
        >
          View all
        </Link>
      </div>
    </div>
  );
}
