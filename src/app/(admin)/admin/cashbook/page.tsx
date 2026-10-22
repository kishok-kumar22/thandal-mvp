import React from "react";
import { CashSummaryCards } from "@/components/cashbook/CashSummaryCards";
import { CashLedgerTable } from "@/components/cashbook/CashLedgerTable";
import { getLedger } from "@/lib/cashbook";
import { todayIso } from "@/lib/clock";

interface PageProps {
  searchParams: Promise<{
    date?: string;
    agent?: string;
  }>;
}

export default async function AdminCashLedgerPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const date = resolved.date || todayIso();
  const agentId = resolved.agent || "all";

  const { rows, totalIn, totalOut } = getLedger({ date, agentId });

  return (
    <div className="space-y-6">
      {/* 3 Shared Stat Cards */}
      <CashSummaryCards date={date} agentId={agentId} />

      {/* Cash Ledger Table */}
      <CashLedgerTable rows={rows} totalIn={totalIn} totalOut={totalOut} />
    </div>
  );
}
