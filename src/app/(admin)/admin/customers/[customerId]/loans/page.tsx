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

export default async function CustomerLoansTab({ params }: PageProps) {
  const resolvedParams = await params;
  const rawId = resolvedParams.customerId;
  const customerId = rawId === "C001" || rawId === "c001" ? "C-001" : rawId;

  return (
    <PlaceholderPage
      title={`Customer Loans: ${customerId}`}
      category="Lending Contracts"
      description="Historical and current loan accounts, interest amortization, and disbursement schedules for this customer."
      backHref={`/admin/customers/${customerId}`}
    />
  );
}
