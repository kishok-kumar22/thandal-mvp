import React from "react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function AdminPenaltiesPage() {
  return (
    <PlaceholderPage
      title="Penalties & Late Charges"
      category="Collections"
      description="Configure auto-penalty rules, waiver requests, and compounding default interest policies."
      backHref="/admin/overview"
    />
  );
}
