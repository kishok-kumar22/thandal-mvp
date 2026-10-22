import React from "react";
import { notFound } from "next/navigation";
import { getAgentById, mockAgentsList } from "@/data/mockAgents";
import { OverviewClient } from "@/components/agents/profile/OverviewClient";
import type { StagedAssignmentItem } from "@/components/agents/profile/AssignmentsContext";

interface PageProps {
  params: Promise<{ agentId: string }>;
}

export function generateStaticParams() {
  return mockAgentsList.map((a) => ({ agentId: a.id }));
}

export default async function AgentOverviewPage({ params }: PageProps) {
  const resolvedParams = await params;
  const agent = getAgentById(resolvedParams.agentId);

  if (!agent) {
    notFound();
  }

  // Seed rows matching mockup 1:
  // R.Kumar | LN-1052 | Anna Nagar | ₹105 | Daily
  // S.Priya | LN-1053 | Anna Nagar | ₹150 | Weekly
  const initialAssigned: StagedAssignmentItem[] = [
    {
      customerId: "C-001",
      customerName: "R.Kumar",
      loanNo: "LN-1052",
      area: "Anna Nagar",
      amount: 105,
      frequency: "daily",
      routeId: "RT-001",
      effectiveDate: "2024-07-01",
    },
    {
      customerId: "C-002",
      customerName: "S.Priya",
      loanNo: "LN-1053",
      area: "Anna Nagar",
      amount: 150,
      frequency: "weekly",
      routeId: "RT-001",
      effectiveDate: "2024-07-15",
    },
  ];

  return <OverviewClient agent={agent} initialAssigned={initialAssigned} />;
}
