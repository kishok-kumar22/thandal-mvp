import React from "react";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { mockReceiptsList } from "@/data/mockReceipts";
import { ReceiptView } from "@/components/receipts/ReceiptView";

interface CustomerReceiptDetailPageProps {
  params: Promise<{
    receiptNo: string;
  }>;
}

export const metadata = {
  title: "Receipt Details | THANDAL",
  description: "Official digital receipt verification",
};

export default async function CustomerReceiptDetailPage(props: CustomerReceiptDetailPageProps) {
  const { receiptNo } = await props.params;
  const user = await requireRole("customer", `/customer/receipts/${receiptNo}`);
  const customerId = user.customerId || "C-001";

  const receipt = mockReceiptsList.find(
    (r) => r.receiptNo.toUpperCase() === receiptNo.toUpperCase()
  );

  // Security isolation: Customers can strictly only view their own receipts
  if (!receipt || receipt.customerId !== customerId) {
    notFound();
  }

  return (
    <ReceiptView
      receipt={receipt}
      role="customer"
      backHref="/customer/receipts"
    />
  );
}
