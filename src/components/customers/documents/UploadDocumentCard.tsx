"use client";

import React, { useState } from "react";
import { UploadCloud, Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { DropZone } from "./DropZone";
import { maskDocNumber } from "@/lib/mask";
import type { CustomerDocument, DocumentCategory } from "@/data/mockCustomers";

interface UploadDocumentCardProps {
  onAddDocument: (doc: Omit<CustomerDocument, "id" | "uploadedAt" | "versions">) => void;
}

export function UploadDocumentCard({ onAddDocument }: UploadDocumentCardProps) {
  const [category, setCategory] = useState<DocumentCategory>("Identity proof");
  const [docType, setDocType] = useState<string>("");
  const [docNumber, setDocNumber] = useState<string>("");
  const [isDocNumberFocused, setIsDocNumberFocused] = useState<boolean>(false);
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | undefined>(undefined);

  const categoryOptions = [
    { value: "Identity proof", label: "Identity proof" },
    { value: "Address proof", label: "Address proof" },
    { value: "Customer photo", label: "Customer photo" },
  ];

  const typeOptionsByCategory: Record<DocumentCategory, { value: string; label: string }[]> = {
    "Identity proof": [
      { value: "Aadhaar", label: "Aadhaar Card" },
      { value: "Voter ID", label: "Voter ID" },
      { value: "Driving licence", label: "Driving Licence" },
      { value: "PAN", label: "PAN Card" },
    ],
    "Address proof": [
      { value: "Utility bill", label: "Utility Bill (Electricity/Water)" },
      { value: "Rental agreement", label: "Rental Agreement" },
      { value: "Bank statement", label: "Bank Statement / Passbook" },
    ],
    "Customer photo": [{ value: "Photograph", label: "Photograph" }],
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCat = e.target.value as DocumentCategory;
    setCategory(newCat);
    setDocType("");
  };

  const isFormValid = Boolean(category && docType && file);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !file) return;

    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");

    onAddDocument({
      category,
      type: docType,
      fileName: file.name,
      sizeKb: Math.max(1, Math.round(file.size / 1024)),
      status: "uploaded",
      fileType: isPdf ? "pdf" : "image",
      documentNumber: docNumber ? maskDocNumber(docNumber) : undefined,
      expiryDate: expiryDate || undefined,
    });

    // Reset inputs
    setDocType("");
    setDocNumber("");
    setExpiryDate("");
    setFile(null);
    setFileError(undefined);
  };

  return (
    <Card className="p-6">
      <h3 className="text-base font-bold text-[#0B1B3F]">Upload document</h3>
      <p className="text-xs text-[#64748B] mt-0.5 mb-5">
        Add a new document for this customer.
      </p>

      <form onSubmit={handleUploadSubmit} className="space-y-4">
        {/* Document category */}
        <Select
          id="doc-category"
          label="Document category"
          value={category}
          onChange={handleCategoryChange}
          options={categoryOptions}
          required
        />

        {/* Document type */}
        <Select
          id="doc-type"
          label="Document type"
          placeholder="Select approved type"
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          options={typeOptionsByCategory[category] || []}
          required
        />

        {/* Document number (optional) with masking on blur */}
        <Input
          id="doc-number"
          label="Document number (optional)"
          placeholder="Enter document number"
          value={
            isDocNumberFocused
              ? docNumber
              : docNumber
              ? maskDocNumber(docNumber)
              : ""
          }
          onFocus={() => setIsDocNumberFocused(true)}
          onBlur={() => setIsDocNumberFocused(false)}
          onChange={(e) => setDocNumber(e.target.value)}
          helperText="Last 4 digits will be shown for security."
        />

        {/* Expiry date (if applicable) */}
        <Input
          id="doc-expiry"
          type="date"
          label="Expiry date (if applicable)"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          rightElement={<Calendar className="w-4 h-4 text-[#94A3B8]" />}
        />

        {/* Drop zone */}
        <DropZone
          file={file}
          onFileSelect={setFile}
          error={fileError}
          onErrorChange={setFileError}
        />

        {/* Full-width submit button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!isFormValid}
          className="w-full mt-2"
          icon={<UploadCloud className="w-4 h-4" />}
        >
          Upload document
        </Button>
      </form>
    </Card>
  );
}
