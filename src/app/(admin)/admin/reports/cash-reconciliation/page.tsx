import React from "react";
import { getCashReconciliationReport } from "@/lib/reports";
import { CashReconciliationView } from "@/components/reports/CashReconciliationView";

interface CashReconciliationPageProps {
  searchParams?: Promise<{
    from?: string;
    to?: string;
    branch?: string;
    agent?: string;
  }>;
}

export default async function CashReconciliationPage(props: CashReconciliationPageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};

  const from = searchParams.from || "2026-10-21";
  const to = searchParams.to || "2026-10-22";
  const branch = searchParams.branch || "all";
  const agent = searchParams.agent || "all";

  const { rows, allMatch } = getCashReconciliationReport(to);

  return (
    <CashReconciliationView
      rows={rows}
      allMatch={allMatch}
      date={to}
      from={from}
      to={to}
      branch={branch !== "all" ? branch : "All"}
      agent={agent !== "all" ? agent : "All"}
    />
  );
}
