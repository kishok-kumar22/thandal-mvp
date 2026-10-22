import React from "react";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import type { CustomerLoanView } from "@/lib/customerPortal";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatINR } from "@/lib/format";

interface ClosedLoansCardProps {
  closedLoans: CustomerLoanView[];
}

export function ClosedLoansCard({ closedLoans }: ClosedLoansCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E6ECF5] shadow-xs p-6 space-y-4">
      <h2 className="text-xl font-bold text-[#0B1B3F]">Closed Loans</h2>

      {closedLoans.length === 0 ? (
        <EmptyState
          title="No closed loans"
          description="You do not have any closed loans yet."
          icon={FileText}
          className="border-none bg-transparent py-10"
        />
      ) : (
        <div className="divide-y divide-[#EEF2F6]">
          {closedLoans.map((loan) => (
            <div
              key={loan.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EEF2F7] text-[#64748B] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#0B1B3F] text-base block">
                    {loan.id}
                  </span>
                  <span className="text-xs text-[#64748B]">
                    Principal: {formatINR(loan.overview.principal)} &bull; Total Paid: {formatINR(loan.overview.paid)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <span className="text-xs font-semibold text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-full">
                  Completed
                </span>
                <Link
                  href={`/customer/schedule?loan=${loan.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F6BFF] hover:underline"
                >
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
