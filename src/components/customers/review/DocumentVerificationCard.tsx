import React from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { CustomerDocument } from "@/data/mockCustomers";

interface DocumentVerificationCardProps {
  documents: CustomerDocument[];
  customerId: string;
}

export function DocumentVerificationCard({
  documents,
  customerId,
}: DocumentVerificationCardProps) {
  const getDocStatus = (category: string) => {
    const doc = documents.find((d) => d.category.toLowerCase().includes(category.toLowerCase()));
    return doc?.status || "pending";
  };

  const identityStatus = getDocStatus("Identity");
  const addressStatus = getDocStatus("Address");
  const photoStatus = getDocStatus("photo");

  return (
    <Card className="p-6 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="pb-4 border-b border-[#E6ECF5]">
          <h2 className="text-base font-bold text-[#0B1B3F]">Document verification</h2>
        </div>

        {/* Verification Rows */}
        <div className="divide-y divide-[#E6ECF5]/80 text-xs py-1">
          <div className="py-3 flex items-center justify-between">
            <span className="text-[#334155] font-medium">Identity proof</span>
            <Badge variant={identityStatus === "verified" ? "verified" : identityStatus === "uploaded" ? "uploaded" : "pending"} />
          </div>

          <div className="py-3 flex items-center justify-between">
            <span className="text-[#334155] font-medium">Address proof</span>
            <Badge variant={addressStatus === "verified" ? "verified" : addressStatus === "uploaded" ? "uploaded" : "pending"} />
          </div>

          <div className="py-3 flex items-center justify-between">
            <span className="text-[#334155] font-medium">Customer photo</span>
            <Badge variant={photoStatus === "verified" ? "verified" : "uploaded"} />
          </div>
        </div>
      </div>

      {/* Full-width View Documents Button */}
      <div className="pt-6 mt-auto">
        <Link href={`/admin/customers/${customerId}/documents`} className="block">
          <Button
            type="button"
            variant="outline"
            size="md"
            className="w-full"
            icon={<FileText className="w-4 h-4" />}
          >
            View documents
          </Button>
        </Link>
      </div>
    </Card>
  );
}
