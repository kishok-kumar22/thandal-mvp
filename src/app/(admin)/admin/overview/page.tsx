import React from "react";
import Link from "next/link";
import {
  Calendar,
  Building,
  ChevronDown,
  Plus,
  FileText,
  Coins,
  HandCoins,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { WeeklyBarChart } from "@/components/dashboard/WeeklyBarChart";
import { TargetDonut } from "@/components/dashboard/TargetDonut";
import { CollectionQueueTable } from "@/components/dashboard/CollectionQueueTable";
import { AgentCollectionsCard } from "@/components/dashboard/AgentCollectionsCard";
import { mockDashboardData } from "@/data/mock";
import { formatINR } from "@/lib/format";

export const metadata = {
  title: "Admin Dashboard | THANDAL",
  description: "Lending and collection overview dashboard",
};

export default function AdminOverviewPage() {
  const { kpis, weeklyCollections, collectionTarget, collectionQueue, agentCollections, pendingVerificationsCount } =
    mockDashboardData;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* A) Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-3xl sm:text-[34px] font-bold text-[#0B1B3F] tracking-tight leading-tight">
            Dashboard
          </h1>
          <p className="text-sm text-[#64748B] mt-1">Your lending and collection overview</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Date Picker Button */}
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#0B1B3F] bg-white border border-[#E6ECF5] rounded-lg shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#1F6BFF]" />
            <span>22 Oct 2026</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
          </button>

          {/* All Branches Select */}
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#0B1B3F] bg-white border border-[#E6ECF5] rounded-lg shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Building className="w-4 h-4 text-[#64748B]" />
            <span>All branches</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
          </button>

          {/* Action Buttons */}
          <Link href="/admin/customers/create">
            <Button variant="outline" size="sm" icon={<Plus className="w-4 h-4" />}>
              Create customer
            </Button>
          </Link>

          <Link href="/admin/loans/new">
            <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
              Create loan
            </Button>
          </Link>

          <Link href="/admin/agents/new">
            <Button variant="outline" size="sm" icon={<Plus className="w-4 h-4" />}>
              Create agent
            </Button>
          </Link>
        </div>
      </div>

      {/* B) KPI Cards Grid (4 cols desktop, 2 cols tablet, 1 col mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <KpiCard
          label="Active loans"
          value={kpis.activeLoans}
          icon={<FileText className="w-6 h-6" />}
        />
        <KpiCard
          label="Outstanding principal"
          value={formatINR(kpis.outstandingPrincipal)}
          icon={<Coins className="w-6 h-6" />}
        />
        <KpiCard
          label="Collected today"
          value={formatINR(kpis.collectedToday)}
          icon={<HandCoins className="w-6 h-6" />}
        />
        <KpiCard
          label="Overdue amount"
          value={formatINR(kpis.overdueAmount)}
          variant="danger"
          icon={<AlertTriangle className="w-6 h-6" />}
        />
      </div>

      {/* C) Row 2: Charts (Collections this week ~60% / Target Donut ~40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 flex flex-col">
          <WeeklyBarChart data={weeklyCollections} maxScale={50000} />
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <TargetDonut
            collected={collectionTarget.collected}
            target={collectionTarget.target}
          />
        </div>
      </div>

      {/* D) Row 3: Collection Queue & Agent Collections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 flex flex-col">
          <CollectionQueueTable
            items={collectionQueue.items}
            totalScheduled={collectionQueue.totalScheduled}
          />
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <AgentCollectionsCard
            agents={agentCollections.agents}
            cashAwaitingHandover={agentCollections.cashAwaitingHandover}
          />
        </div>
      </div>

      {/* E) Footer line, right-aligned: Customer verification pending */}
      <div className="flex justify-end pt-2 pb-4">
        <Link
          href="/admin/customers/proofs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F6BFF] hover:underline"
        >
          <Shield className="w-4 h-4 text-[#1F6BFF]" />
          <span>Customer verification: {pendingVerificationsCount} pending &gt;</span>
        </Link>
      </div>
    </div>
  );
}
