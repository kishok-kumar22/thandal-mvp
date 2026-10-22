"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/customers/Breadcrumbs";
import { CustomerPageHeader } from "@/components/customers/CustomerPageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StickyActionBar } from "@/components/customers/StickyActionBar";
import { DocumentsTable } from "@/components/customers/documents/DocumentsTable";
import { ReviewDocumentCard } from "@/components/customers/documents/ReviewDocumentCard";
import { UploadDocumentCard } from "@/components/customers/documents/UploadDocumentCard";
import { useCustomerData } from "@/components/customers/CustomerDataContext";

interface DocumentsPageClientProps {
  customerId: string;
}

export function DocumentsPageClient({ customerId }: DocumentsPageClientProps) {
  const {
    customer,
    selectedDocId,
    setSelectedDocId,
    updateDocStatus,
    addDocument,
    deleteDocument,
  } = useCustomerData();

  const selectedDoc = customer.documents.find((d) => d.id === selectedDocId);

  // Check verification pending status: if any document is not verified
  const isPending = customer.documents.some((d) => d.status !== "verified");

  return (
    <div className="space-y-6">
      {/* Breadcrumbs: Customers > C-001 > Documents */}
      <Breadcrumbs
        items={[
          { label: "Customers", href: "/admin/customers" },
          { label: customerId, href: `/admin/customers/${customerId}` },
          { label: "Documents" },
        ]}
      />

      {/* Header with Title and Verification Pending Badge */}
      <CustomerPageHeader
        title="Customer documents"
        customerName={customer.name}
        customerId={customerId}
        badge={
          isPending ? (
            <Badge variant="pending" label="Verification pending" />
          ) : (
            <Badge variant="verified" label="All verified" />
          )
        }
      />

      {/* Content Grid: 1fr on Left, 380px on Right, Stacking on Tablet/Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* Left Column: Proof Documents Table & Review Card */}
        <div className="space-y-6">
          <DocumentsTable
            documents={customer.documents}
            selectedDocId={selectedDocId}
            onSelectDoc={setSelectedDocId}
            onDeleteDoc={deleteDocument}
          />

          <ReviewDocumentCard
            selectedDoc={selectedDoc}
            onUpdateStatus={updateDocStatus}
          />
        </div>

        {/* Right Column: Upload Document Card */}
        <div>
          <UploadDocumentCard onAddDocument={addDocument} />
        </div>
      </div>

      {/* Sticky Action Bar */}
      <StickyActionBar
        left={
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => alert("Draft documents progress saved.")}
          >
            Save draft
          </Button>
        }
        right={
          <Link href={`/admin/customers/${customerId}/review`}>
            <Button
              type="button"
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to review
            </Button>
          </Link>
        }
      />
    </div>
  );
}
