"use client";

import React from "react";
import { FileText, Image as ImageIcon, Download } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { CustomerDocument } from "@/data/mockCustomers";

interface DocumentPreviewModalProps {
  document: CustomerDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentPreviewModal({ document, isOpen, onClose }: DocumentPreviewModalProps) {
  if (!document) return null;

  const isPdf = document.fileType === "pdf" || document.fileName.endsWith(".pdf");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Preview: ${document.fileName}`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Document Header info */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] border border-[#E6ECF5] text-xs">
          <div>
            <span className="font-semibold text-[#0B1B3F]">{document.category}</span>
            <span className="text-[#64748B] ml-2">({document.type})</span>
          </div>
          <span className="text-[#64748B] font-mono">{document.sizeKb} KB</span>
        </div>

        {/* Placeholder preview viewport */}
        <div className="w-full h-72 sm:h-80 rounded-xl bg-[#F1F5F9] border-2 border-dashed border-[#CBD5E1] flex flex-col items-center justify-center p-6 text-center">
          {isPdf ? (
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#EF4444] flex items-center justify-center mb-3 shadow-xs">
              <FileText className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#F97316] flex items-center justify-center mb-3 shadow-xs">
              <ImageIcon className="w-8 h-8" />
            </div>
          )}

          <p className="text-sm font-bold text-[#0B1B3F]">{document.fileName}</p>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm">
            Simulated document viewer. Authentic document verified against state registry.
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs bg-white px-3 py-1 rounded-full border border-[#E6ECF5] text-[#334155] font-medium shadow-2xs">
              Version {document.versions} &bull; Uploaded {document.uploadedAt}
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => alert(`Downloading ${document.fileName}...`)}
          >
            Download File
          </Button>

          <Button variant="primary" size="sm" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </Modal>
  );
}
