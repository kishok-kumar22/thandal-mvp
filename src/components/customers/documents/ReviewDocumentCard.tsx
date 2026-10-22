"use client";

import React, { useState, useEffect } from "react";
import { Info, CheckCircle, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import type { CustomerDocument } from "@/data/mockCustomers";

interface ReviewDocumentCardProps {
  selectedDoc: CustomerDocument | undefined;
  onUpdateStatus: (id: string, status: "verified" | "rejected", notes?: string) => void;
}

export function ReviewDocumentCard({ selectedDoc, onUpdateStatus }: ReviewDocumentCardProps) {
  const [notes, setNotes] = useState(selectedDoc?.notes || "");
  const [error, setError] = useState<string | undefined>(undefined);

  // Sync notes when selected document changes
  useEffect(() => {
    setNotes(selectedDoc?.notes || "");
    setError(undefined);
  }, [selectedDoc]);

  const handleMarkVerified = () => {
    if (!selectedDoc) return;
    setError(undefined);
    onUpdateStatus(selectedDoc.id, "verified", notes);
  };

  const handleRequestReplacement = () => {
    if (!selectedDoc) return;
    if (!notes.trim()) {
      setError("Please specify the reason for replacement request in verification notes.");
      return;
    }
    setError(undefined);
    onUpdateStatus(selectedDoc.id, "rejected", notes);
  };

  if (!selectedDoc) {
    return (
      <Card className="p-6">
        <h3 className="text-base font-bold text-[#0B1B3F]">Review document</h3>
        <p className="text-xs text-[#64748B] mt-1">Select a document from the table above to review.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-bold text-[#0B1B3F]">Review document</h3>
        <span className="text-xs text-[#1F6BFF] font-medium bg-[#EFF6FF] px-2.5 py-0.5 rounded-full">
          Selected: {selectedDoc.category} ({selectedDoc.fileName})
        </span>
      </div>

      <p className="text-xs text-[#64748B] mb-4">
        Add notes and update verification status for the selected document.
      </p>

      {/* Verification Notes */}
      <div className="space-y-4">
        <Textarea
          id="verification-notes"
          name="notes"
          label="Verification notes"
          placeholder="Enter notes about the document (e.g. clarity, validity, mismatch, etc.)…"
          rows={3}
          maxLength={500}
          showCount
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            if (error) setError(undefined);
          }}
          error={error}
        />

        {/* Buttons Row */}
        <div className="flex items-center gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            size="md"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={handleRequestReplacement}
          >
            Request replacement
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            icon={<CheckCircle className="w-4 h-4" />}
            onClick={handleMarkVerified}
          >
            Mark verified
          </Button>
        </div>

        {/* Authorization Note */}
        <div className="flex items-center gap-2 pt-2 text-xs text-[#64748B] border-t border-[#E6ECF5]">
          <Info className="w-4 h-4 text-[#94A3B8] shrink-0" />
          <span>Document review is restricted to authorised staff.</span>
        </div>
      </div>
    </Card>
  );
}
