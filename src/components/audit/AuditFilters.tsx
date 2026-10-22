"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AUDIT_ACTION_LABELS, type AuditAction } from "@/data/mockAudit";

interface AuditFiltersProps {
  distinctUsers: { id: string; label: string }[];
}

export function AuditFilters({ distinctUsers }: AuditFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentUser = searchParams.get("user") || "all";
  const currentAction = searchParams.get("action") || "all";
  const currentRange = searchParams.get("range") || "all";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  const updateParam = (key: string, val: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") {
      next.set(key, val);
    } else {
      next.delete(key);
    }
    // Reset page to 1 on filter change
    next.delete("page");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const handleRangeChange = (val: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") {
      next.set("range", val);
    } else {
      next.delete("range");
    }
    if (val !== "custom") {
      next.delete("from");
      next.delete("to");
    } else {
      if (!from) next.set("from", "2026-10-21");
      if (!to) next.set("to", "2026-10-22");
    }
    next.delete("page");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* User filter */}
        <div>
          <label
            htmlFor="audit-filter-user"
            className="block text-xs font-semibold text-[#64748B] mb-1.5"
          >
            User
          </label>
          <select
            id="audit-filter-user"
            value={currentUser}
            onChange={(e) => updateParam("user", e.target.value)}
            className="w-full h-10 px-3 text-sm text-[#0B1B3F] font-medium bg-white rounded-xl border border-[#D9E1EC] focus:outline-none focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20 cursor-pointer"
          >
            <option value="all">All users</option>
            {distinctUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action filter */}
        <div>
          <label
            htmlFor="audit-filter-action"
            className="block text-xs font-semibold text-[#64748B] mb-1.5"
          >
            Action
          </label>
          <select
            id="audit-filter-action"
            value={currentAction}
            onChange={(e) => updateParam("action", e.target.value)}
            className="w-full h-10 px-3 text-sm text-[#0B1B3F] font-medium bg-white rounded-xl border border-[#D9E1EC] focus:outline-none focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20 cursor-pointer"
          >
            <option value="all">All actions</option>
            {Object.entries(AUDIT_ACTION_LABELS).map(([actionKey, actionLabel]) => (
              <option key={actionKey} value={actionKey}>
                {actionLabel}
              </option>
            ))}
          </select>
        </div>

        {/* Date filter */}
        <div>
          <label
            htmlFor="audit-filter-date"
            className="block text-xs font-semibold text-[#64748B] mb-1.5"
          >
            Date
          </label>
          <select
            id="audit-filter-date"
            value={currentRange}
            onChange={(e) => handleRangeChange(e.target.value)}
            className="w-full h-10 px-3 text-sm text-[#0B1B3F] font-medium bg-white rounded-xl border border-[#D9E1EC] focus:outline-none focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20 cursor-pointer"
          >
            <option value="all">All dates</option>
            <option value="today">Today (22 Oct 2026)</option>
            <option value="last7">Last 7 days</option>
            <option value="last30">Last 30 days</option>
            <option value="custom">Custom range</option>
          </select>
        </div>
      </div>

      {/* Custom Range Inputs */}
      {currentRange === "custom" && (
        <div className="flex flex-wrap items-center gap-3 pt-2 bg-slate-50 p-3 rounded-xl border border-[#E6ECF5]">
          <div>
            <label htmlFor="audit-from" className="block text-[11px] font-semibold text-[#64748B] mb-1">
              From
            </label>
            <input
              id="audit-from"
              type="date"
              value={from}
              max={to || "2026-10-22"}
              onChange={(e) => updateParam("from", e.target.value)}
              className="h-9 px-2.5 text-xs text-[#0B1B3F] font-medium bg-white rounded-lg border border-[#D9E1EC] focus:outline-none focus:border-[#1F6BFF]"
            />
          </div>
          <div>
            <label htmlFor="audit-to" className="block text-[11px] font-semibold text-[#64748B] mb-1">
              To
            </label>
            <input
              id="audit-to"
              type="date"
              value={to}
              min={from}
              max="2026-10-22"
              onChange={(e) => updateParam("to", e.target.value)}
              className="h-9 px-2.5 text-xs text-[#0B1B3F] font-medium bg-white rounded-lg border border-[#D9E1EC] focus:outline-none focus:border-[#1F6BFF]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
