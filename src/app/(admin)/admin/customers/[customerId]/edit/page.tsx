import React from "react";
import { CreateCustomerForm } from "@/components/customers/form/CreateCustomerForm";
import { getCustomerById } from "@/data/mockCustomers";

interface PageProps {
  params: Promise<{ customerId: string }>;
}

export function generateStaticParams() {
  return [{ customerId: "C-001" }, { customerId: "C001" }, { customerId: "C-004" }];
}

export default async function EditCustomerPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawId = resolvedParams.customerId;
  const customerId = rawId === "C001" || rawId === "c001" ? "C-001" : rawId;
  const customer = getCustomerById(customerId);

  return (
    <CreateCustomerForm
      mode="edit"
      initialValues={{
        fullName: customer.name,
        mobile: customer.mobile.replace(/\D/g, "").slice(-10),
        streetAddress: "12, Example Street",
        area: "Anna Nagar",
        city: "Chennai",
        postalCode: "600040",
        agent: customer.assignedAgent,
        status: customer.status === "active" ? "Active" : "Inactive",
      }}
    />
  );
}
