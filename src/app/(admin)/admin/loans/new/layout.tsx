import React from "react";
import { LoanDraftProvider } from "@/components/loans/wizard/LoanDraftContext";
import { WizardHeader } from "@/components/loans/wizard/WizardHeader";

interface NewLoanLayoutProps {
  children: React.ReactNode;
}

export default function NewLoanLayout({ children }: NewLoanLayoutProps) {
  return (
    <LoanDraftProvider>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <WizardHeader />
        {children}
      </div>
    </LoanDraftProvider>
  );
}
