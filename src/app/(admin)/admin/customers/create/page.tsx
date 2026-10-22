import React from "react";
import { CreateCustomerForm } from "@/components/customers/form/CreateCustomerForm";

export const metadata = {
  title: "Create Customer | THANDAL",
  description: "Register a new borrower account with documents and assignment",
};

export default function CreateCustomerPage() {
  return <CreateCustomerForm mode="create" />;
}
