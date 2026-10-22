import React from "react";
import { DocumentsPageClient } from "@/components/customers/documents/DocumentsPageClient";

interface PageProps {
  params: Promise<{ customerId: string }>;
}

export const metadata = {
  title: "Proof Documents | THANDAL",
  description: "Customer verification and proof documents",
};

export function generateStaticParams() {
  return [{ customerId: "C-001" }, { customerId: "C001" }];
}

export default async function DocumentsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawId = resolvedParams.customerId;
  const customerId = rawId === "C001" || rawId === "c001" ? "C-001" : rawId;

  return <DocumentsPageClient customerId={customerId} />;
}
