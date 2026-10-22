"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, FileCheck } from "lucide-react";

interface DropZoneProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  error?: string;
  onErrorChange?: (error: string | undefined) => void;
}

export function DropZone({ file, onFileSelect, error, onErrorChange }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const selected = files[0];

    if (!ALLOWED_TYPES.includes(selected.type)) {
      onErrorChange?.("Invalid file type. Please upload a PDF, JPG, or PNG file.");
      return;
    }

    if (selected.size > MAX_SIZE_BYTES) {
      onErrorChange?.("File size exceeds 5 MB. Please upload a smaller file.");
      return;
    }

    onErrorChange?.(undefined);
    onFileSelect(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-[#0B1B3F]">
        File upload <span className="text-[#E5252A]">*</span>
      </label>

      {file ? (
        /* Selected File Card */
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#1F6BFF]/30 bg-[#EFF6FF]/60 transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-white text-[#1F6BFF] flex items-center justify-center shrink-0 border border-[#DBEAFE]">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#0B1B3F] truncate">{file.name}</p>
              <p className="text-[11px] text-[#64748B] font-mono">
                {(file.size / 1024).toFixed(0)} KB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onFileSelect(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            aria-label="Remove selected file"
            className="p-1.5 text-[#94A3B8] hover:text-[#E5252A] rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Drag & Drop Area */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
            isDragOver
              ? "border-[#1F6BFF] bg-[#EFF6FF]"
              : error
              ? "border-[#E5252A] bg-red-50/20"
              : "border-[#D9E1EC] hover:border-[#1F6BFF]/60 hover:bg-slate-50/60"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          <div className="w-11 h-11 rounded-full bg-[#EFF6FF] text-[#1F6BFF] flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>

          <p className="text-xs font-bold text-[#0B1B3F]">
            Upload front and back, if required
          </p>
          <p className="text-[11px] text-[#64748B] mt-1">
            PDF, JPG or PNG &bull; Max 5 MB per file
          </p>
        </div>
      )}

      {error && <p className="text-xs text-[#E5252A] font-medium">{error}</p>}
    </div>
  );
}
