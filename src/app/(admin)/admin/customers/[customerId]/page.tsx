import React from "react";
import { Breadcrumbs } from "@/components/customers/Breadcrumbs";
import { CustomerProfileHeader } from "@/components/customers/profile/CustomerProfileHeader";
import { CustomerDetailsCard } from "@/components/customers/profile/CustomerDetailsCard";
import { ActiveLoanSummaryCard } from "@/components/customers/profile/ActiveLoanSummaryCard";
import { RecentActivityTable } from "@/components/customers/profile/RecentActivityTable";
import { ProfileActionBar } from "@/components/customers/profile/ProfileActionBar";
import { getCustomerById } from "@/data/mockCustomers";

interface PageProps {
  params: Promise<{ customerId: string }>;
}

export function generateStaticParams() {
  return [
    { customerId: "C-001" },
    { customerId: "C001" },
    { customerId: "C-004" },
  ];
}

export default async function CustomerOverviewPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawId = resolvedParams.customerId;
  const customerId = rawId === "C001" || rawId === "c001" ? "C-001" : rawId;
  const customer = getCustomerById(customerId);

  return (
    <div className="space-y-6">
      {/* 1. Breadcrumb: Customers > R. Kumar */}
      <Breadcrumbs
        items={[
          { label: "Customers", href: "/admin/customers" },
          { label: customer.name },
        ]}
      />

      {/* 2. Header Row */}
      <CustomerProfileHeader
        name={customer.name}
        customerId={customerId}
        initials="RK"
      />

      {/* 3. Two Cards Side by Side (Customer Details ~ 1fr, Active Loan Summary ~ 1.3fr) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-6 items-stretch">
        <CustomerDetailsCard customer={customer} />
        <ActiveLoanSummaryCard loan={customer.activeLoan} />
      </div>

      {/* 4. Recent Activity Table */}
      <RecentActivityTable activities={customer.activities} />

      {/* 5. Sticky Bottom Action Bar */}
      <ProfileActionBar name={customer.name} customerId={customerId} />
    </div>
  );
}
