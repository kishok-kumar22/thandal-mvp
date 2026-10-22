import React from "react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

interface PageProps {
  params: Promise<{ customerId: string }>;
}

export function generateStaticParams() {
  return [
    { customerId: "C-001" },
    { customerId: "C001" },
    { customerId: "C-004" },
  ];
}

export default async function CustomerPaymentsTab({ params }: PageProps) {
  const resolvedParams = await params;
  const rawId = resolvedParams.customerId;
  const customerId = rawId === "C001" || rawId === "c001" ? "C-001" : rawId;

  return (
    <PlaceholderPage
      title={`Payment History: ${customerId}`}
      category="Collections & Ledger"
      description="Full chronological statement of daily installment collections, cash receipts, and mode of collection."
      backHref={`/admin/customers/${customerId}`}
    />
  );
}
