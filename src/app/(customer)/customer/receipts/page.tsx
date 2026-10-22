import React from "react";
import Link from "next/link";
import { ArrowLeft, Receipt as ReceiptIcon, SearchX } from "lucide-react";
import { requireRole } from "@/lib/session";
import { getMyReceipts, getMyLoans } from "@/lib/customerPortal";
import { ReceiptListCard } from "@/components/customer/ReceiptListCard";
import { ReceiptFilters } from "@/components/customer/ReceiptFilters";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import type { FilterOption } from "@/components/ui/FilterSelect";

export const metadata = {
  title: "Receipts | THANDAL",
  description: "View and download your official THANDAL loan payment receipts.",
};

export const instant = false;

interface ReceiptsPageProps {
  searchParams?: Promise<{
    q?: string;
    loan?: string;
    page?: string;
  }>;
}

export default async function CustomerReceiptsPage(props: ReceiptsPageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const user = await requireRole("customer", "/customer/receipts");

  const pageNum = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const myLoans = await getMyLoans(user);

  // Build loan filter options: "All loans" plus customer's own loans
  const loanOptions: FilterOption[] = [
    { value: "all", label: "All loans" },
    ...myLoans.map((l) => ({ value: l.id, label: l.id })),
  ];

  const { receipts, total, totalPages } = await getMyReceipts(user, {
    q: searchParams.q,
    loanId: searchParams.loan,
    page: pageNum,
    pageSize: 10,
  });

  const hasFilterActive = Boolean(searchParams.q || (searchParams.loan && searchParams.loan !== "all"));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Row: on mobile, arrow-left to /customer/home */}
      <div className="flex items-center gap-3">
        <Link
          href="/customer/home"
          aria-label="Back to home"
          className="md:hidden p-2 -ml-2 rounded-xl text-[#0B1B3F] hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3F] tracking-tight">
            Receipts
          </h1>
          <p className="text-sm font-medium text-[#64748B] mt-0.5">
            View and download your loan receipts.
          </p>
        </div>
      </div>

      {/* Filter Controls (Search + Loan Filter) */}
      <ReceiptFilters
        initialSearch={searchParams.q || ""}
        initialLoan={searchParams.loan || (myLoans.length === 1 ? myLoans[0].id : "all")}
        loanOptions={loanOptions}
      />

      {/* Content Grid */}
      {receipts.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {receipts.map((rc) => (
              <ReceiptListCard key={rc.receiptNo} receipt={rc} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination
                currentPage={pageNum}
                totalPages={totalPages}
                onPageChange={() => {}}
              />
            </div>
          )}
        </div>
      ) : hasFilterActive ? (
        <EmptyState
          title="No receipts found"
          description="Try a different search, or clear the filters."
          icon={SearchX}
          className="bg-white p-12 border border-[#E6ECF5] shadow-xs"
          action={
            <Link
              href="/customer/receipts"
              className="mt-3 inline-flex items-center justify-center px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#0B1B3F] hover:bg-slate-50 transition-colors"
            >
              Clear filters
            </Link>
          }
        />
      ) : (
        <EmptyState
          title="No receipts yet"
          description="Receipts appear here after a payment is recorded."
          icon={ReceiptIcon}
          className="bg-white p-12 border border-[#E6ECF5] shadow-xs"
        />
      )}
    </div>
  );
}
