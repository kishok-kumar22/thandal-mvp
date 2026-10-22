import React from "react";
import { getLoanPortfolioReport } from "@/lib/reports";
import { LoanPortfolioView } from "@/components/reports/LoanPortfolioView";

interface LoanPortfolioPageProps {
  searchParams?: Promise<{
    from?: string;
    to?: string;
    branch?: string;
    agent?: string;
  }>;
}

export default async function LoanPortfolioPage(props: LoanPortfolioPageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};

  const from = searchParams.from || "2026-10-21";
  const to = searchParams.to || "2026-10-22";
  const branch = searchParams.branch || "all";
  const agent = searchParams.agent || "all";

  const data = getLoanPortfolioReport({
    from,
    to,
    branchId: branch !== "all" ? branch : undefined,
    agentId: agent !== "all" ? agent : undefined,
  });

  return (
    <LoanPortfolioView
      data={data}
      from={from}
      to={to}
      branch={branch !== "all" ? branch : "All"}
      agent={agent !== "all" ? agent : "All"}
    />
  );
}
