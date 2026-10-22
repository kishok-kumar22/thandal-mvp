import React from "react";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function AgentReceiptsPage() {
  return (
    <PlaceholderPage
      title="Issued Receipts"
      category="Records"
      description="Download, share on WhatsApp, or reprint SMS/digital receipts generated for collections."
      backHref="/agent/my-day"
    />
  );
}
