import React from "react";
import { CashSummaryCards } from "@/components/cashbook/CashSummaryCards";
import { PendingHandoversClient } from "@/components/cashbook/PendingHandoversClient";
import { getPendingHandovers } from "@/lib/cashbook";
import { todayIso } from "@/lib/clock";

interface PageProps {
  searchParams: Promise<{
    date?: string;
    agent?: string;
    handover?: string;
  }>;
}

export default async function AdminPendingHandoversPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const date = resolved.date || todayIso();
  const agentId = resolved.agent || "all";
  const selectedHandoverId = resolved.handover;

  const pendingHandovers = getPendingHandovers(agentId);

  return (
    <div className="space-y-6">
      {/* 3 Shared Stat Cards */}
      <CashSummaryCards date={date} agentId={agentId} />

      {/* Main Grid: Pending handovers list + Review Card */}
      <PendingHandoversClient
        initialHandovers={pendingHandovers}
        initialSelectedId={selectedHandoverId}
      />
    </div>
  );
}
