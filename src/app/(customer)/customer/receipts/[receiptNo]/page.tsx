import React, { Suspense } from "react";
import { requireRole } from "@/lib/session";
import { getMyReceipt } from "@/lib/customerPortal";
import { ReceiptView } from "@/components/receipts/ReceiptView";
import { AutoPrint } from "@/components/ui/AutoPrint";

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

  // Calls customer data layer security boundary: validates ownership & returns sanitized view model or notFound()
  const receipt = await getMyReceipt(user, receiptNo);

  return (
    <>
      <Suspense fallback={null}>
        <AutoPrint />
      </Suspense>
      <ReceiptView
        receipt={receipt as any}
        role="customer"
        backHref="/customer/receipts"
      />
    </>
  );
}
