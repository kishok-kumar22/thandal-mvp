import React from "react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function CustomerDocumentsPage() {
  return (
    <PlaceholderPage
      title="My Loan Documents"
      category="My Account"
      description="Signed promissory notes, sanction letters, and identity proof copies submitted during application."
      backHref="/customer/home"
    />
  );
}
