import React from "react";
import { getCurrentUser } from "@/lib/session";
import { can } from "@/lib/permissions";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { ReportNav } from "@/components/reports/ReportNav";
import { mockAgentsList } from "@/data/mockAgents";

export const metadata = {
  title: "Reports & Analytics - THANDAL",
  description: "Financial, collection, portfolio, and audit reporting for THANDAL.",
};

export const instant = false;

interface ReportsLayoutProps {
  children: React.ReactNode;
}

export default async function ReportsLayout({ children }: ReportsLayoutProps) {
  const currentUser = await getCurrentUser();

  // Admin access control check
  if (!currentUser || !can(currentUser, "view_reports")) {
    return (
      <AccessDenied
        message="Reports Access Restricted"
        description="Access to financial reporting, portfolio analytics, and cash audit summaries is restricted to administrators."
        backHref="/admin/overview"
        backLabel="Return to Overview"
      />
    );
  }

  // Derive distinct branches and agents
  const branches = Array.from(new Set(mockAgentsList.map((a) => a.branchId).filter(Boolean)));
  const agents = mockAgentsList.map((a) => ({
    id: a.id,
    name: a.name,
    branch: a.branchId,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24 md:pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3F] tracking-tight">
          Reports
        </h1>
      </div>

      {/* Filter Card (4 fields staged, with DateRangePicker, Branch, Agent, Apply) */}
      <ReportFilters branches={branches} agents={agents} />

      {/* Body: Nav on left (260px), Content on right */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
        {/* Sub Navigation */}
        <aside>
          <ReportNav />
        </aside>

        {/* Content Card */}
        <main className="bg-white rounded-xl border border-[#E6ECF5] p-5 sm:p-6 shadow-sm min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
