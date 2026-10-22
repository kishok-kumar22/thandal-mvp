import React from "react";
import { CashbookFilters } from "@/components/cashbook/CashbookFilters";
import { PageTabs } from "@/components/ui/PageTabs";
import { getPendingHandovers } from "@/lib/cashbook";

export default function AdminCashbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pendingHandovers = getPendingHandovers();
  const pendingCount = pendingHandovers.length;

  const tabs = [
    {
      label: "Cash ledger",
      href: "/admin/cashbook",
    },
    {
      label: "Pending handovers",
      href: "/admin/cashbook/handovers",
      count: pendingCount,
      badgeVariant: "amber" as const,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl sm:text-[40px] font-bold text-[#0B1B3F] tracking-tight leading-tight">
          Cashbook &amp; handovers
        </h1>

        <CashbookFilters />
      </div>

      {/* Tabs */}
      <PageTabs items={tabs} />

      {/* Child Tab Page */}
      <div>{children}</div>
    </div>
  );
}
