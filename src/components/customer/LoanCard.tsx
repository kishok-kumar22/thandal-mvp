import React from "react";
import Link from "next/link";
import { FileText, Calendar } from "lucide-react";
import type { CustomerLoanView } from "@/lib/customerPortal";
import { LoanStatusChip } from "@/components/loans/LoanStatusChip";
import { StatGrid, StatCell } from "@/components/ui/StatGrid";
import { formatINR } from "@/lib/format";
import { getInstalmentLabel } from "@/config/customerLabels";
import { DownloadStatementButton } from "./DownloadStatementButton";

interface LoanCardProps {
  loan: CustomerLoanView;
}

export function LoanCard({ loan }: LoanCardProps) {
  const { overview } = loan;
  const instalmentLabel = getInstalmentLabel(loan.frequency);

  return (
    <div className="bg-white rounded-2xl border border-[#E6ECF5] shadow-xs overflow-hidden p-6 space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full bg-[#E8F0FE] text-[#1F6BFF] flex items-center justify-center shrink-0 shadow-2xs">
            <FileText className="w-8 h-8" />
          </div>
          <div className="min-w-0">
            <Link
              href={`/customer/schedule?loan=${loan.id}`}
              className="text-2xl sm:text-[28px] font-bold text-[#0B1B3F] hover:text-[#1F6BFF] transition-colors tracking-tight block truncate"
            >
              Loan No. {loan.id}
            </Link>
            <p className="text-sm font-medium text-[#64748B] mt-0.5">
              {loan.customerName}
            </p>
          </div>
        </div>

        <div className="shrink-0 self-start sm:self-center">
          <LoanStatusChip status={loan.status} />
        </div>
      </div>

      {/* 3 Stat Rows with Thin Dividing Hairlines */}
      <div className="space-y-4">
        {/* Row 1: 5 Columns */}
        <StatGrid columns={5}>
          <StatCell label="Principal Amount" value={formatINR(overview.principal)} />
          <StatCell label="Interest Amount" value={formatINR(overview.interest)} />
          <StatCell label="Total Amount" value={formatINR(overview.total)} />
          <StatCell label="Amount Paid" value={formatINR(overview.paid)} />
          <StatCell label="Remaining Amount" value={formatINR(overview.remaining)} />
        </StatGrid>

        {/* Row 2: 3 Columns */}
        <StatGrid columns={3}>
          <StatCell label={instalmentLabel} value={formatINR(overview.instalment)} />
          <StatCell label="Total Instalments" value={overview.term} />
          <StatCell label="Interest Type" value={overview.interestType} />
        </StatGrid>

        {/* Row 3: 5 Columns */}
        <StatGrid columns={5}>
          <StatCell label="Disbursement Date" value={loan.disbursedOn} />
          <StatCell label="Net Cash Disbursed" value={formatINR(overview.netCashDisbursed)} />
          <StatCell label={overview.firstInstalmentLabel} value={overview.firstInstalmentDate} />
          <StatCell
            label="Next Due Date"
            value={
              overview.nextDue ? (
                <div className="flex items-center gap-2">
                  <span>{overview.nextDue.dueOn}</span>
                  {overview.nextDue.isOverdue && (
                    <span className="text-[11px] font-bold text-[#DC2626] bg-[#FEE2E2] px-1.5 py-0.5 rounded">
                      Overdue
                    </span>
                  )}
                </div>
              ) : (
                "-"
              )
            }
          />
          <StatCell
            label="Next Due Amount"
            value={overview.nextDue ? formatINR(overview.nextDue.amount) : "-"}
            caption={overview.nextDue?.isPartial ? <span className="text-amber-600 font-semibold">Part paid</span> : undefined}
          />
        </StatGrid>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
        <Link
          href={`/customer/schedule?loan=${loan.id}`}
          className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-[#1F6BFF] hover:bg-[#1A5BD8] text-white font-semibold text-sm transition-colors shadow-xs cursor-pointer"
        >
          <Calendar className="w-4 h-4 shrink-0" />
          <span>View Schedule</span>
        </Link>

        <DownloadStatementButton loanId={loan.id} />
      </div>
    </div>
  );
}
