import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getLoanById, mockLoansList } from "@/data/mockLoans";
import { LoanStatusChip } from "@/components/loans/LoanStatusChip";
import { formatNumberIN } from "@/lib/format";

interface PageProps {
  params: Promise<{ loanId: string }>;
}

export function generateStaticParams() {
  return mockLoansList.map((l) => ({ loanId: l.id }));
}

export default async function LoanDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const loanId = resolvedParams.loanId;
  const loan = getLoanById(loanId) || mockLoansList[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/loans"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F6BFF] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Loans
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#E6ECF5] p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E6ECF5]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#0B1B3F]">{loan.id}</h1>
              <LoanStatusChip status={loan.status} />
            </div>
            <p className="text-sm text-[#64748B] mt-1">
              Customer:{" "}
              <Link
                href={`/admin/customers/${loan.customerId}`}
                className="font-semibold text-[#1F6BFF] hover:underline"
              >
                {loan.customerName} ({loan.customerId})
              </Link>
            </p>
          </div>

          <div className="text-sm text-[#64748B]">
            Disbursed: <span className="font-semibold text-[#0B1B3F]">{loan.disbursedOn}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#EEF2F6]">
            <span className="text-xs text-[#64748B] block">Principal</span>
            <span className="text-xl font-bold text-[#0B1B3F] tabular-nums">
              ₹{formatNumberIN(loan.principal)}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#EEF2F6]">
            <span className="text-xs text-[#64748B] block">Total Interest</span>
            <span className="text-xl font-bold text-[#0B1B3F] tabular-nums">
              ₹{formatNumberIN(loan.interest)}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#EEF2F6]">
            <span className="text-xs text-[#64748B] block">Remaining Balance</span>
            <span className="text-xl font-bold text-[#0B1B3F] tabular-nums">
              ₹{formatNumberIN(loan.remaining)}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#EEF2F6]">
            <span className="text-xs text-[#64748B] block">Instalment Amount</span>
            <span className="text-xl font-bold text-[#0B1B3F] tabular-nums">
              ₹{formatNumberIN(loan.instalment)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E6ECF5] text-sm">
          <div>
            <span className="text-[#64748B] block text-xs">Frequency</span>
            <span className="font-semibold text-[#0B1B3F] capitalize">{loan.frequency}</span>
          </div>
          <div>
            <span className="text-[#64748B] block text-xs">Collection Agent</span>
            <span className="font-semibold text-[#0B1B3F]">{loan.agent}</span>
          </div>
          <div>
            <span className="text-[#64748B] block text-xs">First Due Date</span>
            <span className="font-semibold text-[#0B1B3F]">{loan.firstDueDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
