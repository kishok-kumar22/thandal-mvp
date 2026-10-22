import React from "react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function AdminOverduePage() {
  return (
    <PlaceholderPage
      title="Overdue Payments"
      category="Risk & Recovery"
      description="Track defaulted installments, aging buckets (1-30, 31-60, 60+ days), and collection escalations."
      backHref="/admin/overview"
    />
  );
}
