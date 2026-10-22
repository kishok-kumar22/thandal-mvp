"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { AuditEntry } from "@/data/mockAudit";
import { AuditFilters } from "./AuditFilters";
import { AuditTable } from "./AuditTable";
import { ExportAuditButton } from "./ExportAuditButton";
import { Pagination } from "@/components/ui/Pagination";

interface AuditLogTabClientProps {
  entries: AuditEntry[];
  distinctUsers: { id: string; label: string }[];
  currentPage: number;
}

const PAGE_SIZE = 25;

export function AuditLogTabClient({
  entries,
  distinctUsers,
  currentPage,
}: AuditLogTabClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pageEntries = entries.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("page", String(newPage));
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 sm:p-6 shadow-sm space-y-5">
      {/* Top Header Row with Export CSV Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#0B1B3F]">Audit log</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Immutable, append-only record of all critical system actions.
          </p>
        </div>

        <div>
          <ExportAuditButton entries={entries} />
        </div>
      </div>

      {/* Filter Bar */}
      <AuditFilters distinctUsers={distinctUsers} />

      {/* Audit Table */}
      <AuditTable entries={pageEntries} />

      {/* Pagination & Count footer */}
      {entries.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#F1F5F9]">
          <span className="text-xs text-[#64748B]">
            Showing <span className="font-semibold text-[#0B1B3F]">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-[#0B1B3F]">
              {Math.min(startIndex + PAGE_SIZE, entries.length)}
            </span>{" "}
            of <span className="font-semibold text-[#0B1B3F]">{entries.length}</span> entries
          </span>

          {totalPages > 1 && (
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  );
}
