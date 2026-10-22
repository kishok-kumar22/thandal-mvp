import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getMockLoans } from "@/data/mockLoans";
import { mockAgentsList } from "@/data/mockAgents";
import { LoanFilters } from "@/components/loans/list/LoanFilters";
import { LoansTable } from "@/components/loans/list/LoansTable";
import { LoanCard } from "@/components/loans/list/LoanCard";
import { LoanLegend } from "@/components/loans/list/LoanLegend";
import { LoanPagination } from "@/components/loans/list/LoanPagination";
import { EmptyState } from "@/components/ui/EmptyState";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    frequency?: string;
    agent?: string;
    page?: string;
  }>;
}

export default async function AdminLoansPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const q = (resolvedParams.q || "").trim().toLowerCase();
  const status = (resolvedParams.status || "All").toLowerCase();
  const frequency = (resolvedParams.frequency || "All").toLowerCase();
  const agent = resolvedParams.agent || "All";
  const currentPage = Math.max(1, parseInt(resolvedParams.page || "1", 10) || 1);

  const allLoans = getMockLoans();

  // Filter loans
  const filteredLoans = allLoans.filter((loan) => {
    // Search loan ID or customer name
    if (q) {
      const matchId = loan.id.toLowerCase().includes(q);
      const matchCustomer = loan.customerName.toLowerCase().includes(q);
      if (!matchId && !matchCustomer) return false;
    }

    // Status
    if (status !== "all" && loan.status.toLowerCase() !== status) {
      return false;
    }

    // Frequency
    if (frequency !== "all" && loan.frequency.toLowerCase() !== frequency) {
      return false;
    }

    // Agent
    if (agent !== "All" && loan.agent !== agent) {
      return false;
    }

    return true;
  });

  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(filteredLoans.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedLoans = filteredLoans.slice(startIndex, startIndex + PAGE_SIZE);

  // Available agent names for filter
  const agentNames = Array.from(new Set(mockAgentsList.map((a) => a.name)));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-[40px] font-bold text-[#0B1B3F] tracking-tight leading-tight">
            Loans
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            View and manage all loan accounts.
          </p>
        </div>

        <Link
          href="/admin/loans/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F6BFF] hover:bg-[#1A5CD6] text-white font-semibold text-sm shadow-sm transition-all w-full sm:w-auto text-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create loan
        </Link>
      </div>

      {/* Filter Card */}
      <LoanFilters agents={agentNames} />

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-[#E6ECF5] shadow-xs overflow-hidden">
        {filteredLoans.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No loans found"
              description="Try a different search or clear the filters."
              actionLabel="Clear filters"
              onAction={undefined}
            />
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <LoansTable loans={paginatedLoans} />
            </div>

            {/* Mobile Stacked Card View */}
            <div className="md:hidden p-4 space-y-3">
              {paginatedLoans.map((loan) => (
                <LoanCard key={loan.id} loan={loan} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer on Page Background */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <LoanLegend />
        <LoanPagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
