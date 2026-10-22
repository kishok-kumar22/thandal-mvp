import React from "react";
import { getSettings } from "@/lib/settings";
import { LoanDefaultsForm } from "@/components/settings/LoanDefaultsForm";

export const metadata = {
  title: "Loan Defaults - Settings | THANDAL",
  description: "Configure default loan terms and collection calendar rules.",
};

export default function LoanDefaultsPage() {
  const settings = getSettings();

  return <LoanDefaultsForm initialSettings={settings} />;
}
