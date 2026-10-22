import React from "react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function AgentOverduePage() {
  return (
    <PlaceholderPage
      title="Overdue Follow-ups"
      category="My Work"
      description="Borrowers who missed earlier repayment dates. Log promise-to-pay (PTP) commitments and visitation notes."
      backHref="/agent/my-day"
    />
  );
}
