import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/session";
import { getMyProfile } from "@/lib/customerPortal";
import { ChangePasswordForm } from "@/components/customer/ChangePasswordForm";

export const metadata = {
  title: "Change Password | THANDAL",
  description: "Update your account password securely.",
};

export default async function CustomerChangePasswordPage() {
  const user = await requireRole("customer", "/customer/profile/password");
  const profile = await getMyProfile(user);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 md:pb-12">
      {/* Header with Arrow-Left Back Button */}
      <div className="flex items-start gap-4">
        <Link
          href="/customer/profile"
          aria-label="Back to profile"
          className="p-2 -ml-2 rounded-xl text-[#0B1B3F] hover:bg-slate-200/60 transition-colors shrink-0 mt-1 cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3F] tracking-tight">
            Change password
          </h1>
          <p className="text-sm font-medium text-[#64748B] mt-1">
            Choose a strong, unique password to protect your account.
          </p>
        </div>
      </div>

      <ChangePasswordForm mobileDigits={profile.mobile} />
    </div>
  );
}
