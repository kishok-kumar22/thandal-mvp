import React from "react";
import Link from "next/link";
import type { CustomerLoanView, CustomerPaymentRow } from "@/lib/customerPortal";
import type { ScheduleRow } from "@/lib/schedule";
import { PageTabs } from "@/components/ui/PageTabs";
import { StatGrid, StatCell } from "@/components/ui/StatGrid";
import { LoanSelect } from "./LoanSelect";
import { CustomerScheduleTable } from "./CustomerScheduleTable";
import { PaymentsTable } from "./PaymentsTable";
import { PageFooterBar } from "@/components/ui/PageFooterBar";
import { DownloadStatementButton } from "./DownloadStatementButton";
import { HowDoIPayTrigger } from "./HowDoIPayTrigger";
import { BRAND_NAME, BRAND_TAGLINE } from "@/config/brand";
import { formatINR } from "@/lib/format";

interface LoanScheduleShellProps {
  currentLoan: CustomerLoanView;
  allLoans: CustomerLoanView[];
  scheduleRows: ScheduleRow[];
  payments: CustomerPaymentRow[];
  tab: "schedule" | "payments";
  currentPage: number;
  businessPhone?: string;
}

export function LoanScheduleShell({
  currentLoan,
  allLoans,
  scheduleRows,
  payments,
  tab,
  currentPage,
  businessPhone = "+91 98765 43210",
}: LoanScheduleShellProps) {
  const { overview } = currentLoan;

  // Tabs for the loan
  const tabs = [
    {
      label: "Schedule",
      href: `/customer/schedule?loan=${currentLoan.id}`,
    },
    {
      label: "Payments",
      href: `/customer/payments?loan=${currentLoan.id}`,
    },
  ];

  // Pagination for schedule
  const pageSize = 10;
  const paginatedScheduleRows = scheduleRows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Recent payments for schedule tab (latest 5)
  const recentPayments = payments.slice(0, 5);

  // Paginated payments for payments tab (page size 10)
  const paginatedPayments = payments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const isLoanClosed = ["completed", "closed"].includes(currentLoan.status);
  const isDisbursed = (currentLoan.status as string) !== "pending" && (currentLoan.status as string) !== "draft";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      {/* Top Header: Title and optional LoanSelect */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3F] tracking-tight">
            Loan schedule {currentLoan.id}
          </h1>
          <p className="text-sm font-medium text-[#64748B] mt-1">
            Complete repayment breakdown and recorded payment history.
          </p>
        </div>

        <LoanSelect loans={allLoans} currentLoanId={currentLoan.id} />
      </div>

      {/* Page Tabs */}
      <PageTabs tabs={tabs} />

      {/* SUMMARY CARD: 5 Cells */}
      <div className="space-y-1.5">
        <div className="bg-white rounded-2xl border border-[#E6ECF5] shadow-xs overflow-hidden p-2">
          <StatGrid columns={5}>
            <StatCell label="Principal" value={formatINR(overview.principal)} />
            <StatCell label="Interest" value={formatINR(overview.interest)} />
            <StatCell label="Total" value={formatINR(overview.total)} />
            <StatCell label="Paid" value={formatINR(overview.paid)} />
            <StatCell label="Remaining" value={formatINR(overview.remaining)} />
          </StatGrid>
        </div>

        {/* How do I pay trigger */}
        <HowDoIPayTrigger
          nextDue={overview.nextDue}
          agentFirstName={currentLoan.agentFirstName}
          businessPhone={businessPhone}
        />
      </div>

      {/* TAB 1: SCHEDULE */}
      {tab === "schedule" && (
        <div className="space-y-6">
          {/* Repayment Schedule Card */}
          <div className="bg-white rounded-2xl border border-[#E6ECF5] shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-[#EEF2F6] pb-4">
              <h2 className="text-xl font-bold text-[#0B1B3F]">
                Repayment schedule
              </h2>
              <span className="text-xs font-semibold text-[#64748B]">
                {overview.paidCount} of {overview.term} paid
              </span>
            </div>

            <CustomerScheduleTable
              rows={paginatedScheduleRows}
              totalRows={scheduleRows.length}
              currentPage={currentPage}
              pageSize={pageSize}
            />
          </div>

          {/* Recent Payment History Card */}
          <div className="bg-white rounded-2xl border border-[#E6ECF5] shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-[#EEF2F6] pb-4">
              <h2 className="text-xl font-bold text-[#0B1B3F]">
                Recent payment history
              </h2>
            </div>

            <PaymentsTable
              payments={recentPayments}
              totalPayments={payments.length}
              isRecentPreview={true}
              loanId={currentLoan.id}
            />
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENTS */}
      {tab === "payments" && (
        <div className="bg-white rounded-2xl border border-[#E6ECF5] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-[#EEF2F6] pb-4">
            <h2 className="text-xl font-bold text-[#0B1B3F]">
              Payment history
            </h2>
            <span className="text-xs font-semibold text-[#64748B]">
              Total payments: {payments.length}
            </span>
          </div>

          <PaymentsTable
            payments={paginatedPayments}
            totalPayments={payments.length}
            currentPage={currentPage}
            pageSize={pageSize}
            isRecentPreview={false}
            loanId={currentLoan.id}
          />
        </div>
      )}

      {/* STICKY FOOTER BAR */}
      {!isLoanClosed && isDisbursed && (
        <PageFooterBar
          left={
            <div className="hidden sm:flex items-center gap-2.5">
              <span className="font-extrabold text-[#0B1B3F] tracking-wide text-base">
                {BRAND_NAME}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-[#64748B] font-medium">
                {BRAND_TAGLINE}
              </span>
            </div>
          }
          right={
            <DownloadStatementButton
              loanId={currentLoan.id}
              variant="primary"
              showArrow={true}
              label="Download statement"
              ariaLabel={`Download statement for ${currentLoan.id}`}
              className="w-full sm:w-auto px-6 h-11"
            />
          }
        />
      )}
    </div>
  );
}
