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

export default async function CollectionsTodayPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const q = resolved.q || "";
  const agentId = resolved.agent || "all";

  const tasks = getCollectionTasks({
    date: todayIso(),
    agentId,
    q,
    tab: "today",
  });

  const summary = getCollectionSummary(tasks, todayIso());

  return <CollectionsBoard initialTasks={tasks} initialSummary={summary} />;
}
