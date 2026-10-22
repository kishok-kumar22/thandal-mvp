import React from "react";
import { Check, Circle } from "lucide-react";

interface PasswordRulesProps {
  newPassword: string;
  currentPassword?: string;
  confirmPassword?: string;
  mobileDigits?: string;
}

export function PasswordRules({
  newPassword,
  currentPassword,
  confirmPassword,
  mobileDigits,
}: PasswordRulesProps) {
  const isLenValid = newPassword.length >= 8 && newPassword.length <= 128;
  const isDiffValid =
    newPassword.length > 0 && currentPassword ? newPassword !== currentPassword : true;

  // Check if mobile number (last 10 digits or 5+ consecutive digits) is contained
  const cleanMobile = (mobileDigits || "").replace(/\D/g, "");
  const isMobileFree =
    cleanMobile.length >= 6
      ? !newPassword.includes(cleanMobile) && !newPassword.includes(cleanMobile.slice(-5))
      : true;

  const isMatching =
    confirmPassword !== undefined
      ? Boolean(confirmPassword && newPassword === confirmPassword)
      : true;

  const rules = [
    {
      id: "length",
      text: "At least 8 characters (max 128)",
      passed: isLenValid,
    },
    {
      id: "different",
      text: "Different from current password",
      passed: isDiffValid,
    },
    {
      id: "no-mobile",
      text: "Does not contain your mobile number",
      passed: isMobileFree,
    },
    ...(confirmPassword !== undefined
      ? [
          {
            id: "match",
            text: "Both entries match",
            passed: isMatching,
          },
        ]
      : []),
  ];

  return (
    <ul className="space-y-2 text-xs" aria-label="Password complexity requirements">
      {rules.map((rule) => (
        <li
          key={rule.id}
          className={`flex items-center gap-2 font-medium ${
            rule.passed ? "text-[#16A34A]" : "text-[#64748B]"
          }`}
        >
          {rule.passed ? (
            <Check className="w-4 h-4 text-[#16A34A] shrink-0" aria-hidden="true" />
          ) : (
            <Circle className="w-4 h-4 text-[#94A3B8] shrink-0" aria-hidden="true" />
          )}
          <span className="sr-only">{rule.passed ? "Requirement met: " : "Requirement pending: "}</span>
          <span>{rule.text}</span>
        </li>
      ))}
    </ul>
  );
}
