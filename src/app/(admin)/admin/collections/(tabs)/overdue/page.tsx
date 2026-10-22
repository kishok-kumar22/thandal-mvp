import React from "react";
import { CollectionsBoard } from "@/components/collections/CollectionsBoard";
import { getCollectionTasks, getCollectionSummary } from "@/lib/collections";
import { todayIso } from "@/lib/clock";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    agent?: string;
  }>;
}

export default async function CollectionsOverduePage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const q = resolved.q || "";
  const agentId = resolved.agent || "all";

  const overdueTasks = getCollectionTasks({
    date: todayIso(),
    agentId,
    q,
    tab: "overdue",
  });

  const totalOverdue = overdueTasks.reduce((sum, t) => sum + t.amountToCollect, 0);

  const summary = {
    dueToday: totalOverdue,
    receivedToday: 0,
    remainingToday: totalOverdue,
  };

  return <CollectionsBoard initialTasks={overdueTasks} initialSummary={summary} />;
}
