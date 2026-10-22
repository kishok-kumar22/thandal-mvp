"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/customers/Breadcrumbs";
import { CustomerPageHeader } from "@/components/customers/CustomerPageHeader";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { StickyActionBar } from "@/components/customers/StickyActionBar";
import { CustomerSummaryCard } from "@/components/customers/review/CustomerSummaryCard";
import { DocumentVerificationCard } from "@/components/customers/review/DocumentVerificationCard";
import { CustomerAccountCard } from "@/components/customers/review/CustomerAccountCard";
import { useCustomerData } from "@/components/customers/CustomerDataContext";
import { maskMobile } from "@/lib/mask";

interface ReviewPageClientProps {
  customerId: string;
}

export function ReviewPageClient({ customerId }: ReviewPageClientProps) {
  const router = useRouter();
  const { customer, setPortalAccess, setConsentGiven } = useCustomerData();

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if both identity and address proofs are verified
  const isIdentityVerified = customer.documents.some(
    (d) => d.category.toLowerCase().includes("identity") && d.status === "verified"
  );
  const isAddressVerified = customer.documents.some(
    (d) => d.category.toLowerCase().includes("address") && d.status === "verified"
  );

  const isBothProofsVerified = isIdentityVerified && isAddressVerified;
  const isReadyForActivation = isBothProofsVerified;

  // Activation button is enabled ONLY when:
  // 1. Consent checkbox is ticked
  // 2. Portal access toggle is ON
  // 3. Both identity and address proofs are verified
  const canActivate =
    customer.consentGiven && customer.portalAccess && isBothProofsVerified && !isSubmitting;

  const getDisabledReason = () => {
    if (!isBothProofsVerified) {
      return "Identity and address proof documents must be verified first.";
    }
    if (!customer.portalAccess) {
      return "Customer portal access must be enabled.";
    }
    if (!customer.consentGiven) {
      return "Customer consent must be acknowledged.";
    }
    return "";
  };

  const handleCreateCustomer = () => {
    if (!canActivate) return;

    setIsSubmitting(true);
    const masked = maskMobile(customer.mobile);
    setToastMessage(`Activation link sent to ${masked}`);
    setToastOpen(true);

    setTimeout(() => {
      router.push("/admin/customers");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs: Customers > C-001 > Review customer */}
      <Breadcrumbs
        items={[
          { label: "Customers", href: "/admin/customers" },
          { label: customerId, href: `/admin/customers/${customerId}` },
          { label: "Review customer" },
        ]}
      />

      {/* Header with Title and larger Subline */}
      <CustomerPageHeader
        title="Review customer"
        customerName={customer.name}
        customerId={customerId}
      />

      {/* Content: 3 equal height cards in grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
        {/* Card 1: Customer Summary */}
        <div className="h-full">
          <CustomerSummaryCard customer={customer} customerId={customerId} />
        </div>

        {/* Card 2: Document Verification */}
        <div className="h-full">
          <DocumentVerificationCard documents={customer.documents} customerId={customerId} />
        </div>

        {/* Card 3: Customer Account */}
        <div className="h-full md:col-span-2 xl:col-span-1">
          <CustomerAccountCard
            isReadyForActivation={isReadyForActivation}
            portalAccess={customer.portalAccess}
            onPortalAccessChange={setPortalAccess}
            consentGiven={customer.consentGiven}
            onConsentChange={setConsentGiven}
          />
        </div>
      </div>

      {/* Sticky Action Bar */}
      <StickyActionBar
        left={
          <Link href="/admin/customers">
            <Button type="button" variant="secondary" size="md">
              Cancel
            </Button>
          </Link>
        }
        right={
          <div className="flex items-center gap-3">
            {!canActivate && (
              <span className="hidden sm:inline text-xs text-[#E5252A] font-medium">
                {getDisabledReason()}
              </span>
            )}

            <Button
              type="button"
              variant="primary"
              size="md"
              disabled={!canActivate}
              onClick={handleCreateCustomer}
              title={!canActivate ? getDisabledReason() : "Activate customer"}
            >
              {isSubmitting ? "Activating..." : "Create customer & send activation"}
            </Button>
          </div>
        }
      />

      {/* Toast Notification */}
      <Toast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        type="success"
      />
    </div>
  );
}
