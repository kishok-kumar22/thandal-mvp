import React from "react";
import { notFound } from "next/navigation";
import { getAgentById, mockAgentsList } from "@/data/mockAgents";
import { AgentProfileHeader } from "@/components/agents/profile/AgentProfileHeader";
import { AgentProfileTabs } from "@/components/agents/profile/AgentProfileTabs";
import { AgentStatCards } from "@/components/agents/profile/AgentStatCards";

interface AgentLayoutProps {
  children: React.ReactNode;
  params: Promise<{ agentId: string }>;
}

export function generateStaticParams() {
  return mockAgentsList.map((a) => ({ agentId: a.id }));
}

export default async function AgentProfileLayout({ children, params }: AgentLayoutProps) {
  const resolvedParams = await params;
  const agent = getAgentById(resolvedParams.agentId);

  if (!agent) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Agent Profile Header */}
      <AgentProfileHeader agent={agent} />

      {/* Tabs */}
      <AgentProfileTabs agentId={agent.id} />

      {/* Stat Cards */}
      <AgentStatCards agent={agent} />

      {/* Tab Specific Content */}
      {children}
    </div>
  );
}
