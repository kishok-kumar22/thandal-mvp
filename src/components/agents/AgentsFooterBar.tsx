"use client";

import React, { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/ui/Pagination";

interface AgentsFooterBarProps {
  totalCount: number;
  startIndex: number;
  endIndex: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
}

export function AgentsFooterBar({
  totalCount,
  startIndex,
  endIndex,
  currentPage,
  totalPages,
  perPage,
}: AgentsFooterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    startTransition(() => {
      router.replace(`/admin/agents?${params.toString()}`, { scroll: false });
    });
  };

  const handlePerPageChange = (newPerPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("perPage", String(newPerPage));
    params.set("page", "1");
    startTransition(() => {
      router.replace(`/admin/agents?${params.toString()}`, { scroll: false });
    });
  };

  const showingText =
    totalCount <= perPage
      ? `Showing ${totalCount} ${totalCount === 1 ? "agent" : "agents"}`
      : `Showing ${startIndex + 1}-${endIndex} of ${totalCount} agents`;

  return (
    <div
      className="sticky bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E6ECF5] py-3 px-4 sm:px-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3"
      style={{
        bottom: "var(--bottom-nav-h, 0px)",
      }}
    >
      <div className="text-xs font-medium text-[#64748B]">{showingText}</div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        rowsPerPage={perPage}
        onRowsPerPageChange={handlePerPageChange}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </div>
  );
}
