import React, { Suspense } from "react";
import { CustomerDataProvider } from "@/components/customers/CustomerDataContext";
import { CustomerTabs } from "@/components/customers/CustomerTabs";
import { CustomerProfileTabs } from "@/components/customers/profile/CustomerProfileTabs";
import { getCustomerById } from "@/data/mockCustomers";

interface CustomerLayoutProps {
  children: React.ReactNode;
  params: Promise<{ customerId: string }>;
}

export function generateStaticParams() {
  return [
    { customerId: "C-001" },
    { customerId: "C001" },
    { customerId: "C-004" },
  ];
}

export default async function CustomerLayout({ children, params }: CustomerLayoutProps) {
  const resolvedParams = await params;
  const rawId = resolvedParams.customerId;
  const customerId = rawId === "C001" || rawId === "c001" ? "C-001" : rawId;
  const customer = getCustomerById(customerId);

  const isActiveProfile = customer.status === "active";

  return (
    <CustomerDataProvider>
      <div className="space-y-4 max-w-7xl mx-auto pb-24">
        {/* Render CustomerProfileTabs when customer is active; onboarding tabs when pending */}
        <Suspense fallback={<div className="h-10 border-b border-[#E6ECF5]" />}>
          {isActiveProfile ? (
            <CustomerProfileTabs customerId={customerId} />
          ) : (
            <CustomerTabs customerId={customerId} />
          )}
        </Suspense>

        {/* Tab Content */}
        <div className="pt-1">
          <Suspense fallback={null}>{children}</Suspense>
        </div>
      </div>
    </CustomerDataProvider>
  );
}
