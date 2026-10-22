import React from "react";
import { getMockAgents, mockRoutes } from "@/data/mockAgents";
import { AgentFilters } from "@/components/agents/AgentFilters";
import { AgentsTable } from "@/components/agents/AgentsTable";
import { AgentCard } from "@/components/agents/AgentCard";
import { AgentsFooterBar } from "@/components/agents/AgentsFooterBar";
import { EmptyState } from "@/components/ui/EmptyState";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    route?: string;
    page?: string;
    perPage?: string;
  }>;
}

export default async function AdminAgentsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const q = (resolvedParams.q || "").trim().toLowerCase();
  const status = (resolvedParams.status || "All statuses").toLowerCase();
  const route = resolvedParams.route || "All routes";

  // Validate perPage against allowed values [10, 25, 50]
  const allowedPerPage = [10, 25, 50];
  const requestedPerPage = parseInt(resolvedParams.perPage || "10", 10);
  const perPage = allowedPerPage.includes(requestedPerPage) ? requestedPerPage : 10;

  const currentPage = Math.max(1, parseInt(resolvedParams.page || "1", 10) || 1);

  const allAgents = getMockAgents();

  // Filter
  const filteredAgents = allAgents.filter((agent) => {
    if (q) {
      const matchName = agent.name.toLowerCase().includes(q);
      const matchId = agent.id.toLowerCase().includes(q);
      if (!matchName && !matchId) return false;
    }

    if (status !== "all statuses" && agent.status.toLowerCase() !== status) {
      return false;
    }

    if (route !== "All routes" && agent.route !== route) {
      return false;
    }

    return true;
  });

  const totalCount = filteredAgents.length;
  const totalPages = Math.ceil(totalCount / perPage) || 1;
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, totalCount);
  const paginatedAgents = filteredAgents.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Filter Card */}
      <AgentFilters routes={mockRoutes} />

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-[#E6ECF5] shadow-xs overflow-hidden">
        {totalCount === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No agents found"
              description="Try a different search query or clear the filter selections."
              actionLabel="Clear filters"
              onAction={undefined}
            />
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <AgentsTable agents={paginatedAgents} />
            </div>

            <div className="md:hidden p-4 space-y-3">
              {paginatedAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </>
        )}

        {/* Footer Bar pinned to bottom of table card */}
        {totalCount > 0 && (
          <AgentsFooterBar
            totalCount={totalCount}
            startIndex={startIndex}
            endIndex={endIndex}
            currentPage={currentPage}
            totalPages={totalPages}
            perPage={perPage}
          />
        )}
      </div>
    </div>
  );
}
