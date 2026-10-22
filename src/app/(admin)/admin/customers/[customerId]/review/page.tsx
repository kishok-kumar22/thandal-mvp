import React from "react";
import { ReviewPageClient } from "@/components/customers/review/ReviewPageClient";

interface PageProps {
  params: Promise<{ customerId: string }>;
}

export const metadata = {
  title: "Review & Activate Customer | THANDAL",
  description: "Review customer documentation and activate portal access",
};

export function generateStaticParams() {
  return [{ customerId: "C-001" }, { customerId: "C001" }];
}

export default async function CustomerReviewPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawId = resolvedParams.customerId;
  const customerId = rawId === "C001" || rawId === "c001" ? "C-001" : rawId;

  return <ReviewPageClient customerId={customerId} />;
}
