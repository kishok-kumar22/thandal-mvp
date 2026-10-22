import React from "react";
import { Phone, MapPin, Building2 } from "lucide-react";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { maskMobile } from "@/lib/mask";
import type { CustomerProfileView } from "@/lib/customerPortal";

interface ProfileCardProps {
  profile: CustomerProfileView;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const maskedPhone = maskMobile(profile.mobile, "portal");

  return (
    <div className="bg-white rounded-2xl border border-[#E6ECF5] p-6 sm:p-7 shadow-xs space-y-6">
      {/* Top Header: 130px Avatar + Name + Customer ID */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 sm:gap-6 text-center sm:text-left">
        <ProfileAvatar name={profile.name} size={130} />

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-[32px] font-bold text-[#0B1B3F] tracking-tight leading-tight">
            {profile.name}
          </h2>
          <p className="text-sm sm:text-base font-medium text-[#64748B]">
            Customer ID: {profile.customerId}
          </p>
        </div>
      </div>

      {/* Hairline Divider */}
      <div className="border-t border-[#EEF2F6]" />

      {/* 3 Rows: Mobile, Area, City */}
      <div className="space-y-5">
        {/* Mobile Number */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0 text-[#64748B]">
            <Phone className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Mobile Number
            </span>
            <span className="block text-xl sm:text-2xl font-bold text-[#0B1B3F] tracking-tight mt-0.5 tabular-nums">
              {maskedPhone}
            </span>
          </div>
        </div>

        {/* Area */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0 text-[#64748B]">
            <MapPin className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Area
            </span>
            <span className="block text-xl sm:text-2xl font-bold text-[#0B1B3F] tracking-tight mt-0.5">
              {profile.area}
            </span>
          </div>
        </div>

        {/* City */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0 text-[#64748B]">
            <Building2 className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              City
            </span>
            <span className="block text-xl sm:text-2xl font-bold text-[#0B1B3F] tracking-tight mt-0.5">
              {profile.city}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
