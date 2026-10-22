import React from "react";
import { getAgentTasks } from "@/lib/collections";
import { mockRoutesList } from "@/data/mockRoutes";
import { AgentCustomersClient } from "@/components/agent-portal/AgentCustomersClient";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    route?: string;
  }>;
}

export const instant = false;

export default async function AgentCustomersPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const q = (resolvedParams.q || "").trim().toLowerCase();
  const route = resolvedParams.route || "Anna Nagar";

  // For agent Selvam (A-001)
  const allTasks = getAgentTasks("A-001");

  // Agent's available routes
  const availableRoutes = ["Anna Nagar", "T Nagar"];

  // Filter tasks
  const filteredTasks = allTasks.filter((task) => {
    // Search by customer name or loan ID or customer ID
    if (q) {
      const matchName = task.customerName.toLowerCase().includes(q);
      const matchId = task.customerId.toLowerCase().includes(q);
      const matchLoan = task.loanId.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchLoan) return false;
    }

    // Filter by route
    if (route && route !== "All routes") {
      if (task.routeName.toLowerCase() !== route.toLowerCase()) {
        return false;
      }
    }

    return true;
  });

  return (
    <AgentCustomersClient tasks={filteredTasks} routes={availableRoutes} />
  );
}
