"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { ScheduleRow } from "@/lib/schedule";
import { StatusChip } from "@/components/ui/StatusChip";
import { Pagination } from "@/components/ui/Pagination";
import { ScheduleCard } from "./ScheduleCard";
import { formatNumberIN } from "@/lib/format";

interface CustomerScheduleTableProps {
  rows: ScheduleRow[];
  totalRows: number;
  currentPage: number;
  pageSize?: number;
  today?: string;
}

export function CustomerScheduleTable({
  rows,
  totalRows,
  currentPage,
  pageSize = 10,
  today = "2026-10-22",
}: CustomerScheduleTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalRows / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalRows);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-4">
      {/* Mobile Stacked Cards (<768px) */}
      <div className="md:hidden space-y-3">
        {rows.map((row) => (
          <ScheduleCard key={row.instalmentNumber} row={row} isToday={row.dueDateIso === today} />
        ))}
      </div>

      {/* Desktop Responsive Table (>=768px) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[#E6ECF5]">
        <table className="w-full min-w-[760px] text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E6ECF5] text-xs font-semibold text-[#64748B]">
              <th scope="col" className="py-3 px-4 w-14">#</th>
              <th scope="col" className="py-3 px-4">Due date</th>
              <th scope="col" className="py-3 px-4 text-right">Principal (₹)</th>
              <th scope="col" className="py-3 px-4 text-right">Interest (₹)</th>
              <th scope="col" className="py-3 px-4 text-right">Due amount (₹)</th>
              <th scope="col" className="py-3 px-4 text-right">Paid amount (₹)</th>
              <th scope="col" className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF2F6] text-sm text-[#0B1B3F] bg-white">
            {rows.map((row) => {
              const isToday = row.dueDateIso === today;
              return (
                <tr
                  key={row.instalmentNumber}
                  aria-current={isToday ? "date" : undefined}
                  className={`transition-colors ${
                    isToday ? "bg-[#F8FAFF] font-semibold" : "hover:bg-[#F8FAFC]"
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-[#64748B] text-xs tabular-nums">
                    {row.instalmentNumber}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <span>{row.dueDate}</span>
                      {isToday && (
                        <span className="text-[10px] uppercase font-bold text-[#1F6BFF] bg-[#EFF6FF] px-1.5 py-0.5 rounded">
                          Today
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-[#334155]">
                    {formatNumberIN(row.principal)}
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums text-[#334155]">
                    {formatNumberIN(row.interest)}
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums font-bold text-[#0B1B3F]">
                    {formatNumberIN(row.dueAmount)}
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums font-bold text-[#1F6BFF]">
                    {formatNumberIN(row.paidAmount)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusChip status={row.status} detailed />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 px-1">
        <span className="text-xs text-[#64748B] font-medium">
          Showing {totalRows > 0 ? `${startItem}-${endItem}` : "0"} of {totalRows}
        </span>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
