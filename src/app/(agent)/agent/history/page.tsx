import React from "react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function AgentHistoryPage() {
  return (
    <PlaceholderPage
      title="Collection History"
      category="Collection Agent"
      description="View detailed past receipts, daily payment journals, and completed cash handovers."
      backHref="/agent/my-day"
    />
  );
}
