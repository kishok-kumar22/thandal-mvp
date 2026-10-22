import React from "react";
import Link from "next/link";
import { User, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StickyActionBar } from "@/components/customers/StickyActionBar";

interface ProfileActionBarProps {
  name: string;
  customerId: string;
}

export function ProfileActionBar({ name, customerId }: ProfileActionBarProps) {
  return (
    <StickyActionBar
      left={
        <div className="hidden sm:flex items-center gap-2.5 text-xs">
          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[#64748B]">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-[#0B1B3F]">{name}</span>
          <span className="text-[#94A3B8] font-mono">{customerId}</span>
        </div>
      }
      right={
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
      }
    />
  );
}
