"use client";

import React, { useState } from "react";
import { Clock, Eye, FileText, Image as ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RowMenu } from "./RowMenu";
import { DocumentPreviewModal } from "./DocumentPreviewModal";
import type { CustomerDocument } from "@/data/mockCustomers";

interface DocumentsTableProps {
  documents: CustomerDocument[];
  selectedDocId: string;
  onSelectDoc: (id: string) => void;
  onDeleteDoc: (id: string) => void;
}

export function DocumentsTable({
  documents,
  selectedDocId,
  onSelectDoc,
  onDeleteDoc,
}: DocumentsTableProps) {
  const [previewDoc, setPreviewDoc] = useState<CustomerDocument | null>(null);

  const getBadgeVariant = (status: CustomerDocument["status"]) => {
    switch (status) {
      case "pending":
        return "pending-review";
      case "verified":
        return "verified";
      case "uploaded":
        return "uploaded";
      case "rejected":
        return "rejected";
      default:
        return "pending";
    }
  };

  return (
    <>
      <Card className="p-6">
        {/* Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
          <h2 className="text-lg font-bold text-[#0B1B3F]">Proof documents</h2>
          <button
            type="button"
            onClick={() => alert("Showing full version audit history for customer documents.")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F6BFF] hover:underline cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Version history</span>
          </button>
        </div>

        <p className="text-xs text-[#64748B] mb-5">
          Upload and verify customer documents. All documents are reviewed before account activation.
        </p>

        {/* Table Container */}
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#64748B] text-xs font-semibold uppercase tracking-wider border-y border-[#E6ECF5]">
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Document</th>
                <th className="py-2.5 px-3">File</th>
                <th className="py-2.5 px-3">Verification</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6ECF5]">
              {documents.map((doc) => {
                const isSelected = selectedDocId === doc.id;
                const isPdf = doc.fileType === "pdf" || doc.fileName.endsWith(".pdf");

                return (
                  <tr
                    key={doc.id}
                    onClick={() => onSelectDoc(doc.id)}
                    aria-selected={isSelected}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#EFF6FF] border-l-4 border-l-[#1F6BFF]"
                        : "hover:bg-slate-50/70"
                    }`}
                  >
                    <td className="py-3.5 px-3 font-semibold text-[#0B1B3F] text-xs">
                      {doc.category}
                    </td>

                    <td className="py-3.5 px-3 text-xs text-[#334155]">{doc.type}</td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 shrink-0">
                          {isPdf ? (
                            <FileText className="w-4 h-4 text-[#EF4444]" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-[#F97316]" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewDoc(doc);
                            }}
                            className="text-xs font-semibold text-[#1F6BFF] hover:underline text-left cursor-pointer truncate max-w-[150px]"
                          >
                            {doc.fileName}
                          </button>
                          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mt-0.5">
                            <span>{doc.sizeKb} KB</span>
                            <span>&bull;</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Version history for ${doc.fileName}`);
                              }}
                              className="text-[#1F6BFF] hover:underline cursor-pointer"
                            >
                              Version history
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <Badge variant={getBadgeVariant(doc.status)} />
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs px-2.5"
                          icon={<Eye className="w-3.5 h-3.5" />}
                          onClick={() => setPreviewDoc(doc)}
                        >
                          Preview
                        </Button>
                        <RowMenu
                          fileName={doc.fileName}
                          onReplace={() => alert(`Replace file ${doc.fileName}`)}
                          onDownload={() => alert(`Downloading ${doc.fileName}`)}
                          onDelete={() => onDeleteDoc(doc.id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Preview Modal */}
      <DocumentPreviewModal
        document={previewDoc}
        isOpen={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
      />
    </>
  );
}
