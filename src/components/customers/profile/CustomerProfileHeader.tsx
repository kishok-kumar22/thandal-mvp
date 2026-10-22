import React from "react";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CustomerProfileHeaderProps {
  name: string;
  customerId: string;
  initials?: string;
}

export function CustomerProfileHeader({
  name,
  customerId,
  initials = "RK",
}: CustomerProfileHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Left: 76px Avatar + Name + ID Chip */}
      <div className="flex items-center gap-4 sm:gap-5">
        <div
          className="w-16 sm:w-[76px] h-16 sm:h-[76px] rounded-full bg-[#DCE8FB] text-[#1F6BFF] flex items-center justify-center font-bold text-xl sm:text-2xl shrink-0 select-none shadow-xs border border-[#DBEAFE]"
          aria-hidden="true"
        >
          {initials}
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B1B3F] tracking-tight leading-tight">
              {name}
            </h1>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[#EEF2F7] text-[#475569] font-mono">
              {customerId}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions (Full-width side by side on mobile) */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Link href={`/admin/customers/${customerId}/edit`} className="w-1/2 sm:w-auto">
          <Button
            variant="outline"
            size="md"
            icon={<Pencil className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Edit customer
          </Button>
        </Link>

        <Link href={`/admin/loans/new?customerId=${customerId}`} className="w-1/2 sm:w-auto">
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Create loan
          </Button>
        </Link>
      </div>
    </div>
  );
}
