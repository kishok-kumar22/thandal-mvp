import React from "react";
import Link from "next/link";
import { Calendar, Coins, Plus, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/format";
import type { Loan } from "@/data/mockCustomers";
import { LoanStatusChip } from "@/components/loans/LoanStatusChip";

interface ActiveLoanSummaryCardProps {
  loan?: Loan;
}

export function ActiveLoanSummaryCard({ loan }: ActiveLoanSummaryCardProps) {
  if (!loan) {
    return (
      <Card className="p-6 rounded-xl border border-[#E6ECF5] flex flex-col items-center justify-center text-center py-12">
        <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#64748B] flex items-center justify-center mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[#0B1B3F]">No active loan</h3>
        <p className="text-xs text-[#64748B] mt-1 mb-4">
          This customer has no active lending contract at present.
        </p>
        <Link href="/admin/loans/new">
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Create loan
          </Button>
        </Link>
      </Card>
    );
  }

  // Derive calculations from loan fields
  const totalAmount = loan.principal + loan.interest;
  const remainingAmount = Math.max(0, totalAmount - loan.paid);
  const calculatedInstalment =
    loan.term > 0 ? Math.round(totalAmount / loan.term) : loan.instalment;

  return (
    <Card className="p-6 rounded-xl border border-[#E6ECF5]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E6ECF5]">
        <h2 className="text-base font-bold text-[#0B1B3F]">Active loan summary</h2>
        <LoanStatusChip status={loan.status} />
      </div>

      {/* 2 Columns: Left (Financial numbers) and Right (Terms & Schedule) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Left Column */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#64748B]">Loan number</span>
            <span className="font-bold text-[#0B1B3F] font-mono text-sm">{loan.id}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#64748B]">Principal amount</span>
            <span className="font-semibold text-[#0B1B3F]">{formatINR(loan.principal)}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#64748B]">Total interest</span>
            <span className="font-semibold text-[#0B1B3F]">{formatINR(loan.interest)}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#64748B]">Total amount</span>
            <span className="font-bold text-[#0B1B3F] text-sm">{formatINR(totalAmount)}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#64748B]">Amount paid</span>
            <span className="font-semibold text-[#1F6BFF]">{formatINR(loan.paid)}</span>
          </div>

          <div className="flex justify-between items-center text-xs pt-1 border-t border-[#F1F5F9]">
            <span className="text-[#64748B]">Remaining amount</span>
            <span className="font-bold text-[#0B1B3F] text-sm">{formatINR(remainingAmount)}</span>
          </div>
        </div>

        {/* Vertical/Horizontal divider on desktop/mobile */}
        <div className="space-y-4 md:border-l md:border-[#E6ECF5] md:pl-6 pt-4 md:pt-0 border-t md:border-t-0 border-[#E6ECF5]">
          {/* Term */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50/70 text-[#1F6BFF] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-[#64748B] block">Term</span>
              <span className="text-xs font-semibold text-[#0B1B3F] block mt-0.5">
                {loan.term} daily instalments
              </span>
            </div>
          </div>

          {/* Instalment Amount */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50/70 text-[#1F6BFF] flex items-center justify-center shrink-0">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-[#64748B] block">Instalment amount</span>
              <span className="text-xs font-semibold text-[#0B1B3F] block mt-0.5">
                {formatINR(calculatedInstalment)} each
              </span>
            </div>
          </div>

          {/* Disbursed on */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50/70 text-[#1F6BFF] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-[#64748B] block">Disbursed on</span>
              <span className="text-xs font-semibold text-[#0B1B3F] block mt-0.5">
                {loan.disbursedOn}
              </span>
            </div>
          </div>

          {/* Next payment */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50/70 text-[#1F6BFF] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-[#64748B] block">Next payment</span>
              <span className="text-xs font-semibold text-[#0B1B3F] block mt-0.5">
                {loan.nextPaymentOn}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
