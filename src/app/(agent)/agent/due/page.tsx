import React from "react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function AgentDuePage() {
  return (
    <PlaceholderPage
      title="Due Collections"
      category="My Work"
      description="Scheduled daily installments maturing today with time windows and exact amounts."
      backHref="/agent/my-day"
    />
  );
}
