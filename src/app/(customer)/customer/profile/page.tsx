import React from "react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function CustomerProfilePage() {
  return (
    <PlaceholderPage
      title="My Borrower Profile"
      category="Support"
      description="R. Kumar &bull; Customer ID CST-4402. View verified mobile number, Aadhaar reference, and residential address."
      backHref="/customer/home"
    />
  );
}
