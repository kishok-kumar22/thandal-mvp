"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rowsPerPage?: number;
  onRowsPerPageChange?: (rows: number) => void;
  rowsPerPageOptions?: number[];
  className?: string;
  hideIfSinglePage?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50],
  className = "",
  hideIfSinglePage = false,
}: PaginationProps) {
  if (hideIfSinglePage && totalPages <= 1 && !rowsPerPage) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {rowsPerPage !== undefined && onRowsPerPageChange && (
        <div className="flex items-center gap-2 mr-2 text-xs text-[#64748B]">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            aria-label="Rows per page"
            className="h-8 border border-[#E2E8F0] rounded-lg bg-white px-2 text-xs font-semibold text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none cursor-pointer"
          >
            {rowsPerPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Prev button */}
      <button
        type="button"
        disabled={!hasPrev}
        onClick={() => hasPrev && onPageChange(currentPage - 1)}
        aria-label="Previous page"
        className={`w-8 h-8 rounded-lg flex items-center justify-center border border-[#E2E8F0] bg-white transition-colors ${
          hasPrev
            ? "text-[#334155] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] cursor-pointer"
            : "text-[#CBD5E1] bg-[#F8FAFC] cursor-not-allowed opacity-60"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((p) => {
          const isCurrent = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={isCurrent ? "page" : undefined}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isCurrent
                  ? "bg-[#1F6BFF] text-white shadow-sm"
                  : "bg-white text-[#475569] border border-[#E2E8F0] hover:bg-[#F8FAFC]"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <button
        type="button"
        disabled={!hasNext}
        onClick={() => hasNext && onPageChange(currentPage + 1)}
        aria-label="Next page"
        className={`w-8 h-8 rounded-lg flex items-center justify-center border border-[#E2E8F0] bg-white transition-colors ${
          hasNext
            ? "text-[#334155] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] cursor-pointer"
            : "text-[#CBD5E1] bg-[#F8FAFC] cursor-not-allowed opacity-60"
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
