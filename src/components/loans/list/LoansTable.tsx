import React from "react";
import Link from "next/link";
import type { LoanItem } from "@/data/mockLoans";
import { LoanStatusChip } from "../LoanStatusChip";
import { formatNumberIN } from "@/lib/format";

interface LoansTableProps {
  loans: LoanItem[];
}

export function LoansTable({ loans }: LoansTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] text-left border-collapse">
        <thead>
          <tr className="bg-[#F8FAFC] border-b border-[#E6ECF5]">
            <th
              scope="col"
              className="py-3.5 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider"
            >
              Loan ID
            </th>
            <th
              scope="col"
              className="py-3.5 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider"
            >
              Customer Name
            </th>
            <th
              scope="col"
              className="py-3.5 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider text-right"
            >
              Principal (₹)
            </th>
            <th
              scope="col"
              className="py-3.5 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider text-right"
            >
              Interest (₹)
            </th>
            <th
              scope="col"
              className="py-3.5 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider text-right"
            >
              Remaining (₹)
            </th>
            <th
              scope="col"
              className="py-3.5 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider"
            >
              Frequency
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
          {loans.map((loan) => {
            const capFrequency =
              loan.frequency.charAt(0).toUpperCase() + loan.frequency.slice(1);

            return (
              <tr key={loan.id} className="hover:bg-[#F8FAFC]/60 transition-colors">
                <td className="py-4 px-4 text-sm font-semibold text-[#0B1B3F] whitespace-nowrap">
                  {loan.id}
                </td>
                <td className="py-4 px-4 text-sm font-semibold text-[#0B1B3F] whitespace-nowrap">
                  {loan.customerName}
                </td>
                <td className="py-4 px-4 text-sm font-medium text-[#0B1B3F] text-right tabular-nums whitespace-nowrap">
                  {formatNumberIN(loan.principal)}
                </td>
                <td className="py-4 px-4 text-sm font-medium text-[#0B1B3F] text-right tabular-nums whitespace-nowrap">
                  {formatNumberIN(loan.interest)}
                </td>
                <td className="py-4 px-4 text-sm font-medium text-[#0B1B3F] text-right tabular-nums whitespace-nowrap">
                  {formatNumberIN(loan.remaining)}
                </td>
                <td className="py-4 px-4 text-sm text-[#334155] whitespace-nowrap">
                  {capFrequency}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <LoanStatusChip status={loan.status} />
                </td>
                <td className="py-4 px-4 text-right whitespace-nowrap">
                  <Link
                    href={`/admin/loans/${loan.id}`}
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
