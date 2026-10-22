"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TaskFilters } from "./TaskFilters";
import { CustomerTaskCard } from "./CustomerTaskCard";
import { ReceiptModal } from "./ReceiptModal";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AgentTaskView } from "@/lib/collections";

interface AgentCustomersClientProps {
  tasks: AgentTaskView[];
  routes: string[];
}

export function AgentCustomersClient({ tasks, routes }: AgentCustomersClientProps) {
  const router = useRouter();
  const [viewingReceiptTask, setViewingReceiptTask] = useState<AgentTaskView | null>(null);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-[#0B1B3F] tracking-tight">
        My customers
      </h1>

      {/* Filter component (URL-driven) */}
      <TaskFilters availableRoutes={routes} />

      {/* Task List / Cards Grid */}
      {tasks.length === 0 ? (
        <EmptyState
          title="No customers on this route"
          description="Try selecting a different collection route or clearing your search query."
          actionLabel="Clear search"
          onAction={() => router.replace("/agent/customers")}
        />
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <CustomerTaskCard
              key={task.id}
              task={task}
              onViewReceipt={(t) => setViewingReceiptTask(t)}
            />
          ))}
        </div>
      )}

      {/* View Receipt Modal */}
      <ReceiptModal
        task={viewingReceiptTask}
        role="agent"
        onClose={() => setViewingReceiptTask(null)}
      />
    </div>
  );
}
