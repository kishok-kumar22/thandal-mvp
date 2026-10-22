import React from "react";
import { MapPin } from "lucide-react";

export default function RoutesPage() {
  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] p-12 text-center shadow-xs">
      <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#1F6BFF] flex items-center justify-center mx-auto mb-3">
        <MapPin className="w-6 h-6" />
      </div>
      <h2 className="text-lg font-bold text-[#0B1B3F] mb-1">Collection Routes</h2>
      <p className="text-sm text-[#64748B] max-w-md mx-auto">
        Route definitions, street clustering, and daily collection boundaries are coming soon.
      </p>
    </div>
  );
}
