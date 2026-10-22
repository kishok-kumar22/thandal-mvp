"use client";

import React, { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PasswordRules } from "@/components/ui/PasswordRules";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { changePassword } from "@/app/(customer)/customer/profile/actions";

interface ChangePasswordFormProps {
  mobileDigits?: string;
}

export function ChangePasswordForm({ mobileDigits }: ChangePasswordFormProps) {
  const router = useRouter();
  const alertRef = useRef<HTMLDivElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorAlert, setErrorAlert] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isLenValid = newPassword.length >= 8 && newPassword.length <= 128;
  const isDiffValid = newPassword.length > 0 && currentPassword ? newPassword !== currentPassword : false;
  const isMatchValid = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;
  const cleanMobile = (mobileDigits || "").replace(/\D/g, "");
  const isMobileFree = cleanMobile.length >= 6 ? !newPassword.includes(cleanMobile) : true;
  const isFormValid = isLenValid && isDiffValid && isMatchValid && isMobileFree;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    startTransition(async () => {
      const res = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (!res.success) {
        // Clear all three fields after any failure
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrorAlert(res.error || "Failed to change password.");

        // Focus the alert element
        setTimeout(() => {
          alertRef.current?.focus();
        }, 50);
        return;
      }

      setErrorAlert(null);
      showToast("Password changed", "success");
      router.push("/customer/profile");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alert panel for wrong password or other errors */}
      {errorAlert && (
        <div
          ref={alertRef}
          role="alert"
          tabIndex={-1}
          className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          {errorAlert}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E6ECF5] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Current Password */}
        <PasswordInput
          id="field-current-password"
          label="Current password"
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
            if (errorAlert) setErrorAlert(null);
          }}
          autoComplete="current-password"
          required
        />

        {/* New Password */}
        <PasswordInput
          id="field-new-password"
          label="New password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            if (errorAlert) setErrorAlert(null);
          }}
          autoComplete="new-password"
          required
        />

        {/* Confirm New Password */}
        <PasswordInput
          id="field-confirm-password"
          label="Confirm new password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errorAlert) setErrorAlert(null);
          }}
          autoComplete="new-password"
          required
        />

        {/* Password Rules Checklist */}
        <div className="pt-2 border-t border-[#EEF2F6]">
          <PasswordRules
            newPassword={newPassword}
            currentPassword={currentPassword}
            confirmPassword={confirmPassword}
            mobileDigits={mobileDigits}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          disabled={isPending || !isFormValid}
          className="w-full sm:w-auto px-8 h-12 rounded-xl text-base font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
          <span>Change password</span>
        </Button>
      </div>
    </form>
  );
}
