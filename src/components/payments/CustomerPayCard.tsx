import React from "react";
import Link from "next/link";
import { User } from "lucide-react";

interface CustomerPayCardProps {
  customerId: string;
  customerName: string;
  loanId: string;
  role?: "admin" | "agent";
}

export function CustomerPayCard({
  customerId,
  customerName,
  loanId,
  role = "admin",
}: CustomerPayCardProps) {
  const customerHref = role === "admin" ? `/admin/customers/${customerId}` : "#";
  const loanHref = role === "admin" ? `/admin/loans/${loanId}` : "#";

  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] p-4 sm:p-5 shadow-xs flex items-center gap-4">
      <div
        className="w-16 h-16 rounded-full bg-[#DCE8FB] text-[#1F6BFF] flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        <User className="w-8 h-8" />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0B1B3F] tracking-tight truncate">
          {role === "admin" ? (
            <Link href={customerHref} className="hover:text-[#1F6BFF] transition-colors">
              {customerName}
            </Link>
          ) : (
            customerName
          )}
        </h2>

        <p className="text-sm font-medium text-[#64748B] font-mono mt-0.5">
          {role === "admin" ? (
            <Link href={loanHref} className="hover:text-[#1F6BFF] transition-colors">
              {loanId}
            </Link>
          ) : (
            loanId
          )}
        </p>
      </div>
    </div>
  );
}
