"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { FilterSelect, type FilterOption } from "@/components/ui/FilterSelect";

interface ReceiptFiltersProps {
  initialSearch?: string;
  initialLoan?: string;
  loanOptions: FilterOption[];
}

export function ReceiptFilters({
  initialSearch = "",
  initialLoan = "all",
  loanOptions,
}: ReceiptFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedLoan, setSelectedLoan] = useState(initialLoan);
  const [, startTransition] = useTransition();

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
    setSelectedLoan(searchParams.get("loan") || "all");
  }, [searchParams]);

  // Debounced search update
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get("q") || "";
      if (searchTerm.trim() !== currentQ) {
        const nextParams = new URLSearchParams(searchParams.toString());
        if (searchTerm.trim()) {
          nextParams.set("q", searchTerm.trim());
        } else {
          nextParams.delete("q");
        }
        nextParams.delete("page");
        startTransition(() => {
          router.push(`${pathname}?${nextParams.toString()}`);
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchParams, pathname, router]);

  const handleLoanChange = (val: string) => {
    setSelectedLoan(val);
    const nextParams = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") {
      nextParams.set("loan", val);
    } else {
      nextParams.delete("loan");
    }
    nextParams.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${nextParams.toString()}`);
    });
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedLoan("all");
    router.push(pathname);
  };

  const hasActiveFilters = Boolean(searchTerm.trim() || (selectedLoan && selectedLoan !== "all"));

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Search Input Box */}
      <div className="relative flex-1">
        <Search className="w-5 h-5 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search receipt or loan..."
          aria-label="Search receipts by receipt number or loan number"
          className="w-full h-12 pl-11 pr-9 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0B1B3F] placeholder-[#94A3B8] font-medium hover:border-[#94A3B8] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 shadow-2xs transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            aria-label="Clear search text"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#94A3B8] hover:text-[#0B1B3F] rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Loan Filter Select */}
      <div className="w-full sm:w-56 shrink-0">
        <FilterSelect
          label="Loan"
          value={selectedLoan}
          options={loanOptions}
          onChange={handleLoanChange}
        />
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleClear}
          className="text-xs font-semibold text-[#1F6BFF] hover:underline self-center sm:self-auto px-2 py-1"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
