import React from "react";
import { notFound } from "next/navigation";
import { getAgentById, mockAgentsList } from "@/data/mockAgents";
import { AgentForm } from "@/components/agents/form/AgentForm";

interface PageProps {
  params: Promise<{ agentId: string }>;
}

export function generateStaticParams() {
  return mockAgentsList.map((a) => ({ agentId: a.id }));
}

export default async function EditAgentPage({ params }: PageProps) {
  const resolvedParams = await params;
  const agent = getAgentById(resolvedParams.agentId);

  if (!agent) {
    notFound();
  }

  return (
    <AgentForm
      mode="edit"
      agentId={agent.id}
      initialValues={{
        fullName: agent.name,
        mobile: agent.mobile,
        email: agent.email,
        employeeId: agent.employeeId,
        branchId: agent.branchId,
        routeId: agent.routeId,
        joiningDate: agent.joiningDate,
        status: agent.status,
        role: "collection_agent",
      }}
    />
  );
}
