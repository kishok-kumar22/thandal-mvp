"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { formatDateTime24 } from "@/lib/dates";
import { formatActor } from "@/lib/audit";
import { AUDIT_ACTION_LABELS, type AuditEntry } from "@/data/mockAudit";
import { AuditDetailsView } from "./AuditLinkifier";
import { EmptyState } from "@/components/ui/EmptyState";

interface AuditTableProps {
  entries: AuditEntry[];
  showClearFiltersButton?: boolean;
}

export function AuditTable({ entries, showClearFiltersButton = true }: AuditTableProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (entries.length === 0) {
    return (
      <div className="py-8">
        <EmptyState
          title="No audit entries match these filters"
          description="Try broadening your filter criteria or date range to inspect audit history."
          action={
            showClearFiltersButton ? (
              <button
                type="button"
                onClick={() => router.replace(pathname)}
                className="mt-3 px-4 py-2 text-xs font-semibold text-[#1F6BFF] hover:bg-[#EAF1FE] rounded-lg transition-colors cursor-pointer border border-[#C9DBFB]"
              >
                Clear filters
              </button>
            ) : undefined
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop & Tablet Table (≥768px) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[#D9E1EC]">
        <table className="w-full text-left text-xs border-collapse min-w-[720px]">
          <thead>
            <tr className="bg-[#ECF0F6] text-[#0B1B3F] font-bold border-b border-[#D9E1EC]">
              <th scope="col" className="py-3 px-4 font-bold text-[#0B1B3F]">Date & time</th>
              <th scope="col" className="py-3 px-4 font-bold text-[#0B1B3F]">Action</th>
              <th scope="col" className="py-3 px-4 font-bold text-[#0B1B3F]">Details</th>
              <th scope="col" className="py-3 px-4 font-bold text-[#0B1B3F]">User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] bg-white">
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-medium text-[#0B1B3F] whitespace-nowrap">
                  {formatDateTime24(entry.at)}
                </td>
                <td className="py-3 px-4 font-semibold text-[#0B1B3F] whitespace-nowrap">
                  {AUDIT_ACTION_LABELS[entry.action] || entry.action}
                </td>
                <td className="py-3 px-4 text-[#334155] leading-relaxed">
                  <AuditDetailsView details={entry.details} />
                </td>
                <td className="py-3 px-4 font-medium text-[#475569] whitespace-nowrap">
                  {formatActor(entry)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Cards (<768px) */}
      <div className="md:hidden space-y-2.5">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="p-3.5 bg-white border border-[#E6ECF5] rounded-xl shadow-xs space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0B1B3F]">
                {AUDIT_ACTION_LABELS[entry.action] || entry.action}
              </span>
              <span className="text-[11px] font-medium text-[#64748B]">
                {formatDateTime24(entry.at)}
              </span>
            </div>
            <div className="text-[#334155] text-xs leading-relaxed">
              <AuditDetailsView details={entry.details} />
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#F1F5F9] text-[11px] text-[#64748B]">
              <span>Actor</span>
              <span className="font-semibold text-[#0B1B3F]">{formatActor(entry)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
