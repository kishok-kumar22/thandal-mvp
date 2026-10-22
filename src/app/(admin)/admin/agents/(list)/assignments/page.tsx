import React from "react";
import { UserCheck } from "lucide-react";

export default function AssignmentsPage() {
  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] p-12 text-center shadow-xs">
      <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#1F6BFF] flex items-center justify-center mx-auto mb-3">
        <UserCheck className="w-6 h-6" />
      </div>
      <h2 className="text-lg font-bold text-[#0B1B3F] mb-1">Customer Assignments</h2>
      <p className="text-sm text-[#64748B] max-w-md mx-auto">
        Bulk borrower reallocation and agent territory assignment workflows are coming soon.
      </p>
    </div>
  );
}
