import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/session";
import { ROLE_HOMES } from "@/config/auth";

export const metadata = {
  title: "Sign in | THANDAL",
  description: "Sign in to THANDAL Lending & Collection Management Portal",
};

export const instant = false;

export default async function LoginPage() {
  // If user is already authenticated, redirect directly to their home dashboard
  const user = await getCurrentUser();
  if (user) {
    const home = ROLE_HOMES[user.role] || "/admin/overview";
    redirect(home);
  }

  return (
    <AuthShell>
      <Suspense fallback={<div className="h-96 w-full animate-pulse bg-white rounded-2xl" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
