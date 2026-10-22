"use client";

import React, { createContext, useContext, useState } from "react";
import {
  initialMockCustomer,
  type Customer,
  type CustomerDocument,
  type VerificationStatus,
} from "@/data/mockCustomers";

interface CustomerContextType {
  customer: Customer;
  selectedDocId: string;
  setSelectedDocId: (id: string) => void;
  updateDocStatus: (id: string, status: VerificationStatus, notes?: string) => void;
  addDocument: (doc: Omit<CustomerDocument, "id" | "uploadedAt" | "versions">) => void;
  deleteDocument: (id: string) => void;
  setPortalAccess: (enabled: boolean) => void;
  setConsentGiven: (consent: boolean) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerDataProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer>(initialMockCustomer);
  const [selectedDocId, setSelectedDocId] = useState<string>(
    initialMockCustomer.documents[0]?.id || "doc-1"
  );

  const updateDocStatus = (id: string, status: VerificationStatus, notes?: string) => {
    setCustomer((prev) => ({
      ...prev,
      documents: prev.documents.map((doc) =>
        doc.id === id ? { ...doc, status, notes: notes !== undefined ? notes : doc.notes } : doc
      ),
    }));
  };

  const addDocument = (
    doc: Omit<CustomerDocument, "id" | "uploadedAt" | "versions">
  ) => {
    const newDoc: CustomerDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      versions: 1,
      uploadedAt: "Just now",
    };
    setCustomer((prev) => ({
      ...prev,
      documents: [...prev.documents, newDoc],
    }));
    setSelectedDocId(newDoc.id);
  };

  const deleteDocument = (id: string) => {
    setCustomer((prev) => {
      const remaining = prev.documents.filter((d) => d.id !== id);
      if (selectedDocId === id && remaining.length > 0) {
        setSelectedDocId(remaining[0].id);
      }
      return { ...prev, documents: remaining };
    });
  };

  const setPortalAccess = (portalAccess: boolean) => {
    setCustomer((prev) => ({ ...prev, portalAccess }));
  };

  const setConsentGiven = (consentGiven: boolean) => {
    setCustomer((prev) => ({ ...prev, consentGiven }));
  };

  return (
    <CustomerContext.Provider
      value={{
        customer,
        selectedDocId,
        setSelectedDocId,
        updateDocStatus,
        addDocument,
        deleteDocument,
        setPortalAccess,
        setConsentGiven,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomerData() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomerData must be used within a CustomerDataProvider");
  }
  return context;
}
