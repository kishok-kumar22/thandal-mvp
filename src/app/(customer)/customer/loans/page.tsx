import React from "react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function CustomerLoansPage() {
  return (
    <PlaceholderPage
      title="My Loans"
      category="My Account"
      description="View all current and past loan agreements, interest calculations, and closure certificates."
      backHref="/customer/home"
    />
  );
}
