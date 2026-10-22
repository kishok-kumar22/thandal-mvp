"use client";

import React from "react";
import { FileEdit, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DraftBannerProps {
  onResume: () => void;
  onDiscard: () => void;
}

export function DraftBanner({ onResume, onDiscard }: DraftBannerProps) {
  return (
    <div
      role="region"
      aria-label="Saved draft notice"
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl text-sm mb-6"
    >
      <div className="flex items-center gap-2.5 text-[#1D4ED8]">
        <FileEdit className="w-4 h-4 shrink-0 text-[#1F6BFF]" />
        <span className="font-medium">
          You have an unsaved loan draft from earlier. Resume your saved draft?
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="primary"
          onClick={onResume}
          className="h-8 text-xs px-3"
        >
          Resume
        </Button>
        <button
          type="button"
          onClick={onDiscard}
          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0B1B3F] hover:bg-white/60 transition-colors cursor-pointer"
          aria-label="Discard saved draft"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
