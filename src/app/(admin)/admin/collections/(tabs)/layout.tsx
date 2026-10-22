import React from "react";
import { PageTabs } from "@/components/ui/PageTabs";
import { CollectionFilters } from "@/components/collections/CollectionFilters";

export default function CollectionsListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tabs = [
    { label: "Today", href: "/admin/collections" },
    { label: "Overdue", href: "/admin/collections/overdue" },
    { label: "All payments", href: "/admin/collections/all" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Title & Date */}
      <div>
        <h1 className="text-3xl sm:text-[40px] font-bold text-[#0B1B3F] tracking-tight leading-tight">
          Collections
        </h1>
        <p className="text-sm font-medium text-[#64748B] mt-1">
          22 Oct 2026
        </p>
      </div>

      {/* Page Tabs */}
      <PageTabs items={tabs} />

      {/* Filter Row */}
      <CollectionFilters />

      {/* Child Tab Page */}
      <div>{children}</div>
    </div>
  );
}
