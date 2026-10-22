import React from "react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function CustomerPaymentsPage() {
  return (
    <PlaceholderPage
      title="Payment History"
      category="My Account"
      description="View full payment records, installment transaction IDs, payment mode (cash / UPI), and timestamps."
      backHref="/customer/home"
    />
  );
}
