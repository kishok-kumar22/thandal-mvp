import React from "react";
import { getCollectionsReport } from "@/lib/reports";
import { CollectionSummaryView } from "@/components/reports/CollectionSummaryView";

interface CollectionSummaryPageProps {
  searchParams?: Promise<{
    from?: string;
    to?: string;
    branch?: string;
    agent?: string;
  }>;
}

export default async function CollectionSummaryPage(props: CollectionSummaryPageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};

  const from = searchParams.from || "2026-10-21";
  const to = searchParams.to || "2026-10-22";
  const branch = searchParams.branch || "all";
  const agent = searchParams.agent || "all";

  const reportData = getCollectionsReport({
    from,
    to,
    branchId: branch !== "all" ? branch : undefined,
    agentId: agent !== "all" ? agent : undefined,
  });

  return (
    <CollectionSummaryView
      data={reportData}
      branch={branch !== "all" ? branch : "All"}
      agent={agent !== "all" ? agent : "All"}
    />
  );
}
