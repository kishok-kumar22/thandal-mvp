"use client";

import React, { useRef, useState } from "react";
import { Clock, FileText, X, UploadCloud } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";

export interface VerificationProps {
  documentType: string;
  file: File | null;
  documentRequired?: boolean;
  onChange: (field: string, value: string | File | null) => void;
  errors: Record<string, string | undefined>;
}

export function VerificationSection({
  documentType,
  file,
  documentRequired = true,
  onChange,
  errors,
}: VerificationProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | undefined>(undefined);

  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

  const docTypeOptions = [
    { value: "Aadhaar Card", label: "Aadhaar Card" },
    { value: "Voter ID", label: "Voter ID" },
    { value: "Driving licence", label: "Driving Licence" },
    { value: "PAN Card", label: "PAN Card" },
  ];

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const selected = files[0];

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setFileError("Invalid file format. Upload PDF, JPG, or PNG.");
      return;
    }

    if (selected.size > MAX_SIZE_BYTES) {
      setFileError("File exceeds 5 MB size limit.");
      return;
    }

    setFileError(undefined);
    onChange("documentFile", selected);
  };

  return (
    <Card className="p-5 md:p-6 rounded-xl border border-[#E6ECF5]">
      {/* Responsive Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-[#0B1B3F]">
          <span className="hidden sm:inline">Verification</span>
          <span className="sm:hidden">
            Document upload {documentRequired ? "" : "(optional)"}
          </span>
        </h2>
      </div>

      {/* Grid: 3 columns on Desktop, Stacked on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_1fr] gap-4 items-start">
        {/* Document Type */}
        <FormField
          label="Document type"
          htmlFor="field-docType"
          required={documentRequired}
          optional={!documentRequired}
          error={errors.documentType}
        >
          <Select
            id="field-docType"
            value={documentType}
            onChange={(e) => onChange("documentType", e.target.value)}
            options={docTypeOptions}
          />
        </FormField>

        {/* Upload Document Dropzone */}
        <FormField
          label="Upload document"
          htmlFor="field-docUpload"
          required={documentRequired}
          optional={!documentRequired}
          error={fileError || errors.documentFile}
        >
          {file ? (
            /* Selected File State */
            <div className="h-14 px-3.5 rounded-lg border border-[#1F6BFF]/40 bg-[#EFF6FF]/60 flex items-center justify-between transition-all">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-5 h-5 text-[#1F6BFF] shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#0B1B3F] truncate">{file.name}</p>
                  <p className="text-[10px] text-[#64748B]">
                    {(file.size / 1024).toFixed(0)} KB &bull; Attached
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onChange("documentFile", null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="p-1 text-[#94A3B8] hover:text-[#E5252A] rounded-md transition-colors cursor-pointer"
                aria-label="Remove attached file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Empty Drag & Drop Zone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`h-14 px-4 rounded-lg border-2 border-dashed flex items-center justify-center gap-3 cursor-pointer transition-colors ${
                isDragOver
                  ? "border-[#1F6BFF] bg-[#EFF6FF]"
                  : errors.documentFile || fileError
                  ? "border-[#E5252A] bg-red-50/20"
                  : "border-[#B9C7DC] bg-slate-50/40 hover:bg-slate-50 hover:border-[#1F6BFF]/60"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />

              <FileText className="w-5 h-5 text-[#1F6BFF] shrink-0 hidden sm:block" />
              <UploadCloud className="w-5 h-5 text-[#1F6BFF] shrink-0 sm:hidden" />

              <div className="text-xs text-center sm:text-left">
                <span className="text-[#1F6BFF] font-semibold underline">Choose file</span>
                <span className="text-[#64748B]"> or drag and drop</span>
                <span className="block text-[10px] text-[#94A3B8]">
                  PDF, JPG, PNG (Max 5 MB)
                </span>
              </div>
            </div>
          )}
        </FormField>

        {/* Read-Only Verification Status Warning Panel */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#0B1B3F]">
            Verification status
          </label>
          <div className="h-11 sm:h-14 px-4 rounded-lg bg-[#FFF4DC] border border-[#F5C26B] flex items-center gap-2.5 text-xs font-bold text-[#B45309] select-none">
            <Clock className="w-4 h-4 text-[#B45309] shrink-0" />
            <span>Pending review</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
