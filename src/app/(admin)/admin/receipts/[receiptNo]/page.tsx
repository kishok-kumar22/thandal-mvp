import React from "react";
import { notFound } from "next/navigation";
import { mockReceiptsList } from "@/data/mockReceipts";
import { ReceiptView } from "@/components/receipts/ReceiptView";

interface PageProps {
  params: Promise<{ receiptNo: string }>;
}

export function generateStaticParams() {
  return [
    { receiptNo: "RC-0001" },
    { receiptNo: "RC-0002" },
    { receiptNo: "RC-0021" },
  ];
}

export default async function AdminReceiptPage({ params }: PageProps) {
  const resolvedParams = await params;
  const receiptNo = resolvedParams.receiptNo.trim().toUpperCase();

  const receipt = mockReceiptsList.find((r) => r.receiptNo.toUpperCase() === receiptNo);

  if (!receipt) {
    notFound();
  }

  return <ReceiptView receipt={receipt} role="admin" />;
}
