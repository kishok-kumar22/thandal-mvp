import React from "react";
import Link from "next/link";
import {
  Calendar,
  CreditCard,
  Download,
  FileText,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/format";

export const metadata = {
  title: "Customer Portal | THANDAL",
  description: "Borrower self-service loans and repayment tracker",
};

export default function CustomerHomePage() {
  const activeLoan = {
    loanId: "LN-1052",
    product: "Daily Micro-Business Loan",
    principal: 10000,
    paidAmount: 6850,
    remainingAmount: 3150,
    dueToday: 105,
    dueDate: "22 Oct 2026",
    agentName: "Selvam",
    agentPhone: "+91 98400 12345",
    progressPercent: 68,
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-[#0B1B3F] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#38BDF8]">
            Customer Account
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Welcome back, R. Kumar</h1>
          <p className="text-xs sm:text-sm text-[#C7D2E8] mt-1 max-w-lg">
            Your active loan account is in good standing. Your next daily installment of{" "}
            <span className="text-white font-bold">{formatINR(activeLoan.dueToday)}</span> is due today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link href="/customer/payments">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Pay ₹105 Now
            </Button>
          </Link>
          <a href={`tel:${activeLoan.agentPhone}`}>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-transparent text-white border-white/40 hover:bg-white/10"
              icon={<Phone className="w-4 h-4" />}
            >
              Call Agent
            </Button>
          </a>
        </div>
      </div>

      {/* Loan Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 flex flex-col justify-between">
          <span className="text-xs font-medium text-[#64748B]">Active Loan Account</span>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#0B1B3F]">{activeLoan.loanId}</span>
            <p className="text-xs text-[#64748B] mt-0.5">{activeLoan.product}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E6ECF5] flex justify-between items-center text-xs">
            <span className="text-[#64748B]">Total Sanctioned</span>
            <span className="font-semibold text-[#0B1B3F]">{formatINR(activeLoan.principal)}</span>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <span className="text-xs font-medium text-[#64748B]">Repayment Progress</span>
          <div className="mt-2">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-2xl font-bold text-[#0B1B3F]">{activeLoan.progressPercent}%</span>
              <span className="text-xs text-[#64748B]">
                {formatINR(activeLoan.paidAmount)} / {formatINR(activeLoan.principal)}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#1F6BFF] h-full rounded-full transition-all duration-500"
                style={{ width: `${activeLoan.progressPercent}%` }}
              />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E6ECF5] flex justify-between items-center text-xs">
            <span className="text-[#64748B]">Remaining Balance</span>
            <span className="font-bold text-[#0B1B3F]">{formatINR(activeLoan.remainingAmount)}</span>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <span className="text-xs font-medium text-[#64748B]">Your Field Agent</span>
          <div className="mt-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#1F6BFF] flex items-center justify-center font-bold text-sm">
              S
            </div>
            <div>
              <span className="text-base font-bold text-[#0B1B3F] block leading-tight">
                {activeLoan.agentName}
              </span>
              <span className="text-xs text-[#64748B]">Assigned Field Officer</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E6ECF5] flex justify-between items-center text-xs">
            <span className="text-[#64748B]">Contact</span>
            <span className="font-semibold text-[#1F6BFF]">{activeLoan.agentPhone}</span>
          </div>
        </Card>
      </div>

      {/* Quick Links Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/customer/schedule" className="block group">
          <Card className="p-5 hover:border-[#1F6BFF]/40 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1F6BFF] flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0B1B3F] group-hover:text-[#1F6BFF] transition-colors">
                  Repayment Schedule
                </h2>
                <p className="text-xs text-[#64748B]">View daily installment calendar and dues</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#1F6BFF]">&gt;</span>
          </Card>
        </Link>

        <Link href="/customer/receipts" className="block group">
          <Card className="p-5 hover:border-[#1F6BFF]/40 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1F6BFF] flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0B1B3F] group-hover:text-[#1F6BFF] transition-colors">
                  Payment Receipts
                </h2>
                <p className="text-xs text-[#64748B]">Download PDF tax receipts for recent installments</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#1F6BFF]">&gt;</span>
          </Card>
        </Link>
      </div>
    </div>
  );
}
