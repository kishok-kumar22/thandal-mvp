import React from "react";
import { getAgentPerformanceReport } from "@/lib/reports";
import { AgentPerformanceView } from "@/components/reports/AgentPerformanceView";

interface AgentPerformancePageProps {
  searchParams?: Promise<{
    from?: string;
    to?: string;
    branch?: string;
    agent?: string;
  }>;
}

export default async function AgentPerformancePage(props: AgentPerformancePageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};

  const from = searchParams.from || "2026-10-21";
  const to = searchParams.to || "2026-10-22";
  const branch = searchParams.branch || "all";
  const agent = searchParams.agent || "all";

  const { rows, total } = getAgentPerformanceReport({
    from,
    to,
    branchId: branch !== "all" ? branch : undefined,
    agentId: agent !== "all" ? agent : undefined,
  });

  return (
    <AgentPerformanceView
      rows={rows}
      total={total}
      from={from}
      to={to}
      branch={branch !== "all" ? branch : "All"}
      agent={agent !== "all" ? agent : "All"}
    />
  );
}
