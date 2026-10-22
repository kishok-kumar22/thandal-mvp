"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { CustomerLoanView } from "@/lib/customerPortal";

interface LoanSelectProps {
  loans: CustomerLoanView[];
  currentLoanId: string;
}

export function LoanSelect({ loans, currentLoanId }: LoanSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (loans.length <= 1) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLoan = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("loan", selectedLoan);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative inline-block">
      <select
        value={currentLoanId}
        onChange={handleChange}
        aria-label="Select loan account"
        className="appearance-none h-11 pl-4 pr-10 rounded-xl bg-white border border-[#CBD5E1] text-sm font-semibold text-[#0B1B3F] hover:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF] cursor-pointer shadow-2xs"
      >
        {loans.map((loan) => (
          <option key={loan.id} value={loan.id}>
            {loan.id} - {loan.customerName} ({loan.frequency.toUpperCase()})
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}
