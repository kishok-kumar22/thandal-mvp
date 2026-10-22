import React from "react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function AgentPaymentsPage() {
  return (
    <PlaceholderPage
      title="Payment History"
      category="Records"
      description="Chronological stream of payments accepted in the field with digital timestamps."
      backHref="/agent/my-day"
    />
  );
}
